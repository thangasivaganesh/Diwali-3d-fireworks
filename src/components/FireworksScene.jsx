import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { playLaunch, playExplosion, playMegaExplosion, playSparkle, setAudioEnabled } from '../utils/soundEffects.js';
import { generateExplosionParticles, randomExplosionType, randomColor, COLOR_PALETTES, FIREWORK_TYPES } from '../utils/fireworksPhysics.js';

// ── Constants ──────────────────────────────────────────────────
const MAX_FIREWORKS = 25;
const STAR_COUNT = 2500;

// ── FireworksScene ─────────────────────────────────────────────
const FireworksScene = forwardRef(function FireworksScene({
  paused, autoShow, rainbowMode, goldenMode, soundEnabled,
  particleIntensity, showFrequency, onFireworkLaunched
}, ref) {

  const mountRef = useRef(null);
  const stateRef = useRef({
    paused, autoShow, rainbowMode, goldenMode, soundEnabled, particleIntensity, showFrequency
  });
  const internalRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    animId: null,
    rockets: [],
    explosions: [],
    ambientParticles: null,
    ambVelRef: null,
    clock: null,
    autoTimer: null,
    diyas: [],
    _lastFreq: showFrequency,
  });

  // Keep stateRef in sync with props
  useEffect(() => {
    stateRef.current = { paused, autoShow, rainbowMode, goldenMode, soundEnabled, particleIntensity, showFrequency };
    setAudioEnabled(soundEnabled);
  }, [paused, autoShow, rainbowMode, goldenMode, soundEnabled, particleIntensity, showFrequency]);

  // ── Spawn Firework ───────────────────────────────────────────
  const spawnFirework = useCallback((worldX, worldY) => {
    const { scene, rockets, explosions } = internalRef.current;
    const { rainbowMode: rm, goldenMode: gm, soundEnabled: se } = stateRef.current;

    if (!scene) return;
    if (rockets.length + explosions.length >= MAX_FIREWORKS * 2) return;

    if (se) playLaunch();
    if (onFireworkLaunched) onFireworkLaunched();

    const startX = worldX !== undefined ? worldX : (Math.random() - 0.5) * 60;
    const startZ = (Math.random() - 0.5) * 10;
    const startY = -30;
    const targetY = 10 + Math.random() * 32;
    const targetX = worldX !== undefined ? worldX : startX + (Math.random() - 0.5) * 15;

    // Rocket Point
    const rocketGeo = new THREE.BufferGeometry();
    const rocketPos = new Float32Array([startX, startY, startZ]);
    rocketGeo.setAttribute('position', new THREE.BufferAttribute(rocketPos, 3));

    // Trail
    const TRAIL_LEN = 20;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(TRAIL_LEN * 3);
    for (let i = 0; i < TRAIL_LEN; i++) {
      trailPositions[i * 3] = startX;
      trailPositions[i * 3 + 1] = startY;
      trailPositions[i * 3 + 2] = startZ;
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const palette = rm ? 'rainbow' : gm ? 'golden' : 'default';
    const rocketColor = randomColor(palette);
    const rocketMat = new THREE.PointsMaterial({
      color: new THREE.Color(...rocketColor),
      size: 3.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    const trailMat = new THREE.PointsMaterial({
      color: new THREE.Color(1, 0.7, 0.3),
      size: 1.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.65,
    });

    const rocketPoint = new THREE.Points(rocketGeo, rocketMat);
    const trailPoint = new THREE.Points(trailGeo, trailMat);
    scene.add(rocketPoint);
    scene.add(trailPoint);

    const rocket = {
      points: rocketPoint,
      trail: trailPoint,
      trailPositions,
      trailGeo,
      x: startX, y: startY, z: startZ,
      vx: (targetX - startX) * 0.03,
      vy: 0.85 + Math.random() * 0.35,
      vz: 0,
      targetY,
      exploded: false,
      color: rocketColor,
      type: randomExplosionType(),
      palette,
    };
    rockets.push(rocket);
  }, [onFireworkLaunched]);

  // ── Spawn Explosion ──────────────────────────────────────────
  const spawnExplosion = useCallback((x, y, z, type, color, palette, isSecondary = false) => {
    const { scene, explosions } = internalRef.current;
    const { particleIntensity: pi } = stateRef.current;
    if (!scene) return;

    const baseCount = isSecondary ? 80 : 200;
    const COUNT = Math.max(20, Math.floor(baseCount * (pi || 0.7)));
    const { velocities, colors, lifetimes, sizes } = generateExplosionParticles(type, COUNT, color);

    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    const cols = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      cols[i * 3]     = colors[i * 3];
      cols[i * 3 + 1] = colors[i * 3 + 1];
      cols[i * 3 + 2] = colors[i * 3 + 2];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));

    const mat = new THREE.PointsMaterial({
      size: isSecondary ? 2.2 : 3.2,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 1.0,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const velArr = [];
    for (let i = 0; i < COUNT; i++) {
      velArr.push({
        vx: velocities[i * 3],
        vy: velocities[i * 3 + 1],
        vz: velocities[i * 3 + 2],
      });
    }

    explosions.push({
      points, geo, mat, velArr,
      positions: geo.attributes.position.array,
      life: 0,
      maxLife: Math.max(1, ...lifetimes),
      lifetimes,
      gravity: type === FIREWORK_TYPES.WILLOW ? 0.003 : 0.0055,
      drag: 0.975,
      isSecondary,
    });

    // Double: spawn secondary bursts
    if (type === FIREWORK_TYPES.DOUBLE && !isSecondary) {
      for (let k = 0; k < 4; k++) {
        setTimeout(() => {
          const ang = (k / 4) * Math.PI * 2;
          const r = 8;
          spawnExplosion(
            x + r * Math.cos(ang),
            y + r * Math.sin(ang) * 0.5,
            z + r * Math.sin(ang),
            FIREWORK_TYPES.PEONY,
            color, palette, true
          );
        }, 200 + k * 100);
      }
    }
  }, []);

  // ── Mega Explosion ───────────────────────────────────────────
  const megaExplosion = useCallback(() => {
    const { soundEnabled: se } = stateRef.current;
    if (se) playMegaExplosion();
    const types = Object.values(FIREWORK_TYPES).filter(t => t !== FIREWORK_TYPES.METEOR);
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const x = (Math.random() - 0.5) * 50;
        const y = 15 + Math.random() * 30;
        const z = (Math.random() - 0.5) * 20;
        const type = types[i % types.length];
        const color = randomColor(stateRef.current.goldenMode ? 'golden' : 'default');
        spawnExplosion(x, y, z, type, color, 'default');
      }, i * 180);
    }
  }, [spawnExplosion]);

  // ── Grand Finale ─────────────────────────────────────────────
  const grandFinale = useCallback(() => {
    const { soundEnabled: se } = stateRef.current;
    if (se) playMegaExplosion();
    const total = 18;
    for (let i = 0; i < total; i++) {
      setTimeout(() => {
        spawnFirework();
      }, i * 220);
    }
    setTimeout(() => megaExplosion(), total * 220 + 400);
  }, [spawnFirework, megaExplosion]);

  // ── Launch Random ────────────────────────────────────────────
  const launchRandom = useCallback(() => spawnFirework(), [spawnFirework]);

  // ── Clear All ────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    const { scene, rockets, explosions } = internalRef.current;
    if (!scene) return;
    [...rockets, ...explosions].forEach(fw => {
      if (fw.points) {
        scene.remove(fw.points);
        fw.points.geometry?.dispose();
        fw.mat?.dispose();
        fw.points.material?.dispose();
      }
      if (fw.trail) {
        scene.remove(fw.trail);
        fw.trail.geometry?.dispose();
        fw.trail.material?.dispose();
      }
    });
    internalRef.current.rockets = [];
    internalRef.current.explosions = [];
  }, []);

  // ── Expose API ───────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    megaExplosion,
    grandFinale,
    launchRandom,
    clearAll,
  }), [megaExplosion, grandFinale, launchRandom, clearAll]);

  // ── Scene Init ───────────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x010010, 1);
    mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010010, 0.0035);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 80);
    camera.lookAt(0, 10, 0);

    // Clock
    const clock = new THREE.Clock();

    // ── Stars ────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    const starColors_ = [[1,1,1],[1,0.95,0.7],[0.7,0.8,1],[1,0.7,0.6]];
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 400 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      starPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i*3+2] = r * Math.cos(phi);
      const c = starColors_[Math.floor(Math.random() * starColors_.length)];
      starCol[i*3]=c[0]; starCol[i*3+1]=c[1]; starCol[i*3+2]=c[2];
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starCol, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.1, vertexColors: true, transparent: true, opacity: 0.85 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── Ambient Float Particles ──────────────────────────────
    const AMB = 200;
    const ambGeo = new THREE.BufferGeometry();
    const ambPos = new Float32Array(AMB * 3);
    const ambVel = [];
    const ambCol = new Float32Array(AMB * 3);
    const palette_ = [[1,.84,0],[1,.55,0],[1,.41,.71],[.54,.17,.89],[.2,.8,1],[.4,1,.4]];
    for (let i = 0; i < AMB; i++) {
      ambPos[i*3]   = (Math.random()-.5)*120;
      ambPos[i*3+1] = (Math.random()-.5)*80;
      ambPos[i*3+2] = (Math.random()-.5)*120;
      ambVel.push({ x:(Math.random()-.5)*.03, y:.015+Math.random()*.03, z:(Math.random()-.5)*.03 });
      const c = palette_[Math.floor(Math.random()*palette_.length)];
      ambCol[i*3]=c[0]; ambCol[i*3+1]=c[1]; ambCol[i*3+2]=c[2];
    }
    ambGeo.setAttribute('position', new THREE.BufferAttribute(ambPos, 3));
    ambGeo.setAttribute('color', new THREE.BufferAttribute(ambCol, 3));
    const ambMat = new THREE.PointsMaterial({ size: 2.0, vertexColors: true, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false });
    const ambParticles = new THREE.Points(ambGeo, ambMat);
    scene.add(ambParticles);

    // ── Ground / Silhouette ──────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshBasicMaterial({ color: 0x050012 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -32;
    scene.add(ground);

    // Temple silhouette
    const templeGroup = new THREE.Group();
    const towerMat = new THREE.MeshBasicMaterial({ color: 0x07001a });

    function createTempleStructure(baseX) {
      const g = new THREE.Group();
      const tower = new THREE.Mesh(new THREE.BoxGeometry(9, 26, 9), towerMat);
      tower.position.set(baseX, -19, -60);
      g.add(tower);

      const pyramid = new THREE.Mesh(new THREE.ConeGeometry(5.5, 12, 4), towerMat);
      pyramid.position.set(baseX, -3, -60);
      pyramid.rotation.y = Math.PI / 4;
      g.add(pyramid);

      for (const [ox, ow, oh] of [[-9, 6, 18], [9, 6, 18]]) {
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(ow, oh, ow), towerMat);
        t2.position.set(baseX + ox, -23, -60);
        g.add(t2);
        const p2 = new THREE.Mesh(new THREE.ConeGeometry(3.5, 8, 4), towerMat);
        p2.position.set(baseX + ox, -11, -60);
        p2.rotation.y = Math.PI / 4;
        g.add(p2);
      }
      return g;
    }

    templeGroup.add(createTempleStructure(-55));
    templeGroup.add(createTempleStructure(55));
    scene.add(templeGroup);

    // ── Diya Lamps ───────────────────────────────────────────
    const diyaLights = [];
    function addDiyas() {
      const positions = [];
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        positions.push([55 * Math.cos(angle), -31, 55 * Math.sin(angle)]);
      }
      positions.push([-30, -31, 5], [30, -31, 5], [-15, -31, 15], [15, -31, 15]);

      positions.forEach(([x, y, z]) => {
        const bowlGeo = new THREE.SphereGeometry(0.9, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
        const bowlMat = new THREE.MeshBasicMaterial({ color: 0xcc6600 });
        const bowl = new THREE.Mesh(bowlGeo, bowlMat);
        bowl.position.set(x, y, z);
        scene.add(bowl);

        const flameGeo = new THREE.SphereGeometry(0.35, 6, 6);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffbb00, transparent: true, opacity: 0.9 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(x, y + 0.95, z);
        scene.add(flame);

        const light = new THREE.PointLight(0xff8800, 0.85, 14);
        light.position.set(x, y + 1.1, z);
        scene.add(light);
        diyaLights.push({ light, flame, flameMat, baseIntensity: 0.85 });
      });
    }
    addDiyas();

    // Store refs
    internalRef.current.renderer = renderer;
    internalRef.current.scene = scene;
    internalRef.current.camera = camera;
    internalRef.current.clock = clock;
    internalRef.current.ambientParticles = ambParticles;
    internalRef.current.ambVelRef = ambVel;
    internalRef.current.diyas = diyaLights;
    internalRef.current.rockets = [];
    internalRef.current.explosions = [];

    // ── Resize ───────────────────────────────────────────────
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── Direct Canvas Click ──────────────────────────────────
    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const worldX = ndcX * 55;
      spawnFirework(worldX);
    };
    renderer.domElement.addEventListener('click', handleCanvasClick);

    // ── Animation Loop ───────────────────────────────────────
    function animate() {
      const id = requestAnimationFrame(animate);
      internalRef.current.animId = id;

      const { paused: isPaused } = stateRef.current;
      if (isPaused) {
        renderer.render(scene, camera);
        return;
      }

      const t = clock.getElapsedTime();
      const { rockets, explosions, ambVelRef: velsRef, ambientParticles: aParts, diyas: dLights } = internalRef.current;

      // Animate ambient floating motes
      if (aParts && velsRef) {
        const ap = aParts.geometry.attributes.position;
        for (let i = 0; i < AMB; i++) {
          const v = velsRef[i];
          ap.setX(i, ap.getX(i) + v.x);
          ap.setY(i, ap.getY(i) + v.y);
          ap.setZ(i, ap.getZ(i) + v.z);
          if (ap.getY(i) > 50) {
            ap.setX(i, (Math.random() - 0.5) * 120);
            ap.setY(i, -35 + Math.random() * 10);
            ap.setZ(i, (Math.random() - 0.5) * 120);
            v.x = (Math.random() - 0.5) * 0.03;
            v.y = 0.015 + Math.random() * 0.03;
            v.z = (Math.random() - 0.5) * 0.03;
          }
        }
        ap.needsUpdate = true;
        ambMat.opacity = 0.5 + 0.3 * Math.sin(t * 1.2);
      }

      // Animate diya flames
      dLights.forEach(({ light, flame, flameMat, baseIntensity }) => {
        const flicker = baseIntensity * (0.8 + 0.4 * Math.sin(t * 8 + Math.random() * 2));
        light.intensity = flicker;
        flame.scale.setScalar(0.9 + 0.2 * Math.sin(t * 12));
        flameMat.opacity = 0.7 + 0.3 * Math.sin(t * 7);
      });

      // Update rockets
      for (let ri = rockets.length - 1; ri >= 0; ri--) {
        const r = rockets[ri];
        if (r.exploded) {
          rockets.splice(ri, 1);
          continue;
        }

        r.x += r.vx;
        r.y += r.vy;
        r.vy *= 0.99;

        // Update rocket head position
        const posArr = r.points.geometry.attributes.position.array;
        posArr[0] = r.x;
        posArr[1] = r.y;
        posArr[2] = r.z;
        r.points.geometry.attributes.position.needsUpdate = true;

        // Update trail positions
        const tp = r.trailPositions;
        for (let ti = tp.length - 3; ti >= 3; ti -= 3) {
          tp[ti]     = tp[ti - 3];
          tp[ti + 1] = tp[ti - 2];
          tp[ti + 2] = tp[ti - 1];
        }
        tp[0] = r.x;
        tp[1] = r.y;
        tp[2] = r.z;
        r.trailGeo.attributes.position.needsUpdate = true;

        // Explode when reached target height
        if (r.y >= r.targetY) {
          r.exploded = true;
          scene.remove(r.points);
          scene.remove(r.trail);
          r.points.geometry.dispose();
          r.trail.geometry.dispose();
          r.points.material.dispose();
          r.trail.material.dispose();

          if (stateRef.current.soundEnabled) playExplosion();
          spawnExplosion(r.x, r.y, r.z, r.type, r.color, r.palette);
        }
      }

      // Update explosions
      for (let ei = explosions.length - 1; ei >= 0; ei--) {
        const fw = explosions[ei];
        fw.life++;
        const t_ = fw.life / fw.maxLife;
        fw.mat.opacity = Math.max(0, 1 - t_ * t_);

        const posArr = fw.positions;
        const vels = fw.velArr;
        for (let i = 0; i < vels.length; i++) {
          const v = vels[i];
          v.vy -= fw.gravity;
          v.vx *= fw.drag;
          v.vy *= fw.drag;
          v.vz *= fw.drag;
          posArr[i * 3]     += v.vx;
          posArr[i * 3 + 1] += v.vy;
          posArr[i * 3 + 2] += v.vz;
        }
        fw.geo.attributes.position.needsUpdate = true;

        if (fw.life >= fw.maxLife) {
          scene.remove(fw.points);
          fw.geo.dispose();
          fw.mat.dispose();
          explosions.splice(ei, 1);
        }
      }

      renderer.render(scene, camera);
    }
    animate();

    // ── Auto Show Timer ──────────────────────────────────────
    function startAutoInterval() {
      if (internalRef.current.autoTimer) clearInterval(internalRef.current.autoTimer);
      internalRef.current.autoTimer = setInterval(() => {
        if (stateRef.current.autoShow && !stateRef.current.paused) {
          spawnFirework();
        }
      }, stateRef.current.showFrequency || 2000);
    }
    startAutoInterval();

    const autoWatcher = setInterval(() => {
      const freq = stateRef.current.showFrequency;
      if (internalRef.current._lastFreq !== freq) {
        internalRef.current._lastFreq = freq;
        startAutoInterval();
      }
    }, 400);

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(internalRef.current.animId);
      clearInterval(internalRef.current.autoTimer);
      clearInterval(autoWatcher);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleCanvasClick);
      clearAll();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [clearAll, spawnExplosion, spawnFirework]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, cursor: 'crosshair' }}
    />
  );
});

export default FireworksScene;

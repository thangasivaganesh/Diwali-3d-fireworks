import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  buildAnarModel,
  buildPhuljhariModel,
  buildRocketModel,
  buildChakriModel,
  buildSutliModel,
  buildCascadeModel,
} from './CrackerModel.jsx';
import { CrackerParticleSystem, CRACKER_STATES, SPARKS_GOLD, SPARKS_RAINBOW } from '../utils/crackerAnimations.js';
import {
  playAnarSound,
  playChakriSound,
  playLaunch,
  playExplosion,
  playSparkle,
} from '../utils/soundEffects.js';

export default function Cracker3DViewer({
  crackerId,
  animationState,
  onStateChange,
  soundEnabled,
  particleIntensity = 1.0,
}) {
  const containerRef = useRef(null);
  const stateRef = useRef({
    crackerId,
    animationState,
    soundEnabled,
    particleIntensity,
    isIgnited: false,
    timer: 0,
    mousePos: new THREE.Vector2(),
    isPointerDown: false,
  });

  const internalRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    animId: null,
    currentModel: null,
    particleSys: null,
    clock: null,
    groundMesh: null,
    lightGlow: null,
    isOrbiting: false,
    prevMouse: { x: 0, y: 0 },
    spherical: { radius: 7.5, theta: 0.4, phi: 1.1 },
  });

  // Keep stateRef synced with props
  useEffect(() => {
    stateRef.current.crackerId = crackerId;
    stateRef.current.animationState = animationState;
    stateRef.current.soundEnabled = soundEnabled;
    stateRef.current.particleIntensity = particleIntensity;
  }, [crackerId, animationState, soundEnabled, particleIntensity]);

  // Load the selected 3D model into the scene
  const loadCrackerModel = useCallback((id) => {
    const { scene, currentModel, particleSys } = internalRef.current;
    if (!scene) return;

    if (currentModel) {
      scene.remove(currentModel);
      currentModel.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material?.dispose();
        }
      });
      internalRef.current.currentModel = null;
    }

    if (particleSys) {
      particleSys.clear();
    }

    let model;
    switch (id) {
      case 'anar':
        model = buildAnarModel();
        break;
      case 'phuljhari':
        model = buildPhuljhariModel();
        break;
      case 'rocket':
        model = buildRocketModel();
        break;
      case 'chakri':
        model = buildChakriModel();
        break;
      case 'sutli':
        model = buildSutliModel();
        break;
      case 'cascade':
        model = buildCascadeModel();
        break;
      default:
        model = buildAnarModel();
    }

    model.position.set(0, 0, 0);
    scene.add(model);
    internalRef.current.currentModel = model;

    // Reset camera target view
    internalRef.current.spherical = {
      radius: id === 'phuljhari' ? 6.5 : id === 'rocket' ? 8.5 : id === 'chakri' ? 6.0 : 7.2,
      theta: 0.35,
      phi: 1.15,
    };
  }, []);

  // Watch crackerId change
  useEffect(() => {
    loadCrackerModel(crackerId);
    stateRef.current.timer = 0;
    stateRef.current.isIgnited = false;
  }, [crackerId, loadCrackerModel]);

  // Handle Ignition trigger from parent
  useEffect(() => {
    if (animationState === CRACKER_STATES.IGNITING) {
      stateRef.current.timer = 0;
      stateRef.current.isIgnited = true;

      // Play appropriate sound
      if (stateRef.current.soundEnabled) {
        if (crackerId === 'anar') playAnarSound(5.0);
        else if (crackerId === 'chakri') playChakriSound(4.5);
        else if (crackerId === 'rocket') playLaunch();
        else if (crackerId === 'phuljhari') playSparkle();
        else if (crackerId === 'sutli') playLaunch();
        else if (crackerId === 'cascade') playAnarSound(5.5);
      }
    } else if (animationState === CRACKER_STATES.IDLE) {
      stateRef.current.isIgnited = false;
      stateRef.current.timer = 0;
      if (internalRef.current.particleSys) {
        internalRef.current.particleSys.clear();
      }
      // Reset model position/rotation
      const model = internalRef.current.currentModel;
      if (model) {
        model.position.set(0, 0, 0);
        model.rotation.set(0, 0, 0);
      }
    }
  }, [animationState, crackerId]);

  // Main 3D Canvas initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Scene
    const scene = new THREE.Scene();

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 7.5);
    scene.add(camera);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    dirLight.position.set(5, 10, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0xf59e0b, 1.2, 16);
    rimLight.position.set(-6, 4, -4);
    scene.add(rimLight);

    // Flame / Ignition light (emits during active state)
    const flameLight = new THREE.PointLight(0xff7700, 0, 15);
    flameLight.position.set(0, 2.8, 0);
    scene.add(flameLight);

    // 5. Floor Ground with subtle reflection
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0518,
      roughness: 0.6,
      metalness: 0.3,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Floor gold circular dais
    const daisGeo = new THREE.CylinderGeometry(2.8, 2.9, 0.08, 48);
    const daisMat = new THREE.MeshStandardMaterial({
      color: 0x1e1538,
      metalness: 0.6,
      roughness: 0.3,
    });
    const dais = new THREE.Mesh(daisGeo, daisMat);
    dais.position.y = 0.04;
    dais.receiveShadow = true;
    scene.add(dais);

    // Gold rim around dais
    const daisRimGeo = new THREE.TorusGeometry(2.85, 0.04, 12, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const daisRim = new THREE.Mesh(daisRimGeo, goldMat);
    daisRim.rotation.x = Math.PI / 2;
    daisRim.position.y = 0.08;
    scene.add(daisRim);

    // 6. Particle System
    const particleSys = new CrackerParticleSystem(1800);
    scene.add(particleSys.points);

    // Store refs
    internalRef.current.renderer = renderer;
    internalRef.current.scene = scene;
    internalRef.current.camera = camera;
    internalRef.current.particleSys = particleSys;
    internalRef.current.lightGlow = flameLight;
    internalRef.current.clock = new THREE.Clock();

    // Initial model load
    loadCrackerModel(stateRef.current.crackerId);

    // 7. Mouse / Touch Orbit Controls
    const onPointerDown = (e) => {
      internalRef.current.isOrbiting = true;
      internalRef.current.prevMouse = { x: e.clientX, y: e.clientY };
      stateRef.current.isPointerDown = true;
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      stateRef.current.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      stateRef.current.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!internalRef.current.isOrbiting) return;
      const dx = e.clientX - internalRef.current.prevMouse.x;
      const dy = e.clientY - internalRef.current.prevMouse.y;
      internalRef.current.prevMouse = { x: e.clientX, y: e.clientY };

      const sph = internalRef.current.spherical;
      sph.theta -= dx * 0.009;
      sph.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, sph.phi - dy * 0.009));
    };

    const onPointerUp = () => {
      internalRef.current.isOrbiting = false;
      stateRef.current.isPointerDown = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const sph = internalRef.current.spherical;
      sph.radius = Math.max(3.5, Math.min(14, sph.radius + e.deltaY * 0.008));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // 8. Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 9. Animation Loop
    function animate() {
      const id = requestAnimationFrame(animate);
      internalRef.current.animId = id;

      const delta = Math.min(internalRef.current.clock.getDelta(), 0.1);
      const { spherical, camera, currentModel, lightGlow } = internalRef.current;
      const { crackerId: cid, isIgnited, particleIntensity: pIntensity } = stateRef.current;

      // Update camera from spherical coordinates
      const camY = spherical.radius * Math.cos(spherical.phi);
      const camX = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      const camZ = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.position.set(camX, Math.max(0.4, camY), camZ);

      const lookTarget = cid === 'rocket' && currentModel?.position.y > 2 ? currentModel.position : new THREE.Vector3(0, 1.5, 0);
      camera.lookAt(lookTarget);

      // Cracker live animation logic
      if (isIgnited) {
        stateRef.current.timer += delta;
        const elapsed = stateRef.current.timer;

        // Anar (Fountain)
        if (cid === 'anar') {
          if (elapsed < 0.6) {
            onStateChange(CRACKER_STATES.IGNITING);
            lightGlow.intensity = 1.0 + Math.random() * 2.0;
            // Emit small fuse sparks
            particleSys.emit(
              new THREE.Vector3(0.08, 3.1, -0.04),
              new THREE.Vector3((Math.random() - 0.5) * 1.5, Math.random() * 2.0, (Math.random() - 0.5) * 1.5),
              SPARKS_GOLD[Math.floor(Math.random() * SPARKS_GOLD.length)],
              0.4,
              2.5
            );
          } else if (elapsed < 4.8) {
            onStateChange(CRACKER_STATES.ACTIVE);
            const intensity = Math.min(1.0, (elapsed - 0.6) / 0.8);
            const fountainHeight = 4.0 + 4.5 * Math.sin(((elapsed - 0.6) / 4.2) * Math.PI);
            lightGlow.intensity = 3.5 + Math.random() * 2.5;
            lightGlow.position.set(0, 2.7, 0);

            const spawnCount = Math.floor(18 * intensity * pIntensity);
            for (let s = 0; s < spawnCount; s++) {
              const spread = 0.35 + (fountainHeight / 8.5) * 0.45;
              const vx = (Math.random() - 0.5) * spread * 3.5;
              const vz = (Math.random() - 0.5) * spread * 3.5;
              const vy = fountainHeight * (0.8 + Math.random() * 0.4);

              const color = SPARKS_GOLD[Math.floor(Math.random() * SPARKS_GOLD.length)];
              particleSys.emit(
                new THREE.Vector3(0, 2.68, 0),
                new THREE.Vector3(vx, vy, vz),
                color,
                0.6 + Math.random() * 0.7,
                3.5
              );

              // Embers / smoke
              if (Math.random() < 0.15) {
                particleSys.emit(
                  new THREE.Vector3(vx * 0.2, 2.68, vz * 0.2),
                  new THREE.Vector3(vx * 0.4, vy * 0.3, vz * 0.4),
                  new THREE.Color(0.8, 0.4, 0.1),
                  1.2,
                  2.0,
                  1
                );
              }
            }
          } else if (elapsed < 6.0) {
            onStateChange(CRACKER_STATES.FADING);
            lightGlow.intensity *= 0.94;
          } else {
            onStateChange(CRACKER_STATES.IDLE);
            stateRef.current.isIgnited = false;
            lightGlow.intensity = 0;
          }
        }

        // Phuljhari (Sparkler)
        else if (cid === 'phuljhari') {
          if (elapsed < 5.5) {
            onStateChange(CRACKER_STATES.ACTIVE);
            lightGlow.intensity = 2.0 + Math.random() * 2.0;

            // Interactive mouse waving
            if (currentModel) {
              const targetRotZ = stateRef.current.mousePos.x * 0.5;
              const targetRotX = -stateRef.current.mousePos.y * 0.5;
              currentModel.rotation.z += (targetRotZ - currentModel.rotation.z) * 0.1;
              currentModel.rotation.x += (targetRotX - currentModel.rotation.x) * 0.1;
            }

            const tipPos = new THREE.Vector3(0, 4.22, 0);
            if (currentModel) tipPos.applyMatrix4(currentModel.matrixWorld);
            lightGlow.position.copy(tipPos);

            const count = Math.floor(12 * pIntensity);
            for (let s = 0; s < count; s++) {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.random() * Math.PI;
              const sp = 2.2 + Math.random() * 3.5;
              const vx = sp * Math.sin(phi) * Math.cos(theta);
              const vy = sp * Math.cos(phi);
              const vz = sp * Math.sin(phi) * Math.sin(theta);

              const color = SPARKS_GOLD[Math.floor(Math.random() * SPARKS_GOLD.length)];
              particleSys.emit(tipPos, new THREE.Vector3(vx, vy, vz), color, 0.35 + Math.random() * 0.45, 3.2);
            }
          } else {
            onStateChange(CRACKER_STATES.IDLE);
            stateRef.current.isIgnited = false;
            lightGlow.intensity = 0;
            if (currentModel) {
              currentModel.rotation.set(0, 0, 0);
            }
          }
        }

        // Rocket Firework
        else if (cid === 'rocket') {
          if (elapsed < 0.6) {
            onStateChange(CRACKER_STATES.IGNITING);
            lightGlow.intensity = 2.0;
            lightGlow.position.set(0, 0.6, 0);
            particleSys.emit(
              new THREE.Vector3(0, 0.6, 0),
              new THREE.Vector3((Math.random() - 0.5) * 1.5, -Math.random() * 2.0, (Math.random() - 0.5) * 1.5),
              new THREE.Color(1.0, 0.6, 0.1),
              0.3,
              3.0
            );
          } else if (elapsed < 2.0) {
            onStateChange(CRACKER_STATES.ACTIVE);
            const launchT = (elapsed - 0.6) / 1.4;
            const climbY = Math.pow(launchT, 2.2) * 12.0;
            if (currentModel) currentModel.position.y = climbY;

            const exhaustPos = new THREE.Vector3(0, climbY + 0.8, 0);
            lightGlow.position.copy(exhaustPos);
            lightGlow.intensity = 4.0;

            // Exhaust fire & smoke trail
            for (let s = 0; s < 10; s++) {
              particleSys.emit(
                exhaustPos,
                new THREE.Vector3((Math.random() - 0.5) * 0.8, -4.0 - Math.random() * 3.0, (Math.random() - 0.5) * 0.8),
                new THREE.Color(1.0, 0.8, 0.2),
                0.4,
                3.8
              );
            }
          } else if (elapsed < 2.1) {
            // Apex explosion burst!
            if (stateRef.current.soundEnabled) playExplosion();
            const burstPos = currentModel ? currentModel.position.clone().add(new THREE.Vector3(0, 3, 0)) : new THREE.Vector3(0, 14, 0);
            if (currentModel) currentModel.visible = false;

            const burstCount = Math.floor(180 * pIntensity);
            for (let s = 0; s < burstCount; s++) {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(2 * Math.random() - 1);
              const sp = 4.0 + Math.random() * 5.0;
              const vx = sp * Math.sin(phi) * Math.cos(theta);
              const vy = sp * Math.sin(phi) * Math.sin(theta);
              const vz = sp * Math.cos(phi);

              const color = SPARKS_RAINBOW[Math.floor(Math.random() * SPARKS_RAINBOW.length)];
              particleSys.emit(burstPos, new THREE.Vector3(vx, vy, vz), color, 0.9 + Math.random() * 0.7, 4.0);
            }
            onStateChange(CRACKER_STATES.FADING);
          } else if (elapsed < 3.8) {
            // fading particles
          } else {
            onStateChange(CRACKER_STATES.IDLE);
            stateRef.current.isIgnited = false;
            lightGlow.intensity = 0;
            if (currentModel) {
              currentModel.position.set(0, 0, 0);
              currentModel.visible = true;
            }
          }
        }

        // Chakri (Ground Wheel)
        else if (cid === 'chakri') {
          if (elapsed < 0.5) {
            onStateChange(CRACKER_STATES.IGNITING);
            lightGlow.intensity = 1.5;
          } else if (elapsed < 4.2) {
            onStateChange(CRACKER_STATES.ACTIVE);
            const activeT = (elapsed - 0.5) / 3.7;
            const spinSpeed = 25.0 * Math.sin(activeT * Math.PI);

            const wheel = currentModel?.getObjectByName('chakri_wheel');
            if (wheel) wheel.rotation.y += spinSpeed * delta;

            lightGlow.intensity = 3.5;
            lightGlow.position.set(0, 0.3, 0);

            // Centrifugal rotating spray of sparks
            const count = Math.floor(16 * pIntensity);
            for (let s = 0; s < count; s++) {
              const angle = Math.random() * Math.PI * 2;
              const sp = 3.5 + Math.random() * 3.5;
              const vx = Math.cos(angle) * sp;
              const vz = Math.sin(angle) * sp;
              const vy = 0.2 + Math.random() * 0.8;

              const color = Math.random() < 0.6 ? SPARKS_GOLD[0] : SPARKS_RAINBOW[0];
              particleSys.emit(
                new THREE.Vector3(Math.cos(angle) * 1.5, 0.16, Math.sin(angle) * 1.5),
                new THREE.Vector3(vx, vy, vz),
                color,
                0.45 + Math.random() * 0.4,
                3.2
              );
            }
          } else if (elapsed < 5.2) {
            onStateChange(CRACKER_STATES.FADING);
            lightGlow.intensity *= 0.92;
          } else {
            onStateChange(CRACKER_STATES.IDLE);
            stateRef.current.isIgnited = false;
            lightGlow.intensity = 0;
          }
        }

        // Sutli Bomb (Visual simulation only)
        else if (cid === 'sutli') {
          if (elapsed < 1.2) {
            onStateChange(CRACKER_STATES.IGNITING);
            // Fuse burning spark
            const fuseTip = currentModel?.getObjectByName('sutli_fuse_tip');
            if (fuseTip) {
              particleSys.emit(
                fuseTip.position.clone().add(new THREE.Vector3(0, 0.7, 0)),
                new THREE.Vector3((Math.random() - 0.5) * 1.2, Math.random() * 1.5, (Math.random() - 0.5) * 1.2),
                SPARKS_GOLD[0],
                0.25,
                2.5
              );
            }
            lightGlow.intensity = 1.0 + Math.random();
          } else if (elapsed < 1.3) {
            // Flash & burst
            if (stateRef.current.soundEnabled) playExplosion();
            onStateChange(CRACKER_STATES.ACTIVE);
            if (currentModel) currentModel.visible = false;
            lightGlow.intensity = 7.0;

            const burstCount = Math.floor(140 * pIntensity);
            for (let s = 0; s < burstCount; s++) {
              const theta = Math.random() * Math.PI * 2;
              const phi = Math.acos(2 * Math.random() - 1);
              const sp = 4.0 + Math.random() * 4.5;
              const vx = sp * Math.sin(phi) * Math.cos(theta);
              const vy = Math.abs(sp * Math.sin(phi) * Math.sin(theta)) * 0.8 + 1.0;
              const vz = sp * Math.cos(phi);

              const color = SPARKS_RAINBOW[Math.floor(Math.random() * SPARKS_RAINBOW.length)];
              particleSys.emit(new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(vx, vy, vz), color, 0.7 + Math.random() * 0.5, 3.5);

              // Smoke cloud
              if (s % 3 === 0) {
                particleSys.emit(new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(vx * 0.3, vy * 0.4, vz * 0.3), new THREE.Color(0.4, 0.4, 0.4), 1.4, 4.0, 2);
              }
            }
          } else if (elapsed < 2.8) {
            onStateChange(CRACKER_STATES.FADING);
            lightGlow.intensity *= 0.85;
          } else {
            onStateChange(CRACKER_STATES.IDLE);
            stateRef.current.isIgnited = false;
            lightGlow.intensity = 0;
            if (currentModel) currentModel.visible = true;
          }
        }

        // Golden Cascade (Waterfall)
        else if (cid === 'cascade') {
          if (elapsed < 5.0) {
            onStateChange(CRACKER_STATES.ACTIVE);
            lightGlow.intensity = 3.0;
            lightGlow.position.set(0, 2.5, 0);

            const offsets = [-1.3, -0.65, 0, 0.65, 1.3];
            offsets.forEach((ox) => {
              const count = Math.floor(4 * pIntensity);
              for (let s = 0; s < count; s++) {
                const vx = (Math.random() - 0.5) * 0.4;
                const vy = -1.5 - Math.random() * 2.5;
                const vz = (Math.random() - 0.5) * 0.4;
                particleSys.emit(
                  new THREE.Vector3(ox + (Math.random() - 0.5) * 0.1, 2.2, (Math.random() - 0.5) * 0.1),
                  new THREE.Vector3(vx, vy, vz),
                  SPARKS_GOLD[Math.floor(Math.random() * SPARKS_GOLD.length)],
                  1.1 + Math.random() * 0.6,
                  3.4
                );
              }
            });
          } else {
            onStateChange(CRACKER_STATES.IDLE);
            stateRef.current.isIgnited = false;
            lightGlow.intensity = 0;
          }
        }
      } else {
        // Idle gentle float or turntable rotation if not user-dragging
        if (!internalRef.current.isOrbiting && currentModel && cid !== 'phuljhari') {
          currentModel.rotation.y += 0.005;
        }
      }

      // Update particle physics
      particleSys.update(delta);

      // Render scene
      renderer.render(scene, camera);
    }

    animate();

    // 10. Cleanup on unmount
    return () => {
      cancelAnimationFrame(internalRef.current.animId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);

      particleSys.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [loadCrackerModel, onStateChange]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {crackerId === 'phuljhari' && (
        <div className="absolute top-3 left-3 pointer-events-none glass px-3 py-1.5 text-xs text-yellow-300 border border-yellow-400/40">
          ✨ Move mouse/touch to wave the sparkler!
        </div>
      )}
    </div>
  );
}

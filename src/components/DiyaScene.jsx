import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { createRangoliTexture } from '../utils/textureGenerator.js';
import { playDiyaChime } from '../utils/soundEffects.js';
import { Flame, Sparkles } from 'lucide-react';

export default function DiyaScene({ isTamil, soundEnabled }) {
  const containerRef = useRef(null);
  const [diyasLit, setDiyasLit] = useState([true, true, true, false, false, false, true, false]);
  const [allLit, setAllLit] = useState(false);

  const sceneStateRef = useRef({
    diyasLit: [true, true, true, false, false, false, true, false],
    soundEnabled,
    renderer: null,
    scene: null,
    camera: null,
    animId: null,
    diyaObjects: [],
    clock: new THREE.Clock(),
    isDragging: false,
    prevMouse: { x: 0, y: 0 },
    spherical: { radius: 9.0, theta: 0.3, phi: 0.95 },
  });

  useEffect(() => {
    sceneStateRef.current.diyasLit = diyasLit;
    sceneStateRef.current.soundEnabled = soundEnabled;
  }, [diyasLit, soundEnabled]);

  // Toggle individual diya
  const toggleDiya = useCallback((index) => {
    setDiyasLit((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      if (next[index] && sceneStateRef.current.soundEnabled) {
        playDiyaChime();
      }
      return next;
    });
  }, []);

  // Light all diyas
  const handleLightAll = () => {
    setDiyasLit(diyasLit.map(() => true));
    setAllLit(true);
    if (soundEnabled) playDiyaChime();
  };

  // Reset / extinguish some
  const handleResetDiyas = () => {
    setDiyasLit([true, false, true, false, true, false, false, false]);
    setAllLit(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Scene
    const scene = new THREE.Scene();

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 8);
    scene.add(camera);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x2e1065, 0.8);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xa5b4fc, 0.6);
    moonLight.position.set(5, 12, -4);
    scene.add(moonLight);

    // 5. Floor with Rangoli design
    const rangoliTexture = createRangoliTexture();
    const floorGeo = new THREE.CircleGeometry(5.5, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      map: rangoliTexture,
      transparent: true,
      roughness: 0.4,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Outer gold border ring
    const borderGeo = new THREE.RingGeometry(5.4, 5.6, 64);
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.rotation.x = -Math.PI / 2;
    border.position.y = 0.01;
    scene.add(border);

    // 6. Build Diyas arranged in auspicious circle
    const diyaCount = 8;
    const diyaRadius = 3.6;
    const diyaObjects = [];

    // Raycasting for clicking diyas in 3D
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    for (let i = 0; i < diyaCount; i++) {
      const angle = (i / diyaCount) * Math.PI * 2;
      const x = Math.cos(angle) * diyaRadius;
      const z = Math.sin(angle) * diyaRadius;

      const diyaGroup = new THREE.Group();
      diyaGroup.position.set(x, 0, z);
      diyaGroup.rotation.y = -angle + Math.PI / 2;
      diyaGroup.userData = { index: i };

      // Terracotta Clay Bowl
      const bowlGeo = new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const bowlMat = new THREE.MeshStandardMaterial({
        color: 0x9a3412, // Rich terracotta red-orange
        roughness: 0.8,
        metalness: 0.1,
      });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.castShadow = true;
      bowl.userData = { index: i };
      diyaGroup.add(bowl);

      // Gold lip edge
      const lipGeo = new THREE.TorusGeometry(0.55, 0.04, 12, 24);
      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.85,
        roughness: 0.25,
      });
      const lip = new THREE.Mesh(lipGeo, goldMat);
      lip.rotation.x = Math.PI / 2;
      lip.position.y = 0.02;
      diyaGroup.add(lip);

      // Flame Mesh
      const flameGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.95,
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.scale.set(0.8, 1.8, 0.8);
      flame.position.set(0, 0.55, 0.18);
      diyaGroup.add(flame);

      // Point Light
      const pointLight = new THREE.PointLight(0xff9900, 1.4, 6.0);
      pointLight.position.set(0, 0.85, 0.18);
      pointLight.castShadow = true;
      diyaGroup.add(pointLight);

      scene.add(diyaGroup);
      diyaObjects.push({ group: diyaGroup, flame, pointLight, bowl });
    }

    // Floating golden embers around diyas
    const emberCount = 120;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 4.5;
      emberPos[i * 3] = Math.cos(a) * r;
      emberPos[i * 3 + 1] = 0.2 + Math.random() * 2.5;
      emberPos[i * 3 + 2] = Math.sin(a) * r;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 1.8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const embers = new THREE.Points(emberGeo, emberMat);
    scene.add(embers);

    sceneStateRef.current.diyaObjects = diyaObjects;

    // 7. Click to toggle diya
    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = diyaObjects.map((d) => d.bowl);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedIndex = intersects[0].object.userData.index;
        toggleDiya(clickedIndex);
      }
    };

    // Orbit Drag Controls
    const onPointerDown = (e) => {
      sceneStateRef.current.isDragging = true;
      sceneStateRef.current.prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (!sceneStateRef.current.isDragging) return;
      const dx = e.clientX - sceneStateRef.current.prevMouse.x;
      const dy = e.clientY - sceneStateRef.current.prevMouse.y;
      sceneStateRef.current.prevMouse = { x: e.clientX, y: e.clientY };

      const sph = sceneStateRef.current.spherical;
      sph.theta -= dx * 0.008;
      sph.phi = Math.max(0.4, Math.min(Math.PI / 2 - 0.1, sph.phi - dy * 0.008));
    };

    const onPointerUp = () => {
      sceneStateRef.current.isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('click', handleCanvasClick);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation Loop
    function animate() {
      const id = requestAnimationFrame(animate);
      sceneStateRef.current.animId = id;

      const time = sceneStateRef.current.clock.getElapsedTime();
      const currentLit = sceneStateRef.current.diyasLit;

      // Update camera position
      const sph = sceneStateRef.current.spherical;
      if (!sceneStateRef.current.isDragging) {
        sph.theta += 0.002; // slow gentle ambient turn
      }
      const camY = sph.radius * Math.cos(sph.phi);
      const camX = sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      const camZ = sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      camera.position.set(camX, Math.max(1.0, camY), camZ);
      camera.lookAt(0, 0.4, 0);

      // Animate Diya flame flickers based on lit state
      diyaObjects.forEach((diya, idx) => {
        const isLit = currentLit[idx];
        if (isLit) {
          diya.flame.visible = true;
          diya.pointLight.visible = true;

          const flicker = 0.8 + 0.4 * Math.sin(time * 9 + idx * 1.5) + (Math.random() - 0.5) * 0.15;
          diya.pointLight.intensity = Math.max(0.2, 1.4 * flicker);
          diya.flame.scale.set(0.7 + flicker * 0.2, (1.6 + flicker * 0.4), 0.7 + flicker * 0.2);
        } else {
          diya.flame.visible = false;
          diya.pointLight.visible = false;
        }
      });

      // Float embers gently
      const pos = emberGeo.attributes.position.array;
      for (let i = 0; i < emberCount; i++) {
        pos[i * 3 + 1] += 0.008;
        if (pos[i * 3 + 1] > 3.0) pos[i * 3 + 1] = 0.2;
      }
      emberGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(sceneStateRef.current.animId);
      dom.removeEventListener('click', handleCanvasClick);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      floorGeo.dispose();
      floorMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [toggleDiya]);

  const litCount = diyasLit.filter(Boolean).length;

  return (
    <section id="diyas-section" className="relative w-full py-16 px-4 md:px-8 z-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Flame size={14} className="text-orange-400" />
          {isTamil ? 'மங்கல தீபங்கள் & ரங்கோலி' : 'Sacred Diyas & Rangoli Floor'}
        </div>
        <h2 className="gold-text font-black text-3xl md:text-5xl tracking-wide">
          {isTamil ? 'ஒளிரும் தீபங்களை ஏற்றுங்கள்' : 'Light Up the Sacred Diyas'}
        </h2>
        <p className="mt-3 text-yellow-200/70 text-sm md:text-base max-w-xl mx-auto">
          {isTamil
            ? 'பாரம்பரிய களிமண் அகல் விளக்குகளைத் தொட்டு ஒவ்வொன்றாக ஏற்றுங்கள். அனைத்து தீபங்களையும் ஏற்றி இல்லத்தில் மங்கல ஒளியைப் பரப்புங்கள்!'
            : 'Click on individual clay lamps to ignite them, or light all diyas together to illuminate the sacred Rangoli mandala.'}
        </p>
      </div>

      {/* 3D Diya Stage */}
      <div className="glass rounded-3xl p-6 border border-yellow-400/30 shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
        <div className="w-full h-80 sm:h-[420px] rounded-2xl bg-gradient-to-b from-indigo-950/30 to-black/90 border border-yellow-400/20 relative overflow-hidden">
          <div ref={containerRef} className="w-full h-full cursor-pointer" />
          <div className="absolute top-3 left-3 glass px-3 py-1.5 text-xs text-yellow-300 font-semibold border border-yellow-400/40">
            🪔 {litCount} / 8 {isTamil ? 'தீபங்கள் ஒளிர்கின்றன' : 'Diyas Glowing'}
          </div>
          <div className="absolute bottom-3 right-3 text-[11px] text-yellow-300/50 tracking-wide pointer-events-none">
            🖱️ {isTamil ? 'தீபத்தைத் தொடவும் | சுழற்ற இழுக்கவும்' : 'Click diya to light | Drag to rotate'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={handleLightAll}
            className="flex items-center gap-2 py-3 px-8 rounded-xl font-bold text-sm tracking-wide btn-gold shadow-lg shadow-yellow-900/40 cursor-pointer"
          >
            <Sparkles size={16} />
            {isTamil ? 'அனைத்து தீபங்களையும் ஏற்று' : 'Light All Diyas'}
          </button>
          <button
            onClick={handleResetDiyas}
            className="flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm text-yellow-300 bg-white/5 border border-yellow-400/30 hover:bg-white/10 transition-all cursor-pointer"
          >
            {isTamil ? 'மீட்டமை' : 'Reset Lights'}
          </button>
        </div>
      </div>
    </section>
  );
}

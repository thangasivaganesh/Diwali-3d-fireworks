import * as THREE from 'three';
import {
  createAnarTexture,
  createChakriTexture,
  createRocketTexture,
  createSutliTexture,
  createSparklerTexture,
} from '../utils/textureGenerator.js';

/**
 * Creates realistic, procedural 3D models of traditional Indian Diwali crackers.
 * Built using Three.js standard geometries, canvas textures, and standard materials.
 */

// ── 1. ANAR (Fountain Firework) ──────────────────────────────
export function buildAnarModel() {
  const group = new THREE.Group();
  group.name = 'anar_model';

  const anarTexture = createAnarTexture();

  // Clay / Paper conical base body
  // Tapered cylinder: bottom radius 1.2, top radius 0.6, height 2.6
  const bodyGeo = new THREE.CylinderGeometry(0.65, 1.25, 2.6, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: anarTexture,
    roughness: 0.35,
    metalness: 0.15,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.3;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Gold foil top cap rim
  const rimGeo = new THREE.TorusGeometry(0.66, 0.08, 16, 32);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });
  const rim = new THREE.Mesh(rimGeo, goldMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 2.6;
  group.add(rim);

  // Orifice / nozzle opening
  const nozzleGeo = new THREE.CylinderGeometry(0.25, 0.45, 0.3, 24);
  const nozzleMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.9,
  });
  const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzle.position.y = 2.68;
  group.add(nozzle);

  // Fuse cord
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.75, 0),
    new THREE.Vector3(0.12, 2.95, 0.05),
    new THREE.Vector3(0.08, 3.12, -0.04),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 16, 0.03, 8, false);
  const fuseMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.8,
  });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  group.add(fuse);

  // Glowing fuse tip
  const tipGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const tipMat = new THREE.MeshBasicMaterial({
    color: 0xff4500,
  });
  const fuseTip = new THREE.Mesh(tipGeo, tipMat);
  fuseTip.position.set(0.08, 3.12, -0.04);
  fuseTip.name = 'fuse_tip';
  group.add(fuseTip);

  // Base stand disc (cardboard plate)
  const standGeo = new THREE.CylinderGeometry(1.5, 1.55, 0.12, 32);
  const standMat = new THREE.MeshStandardMaterial({
    color: 0x451a03,
    roughness: 0.85,
  });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.y = 0.06;
  group.add(stand);

  return group;
}

// ── 2. PHULJHARI (Sparkler) ──────────────────────────────────
export function buildPhuljhariModel() {
  const group = new THREE.Group();
  group.name = 'phuljhari_model';

  const wireTexture = createSparklerTexture();

  // Thin steel wire core: height 4.2
  const wireGeo = new THREE.CylinderGeometry(0.03, 0.03, 4.2, 16);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.15,
  });
  const wire = new THREE.Mesh(wireGeo, wireMat);
  wire.position.y = 2.1;
  group.add(wire);

  // Chemical composition coating on upper 65% of the stick
  const coatGeo = new THREE.CylinderGeometry(0.1, 0.09, 2.7, 16);
  const coatMat = new THREE.MeshStandardMaterial({
    map: wireTexture,
    color: 0x64748b,
    roughness: 0.75,
    metalness: 0.35,
  });
  const coating = new THREE.Mesh(coatGeo, coatMat);
  coating.position.y = 2.85;
  group.add(coating);

  // Gold ring at boundary of handle and chemical coating
  const ringGeo = new THREE.TorusGeometry(0.095, 0.02, 12, 24);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2,
  });
  const ring = new THREE.Mesh(ringGeo, goldMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 1.5;
  group.add(ring);

  // Lower grip handle
  const handleGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.3, 16);
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    roughness: 0.6,
  });
  const handle = new THREE.Mesh(handleGeo, handleMat);
  handle.position.y = 0.75;
  group.add(handle);

  // Bright glowing tip point
  const tipGeo = new THREE.SphereGeometry(0.12, 16, 16);
  const tipMat = new THREE.MeshBasicMaterial({
    color: 0xfffbeb,
  });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = 4.22;
  tip.name = 'sparkler_tip';
  group.add(tip);

  // Tip point light
  const tipLight = new THREE.PointLight(0xffedd5, 1.2, 8);
  tipLight.position.y = 4.25;
  tipLight.name = 'sparkler_light';
  group.add(tipLight);

  return group;
}

// ── 3. ROCKET FIREWORK ───────────────────────────────────────
export function buildRocketModel() {
  const group = new THREE.Group();
  group.name = 'rocket_model';

  const rocketTexture = createRocketTexture();

  // Cylindrical rocket motor tube
  const bodyGeo = new THREE.CylinderGeometry(0.42, 0.42, 2.8, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: rocketTexture,
    roughness: 0.3,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 2.4;
  group.add(body);

  // Conical nose cone
  const noseGeo = new THREE.ConeGeometry(0.55, 1.2, 32);
  const noseMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    metalness: 0.4,
    roughness: 0.2,
  });
  const nose = new THREE.Mesh(noseGeo, noseMat);
  nose.position.y = 4.4;
  group.add(nose);

  // Gold band between nose cone and body
  const bandGeo = new THREE.TorusGeometry(0.44, 0.04, 16, 32);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.2,
  });
  const band = new THREE.Mesh(bandGeo, goldMat);
  band.rotation.x = Math.PI / 2;
  band.position.y = 3.8;
  group.add(band);

  // Stabilizing fins (4 fins at 90 degree offsets)
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.55, 0);
    finShape.lineTo(0.2, 0.8);
    finShape.lineTo(0, 0.8);
    finShape.closePath();

    const finExtrude = new THREE.ExtrudeGeometry(finShape, { depth: 0.04, bevelEnabled: false });
    const finMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const fin = new THREE.Mesh(finExtrude, finMat);
    fin.rotation.y = angle;
    fin.position.y = 1.0;
    group.add(fin);
  }

  // Wooden guiding guide stick (attached to the side)
  const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.8, 12);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.set(0.44, 1.4, 0);
  group.add(stick);

  // Lower exhaust nozzle
  const exhaustGeo = new THREE.CylinderGeometry(0.35, 0.2, 0.3, 24);
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.position.y = 0.85;
  group.add(exhaust);

  // Rocket fuse
  const fuseGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
  const fuseMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.9 });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  fuse.position.y = 0.6;
  group.add(fuse);

  return group;
}

// ── 4. CHAKRI (Ground Wheel Firework) ────────────────────────
export function buildChakriModel() {
  const group = new THREE.Group();
  group.name = 'chakri_model';

  const chakriTexture = createChakriTexture();

  // Circular disc wheel
  const discGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.24, 48);
  const discMat = new THREE.MeshStandardMaterial({
    map: chakriTexture,
    metalness: 0.3,
    roughness: 0.35,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  disc.position.y = 0.12;
  disc.name = 'chakri_wheel';
  group.add(disc);

  // Outer gold foil scalloped edge
  const rimGeo = new THREE.TorusGeometry(1.62, 0.06, 16, 48);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.85,
    roughness: 0.2,
  });
  const rim = new THREE.Mesh(rimGeo, goldMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.12;
  disc.add(rim);

  // Central hub peg / axle
  const hubGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.35, 24);
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.9,
    roughness: 0.2,
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.position.y = 0.26;
  disc.add(hub);

  // Central fuse tip
  const fuseTipGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const fuseTipMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
  const fuseTip = new THREE.Mesh(fuseTipGeo, fuseTipMat);
  fuseTip.position.y = 0.45;
  disc.add(fuseTip);

  return group;
}

// ── 5. SUTLI BOMB (Visual Simulation) ────────────────────────
export function buildSutliModel() {
  const group = new THREE.Group();
  group.name = 'sutli_model';

  const sutliTexture = createSutliTexture();

  // Cylindrical twine bomb body
  const bodyGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.4, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: sutliTexture,
    roughness: 0.7,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.7;
  group.add(body);

  // Rounded top cap
  const topCapGeo = new THREE.SphereGeometry(0.85, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const topCapMat = new THREE.MeshStandardMaterial({
    map: sutliTexture,
    roughness: 0.7,
  });
  const topCap = new THREE.Mesh(topCapGeo, topCapMat);
  topCap.position.y = 1.4;
  group.add(topCap);

  // Curved braided fuse
  const fuseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 2.2, 0),
    new THREE.Vector3(0.15, 2.45, 0.1),
    new THREE.Vector3(-0.08, 2.7, 0.15),
  ]);
  const fuseGeo = new THREE.TubeGeometry(fuseCurve, 20, 0.04, 8, false);
  const fuseMat = new THREE.MeshStandardMaterial({
    color: 0xa8a29e,
    roughness: 0.85,
  });
  const fuse = new THREE.Mesh(fuseGeo, fuseMat);
  group.add(fuse);

  // Glowing fuse tip
  const tipGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xff3300 });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.set(-0.08, 2.7, 0.15);
  tip.name = 'sutli_fuse_tip';
  group.add(tip);

  return group;
}

// ── 6. GOLDEN CASCADE (Waterfall Firework) ───────────────────
export function buildCascadeModel() {
  const group = new THREE.Group();
  group.name = 'cascade_model';

  // Suspended horizontal bamboo/brass bar with festive hanging fountain tubes
  const barGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.4, 16);
  const barMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.7,
    roughness: 0.25,
  });
  const bar = new THREE.Mesh(barGeo, barMat);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = 3.6;
  group.add(bar);

  // 5 hanging fountain cylinders along the bar
  const anarTexture = createAnarTexture();
  const offsets = [-1.3, -0.65, 0, 0.65, 1.3];

  offsets.forEach((ox) => {
    // String hanging the tube
    const stringGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 8);
    const stringMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const string = new THREE.Mesh(stringGeo, stringMat);
    string.position.set(ox, 3.4, 0);
    group.add(string);

    // Mini fountain tube
    const tubeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.9, 16);
    const tubeMat = new THREE.MeshStandardMaterial({
      map: anarTexture,
      roughness: 0.4,
      metalness: 0.2,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.position.set(ox, 2.75, 0);
    group.add(tube);

    // Golden nozzle tip at the bottom
    const nozzleGeo = new THREE.ConeGeometry(0.18, 0.2, 16);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const nozzle = new THREE.Mesh(nozzleGeo, goldMat);
    nozzle.rotation.x = Math.PI;
    nozzle.position.set(ox, 2.2, 0);
    group.add(nozzle);
  });

  return group;
}

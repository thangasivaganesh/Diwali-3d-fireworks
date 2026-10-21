import * as THREE from 'three';

/**
 * Procedural texture generator for Diwali crackers and traditional decorations.
 * Uses HTML5 Canvas to produce high-resolution, realistic festival textures
 * with Indian motifs, gold foil bands, vibrant colors, and subtle roughness.
 */

// 1. Anar (Fountain) Wrapper Texture
export function createAnarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Rich royal crimson gradient background
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#7f1d1d');
  grad.addColorStop(0.25, '#991b1b');
  grad.addColorStop(0.5, '#b91c1c');
  grad.addColorStop(0.75, '#991b1b');
  grad.addColorStop(1, '#7f1d1d');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Decorative gold foil stripes at top and bottom
  const drawGoldBand = (y, height) => {
    const goldGrad = ctx.createLinearGradient(0, y, 1024, y);
    goldGrad.addColorStop(0, '#b45309');
    goldGrad.addColorStop(0.3, '#fef08a');
    goldGrad.addColorStop(0.5, '#f59e0b');
    goldGrad.addColorStop(0.7, '#fef08a');
    goldGrad.addColorStop(1, '#b45309');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, y, 1024, height);

    // Embossed inner border
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, y, 1024, height);
  };

  drawGoldBand(40, 80);
  drawGoldBand(900, 80);

  // Geometric Rangoli diamonds in background
  ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
  for (let x = 0; x < 1024; x += 128) {
    for (let y = 160; y < 860; y += 128) {
      ctx.beginPath();
      ctx.moveTo(x + 64, y);
      ctx.lineTo(x + 128, y + 64);
      ctx.lineTo(x + 64, y + 128);
      ctx.lineTo(x, y + 64);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Central Gold Emblem & Diya Icon
  ctx.save();
  ctx.translate(512, 512);

  // Outer gold circle
  ctx.beginPath();
  ctx.arc(0, 0, 260, 0, Math.PI * 2);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  // Inner maroon ring
  ctx.beginPath();
  ctx.arc(0, 0, 230, 0, Math.PI * 2);
  ctx.fillStyle = '#450a0a';
  ctx.fill();

  // Stylized Diya in center
  ctx.beginPath();
  // Diya base (curved bowl)
  ctx.arc(0, 40, 110, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.lineTo(-100, 40);
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  // Diya flame
  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.bezierCurveTo(-50, -20, -40, 30, 0, 30);
  ctx.bezierCurveTo(40, 30, 50, -20, 0, -90);
  const flameGrad = ctx.createRadialGradient(0, -20, 10, 0, -20, 70);
  flameGrad.addColorStop(0, '#ffffff');
  flameGrad.addColorStop(0.3, '#fde047');
  flameGrad.addColorStop(0.8, '#ea580c');
  flameGrad.addColorStop(1, '#7c2d12');
  ctx.fillStyle = flameGrad;
  ctx.fill();

  // Brand / Cracker Name: "SPECIAL ANAR"
  ctx.font = 'bold 52px "Cinzel", "Georgia", serif';
  ctx.fillStyle = '#fef08a';
  ctx.textAlign = 'center';
  ctx.fillText('DIWALI SPECIAL', 0, 150);

  ctx.font = '900 68px "Arial", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('ANAR ★ 1000', 0, -140);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// 2. Chakri (Ground Wheel) Spiral Texture
export function createChakriTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Dark metallic disc base
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, 1024, 1024);

  ctx.translate(512, 512);

  // Concentric rings with vibrant festive colors
  const colors = ['#dc2626', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#f43f5e'];
  const numArms = 16;

  for (let r = 480; r > 60; r -= 26) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.lineWidth = 14;
    ctx.strokeStyle = colors[Math.floor(r / 26) % colors.length];
    ctx.stroke();
  }

  // Spiraling curved blades
  for (let i = 0; i < numArms; i++) {
    const angle = (i / numArms) * Math.PI * 2;
    ctx.save();
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.bezierCurveTo(200, 100, 350, 120, 480, 40);
    ctx.lineWidth = 18;
    ctx.strokeStyle = i % 2 === 0 ? '#fbbf24' : '#ffffff';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.restore();
  }

  // Center metallic brass hub
  const hubGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 90);
  hubGrad.addColorStop(0, '#fef08a');
  hubGrad.addColorStop(0.5, '#d97706');
  hubGrad.addColorStop(1, '#78350f');
  ctx.beginPath();
  ctx.arc(0, 0, 90, 0, Math.PI * 2);
  ctx.fillStyle = hubGrad;
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#fef08a';
  ctx.stroke();

  // Center fuse hole
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Rocket Firework Pattern Texture
export function createRocketTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Striped festive diagonal pattern
  const grad = ctx.createLinearGradient(0, 0, 512, 1024);
  grad.addColorStop(0, '#1e3a8a');
  grad.addColorStop(0.5, '#7c3aed');
  grad.addColorStop(1, '#db2777');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  // Chevron gold & red stripes
  ctx.lineWidth = 30;
  for (let y = -512; y < 1536; y += 80) {
    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y + 100);
    ctx.lineTo(512, y);
    ctx.stroke();

    ctx.strokeStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(0, y + 40);
    ctx.lineTo(256, y + 140);
    ctx.lineTo(512, y + 40);
    ctx.stroke();
  }

  // Sparkling golden stars
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 1024;
    const r = 4 + Math.random() * 8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Big bold "SUPER ROCKET"
  ctx.save();
  ctx.translate(256, 512);
  ctx.rotate(-Math.PI / 2);
  ctx.font = '900 70px "Arial Black", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000000';
  ctx.shadowBlur = 12;
  ctx.fillText('DIWALI ROCKET 3D', 0, 0);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Sutli Bomb Twine Texture
export function createSutliTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Natural green jute twine base
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 512, 512);

  // Cross-hatched wrapped cord lines
  ctx.lineWidth = 14;
  for (let i = -512; i < 1024; i += 28) {
    ctx.strokeStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();

    ctx.strokeStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(i, 512);
    ctx.lineTo(i + 512, 0);
    ctx.stroke();
  }

  // Red & Yellow brand belly band
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 200, 512, 112);

  ctx.fillStyle = '#fef08a';
  ctx.fillRect(0, 210, 512, 8);
  ctx.fillRect(0, 294, 512, 8);

  ctx.font = '900 48px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('SUTLI KING', 256, 275);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 5. Traditional Indian Rangoli Floor Texture
export function createRangoliTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Transparent background so ground color shines through
  ctx.clearRect(0, 0, 1024, 1024);
  ctx.translate(512, 512);

  // Concentric multi-petal lotus rangoli
  const drawPetalRing = (count, radius, size, color) => {
    ctx.fillStyle = color;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, radius);
      ctx.bezierCurveTo(-size, radius + size, -size / 2, radius + size * 2, 0, radius + size * 2.5);
      ctx.bezierCurveTo(size / 2, radius + size * 2, size, radius + size, 0, radius);
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }
  };

  // Outer gold scalloped ring
  ctx.beginPath();
  ctx.arc(0, 0, 480, 0, Math.PI * 2);
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();

  // Alternating petal layers
  drawPetalRing(16, 320, 60, '#db2777'); // Magenta outer petals
  drawPetalRing(16, 220, 48, '#059669'); // Emerald green layer
  drawPetalRing(12, 140, 38, '#ea580c'); // Saffron orange layer
  drawPetalRing(8, 70, 28, '#facc15');  // Bright yellow center petals

  // Central Lotus Core
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#f59e0b';
  ctx.stroke();

  // Delicate white rice-flour dots
  ctx.fillStyle = '#ffffff';
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 440, Math.sin(a) * 440, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6. Sparkler (Phuljhari) Metallic Wire Texture
export function createSparklerTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Brushed steel wire
  const grad = ctx.createLinearGradient(0, 0, 64, 0);
  grad.addColorStop(0, '#64748b');
  grad.addColorStop(0.3, '#cbd5e1');
  grad.addColorStop(0.5, '#f8fafc');
  grad.addColorStop(0.7, '#94a3b8');
  grad.addColorStop(1, '#475569');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 256);

  // Granular chemical coating on upper half
  ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 64;
    const y = Math.random() * 180;
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

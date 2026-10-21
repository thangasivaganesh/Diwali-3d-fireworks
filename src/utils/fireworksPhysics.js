// Firework physics engine

export const FIREWORK_TYPES = {
  CHRYSANTHEMUM: 'chrysanthemum',
  PEONY: 'peony',
  WILLOW: 'willow',
  RING: 'ring',
  HEART: 'heart',
  STARBURST: 'starburst',
  RAINBOW: 'rainbow',
  DOUBLE: 'double',
  METEOR: 'meteor',
};

export const COLOR_PALETTES = {
  default: [
    [1.0, 0.84, 0.0],
    [1.0, 0.2, 0.2],
    [0.2, 0.6, 1.0],
    [0.2, 1.0, 0.4],
    [0.8, 0.2, 1.0],
    [1.0, 0.4, 0.8],
    [0.2, 1.0, 1.0],
    [1.0, 0.6, 0.2],
  ],
  golden: [
    [1.0, 0.84, 0.0],
    [1.0, 0.9, 0.3],
    [1.0, 0.75, 0.1],
    [0.9, 0.7, 0.0],
    [1.0, 1.0, 0.6],
  ],
  rainbow: [
    [1.0, 0.0, 0.0],
    [1.0, 0.5, 0.0],
    [1.0, 1.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
    [0.5, 0.0, 1.0],
    [1.0, 0.0, 1.0],
  ],
};

// Generate explosion particles for a given type
export function generateExplosionParticles(type, count, baseColor) {
  const velocities = [];
  const colors = [];
  const lifetimes = [];
  const sizes = [];

  for (let i = 0; i < count; i++) {
    let vx, vy, vz;
    const speed = 0.3 + Math.random() * 0.7;

    switch (type) {
      case FIREWORK_TYPES.CHRYSANTHEMUM: {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const s = speed * (0.6 + Math.random() * 0.4);
        vx = s * Math.sin(phi) * Math.cos(theta);
        vy = s * Math.sin(phi) * Math.sin(theta) * 0.5;
        vz = s * Math.cos(phi);
        break;
      }
      case FIREWORK_TYPES.PEONY: {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const s = speed;
        vx = s * Math.sin(phi) * Math.cos(theta);
        vy = s * Math.sin(phi) * Math.sin(theta);
        vz = s * Math.cos(phi);
        break;
      }
      case FIREWORK_TYPES.WILLOW: {
        const theta = Math.random() * Math.PI * 2;
        const s = speed * (0.4 + Math.random() * 0.3);
        vx = s * Math.cos(theta);
        vy = s * (0.2 + Math.random() * 0.3);
        vz = s * Math.sin(theta);
        break;
      }
      case FIREWORK_TYPES.RING: {
        const theta = (i / count) * Math.PI * 2;
        const s = speed * 0.8;
        vx = s * Math.cos(theta);
        vy = (Math.random() - 0.5) * 0.1;
        vz = s * Math.sin(theta);
        break;
      }
      case FIREWORK_TYPES.HEART: {
        const t = (i / count) * Math.PI * 2;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const mag = Math.sqrt(hx * hx + hy * hy);
        const s = speed * 0.04;
        vx = (hx / mag) * s * mag;
        vy = (hy / mag) * s * mag * 0.5;
        vz = (Math.random() - 0.5) * speed * 0.2;
        break;
      }
      case FIREWORK_TYPES.STARBURST: {
        const arm = Math.floor(i / (count / 5));
        const angle = (arm / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const s = speed * (0.4 + Math.random() * 0.8);
        vx = s * Math.cos(angle);
        vy = s * (Math.random() - 0.5) * 0.4;
        vz = s * Math.sin(angle);
        break;
      }
      case FIREWORK_TYPES.RAINBOW:
      default: {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const s = speed;
        vx = s * Math.sin(phi) * Math.cos(theta);
        vy = s * Math.sin(phi) * Math.sin(theta);
        vz = s * Math.cos(phi);
        break;
      }
    }

    velocities.push(vx, vy, vz);

    // Color
    const c = baseColor || [Math.random(), Math.random(), Math.random()];
    const variation = 0.15;
    colors.push(
      Math.min(1, Math.max(0, c[0] + (Math.random() - 0.5) * variation)),
      Math.min(1, Math.max(0, c[1] + (Math.random() - 0.5) * variation)),
      Math.min(1, Math.max(0, c[2] + (Math.random() - 0.5) * variation))
    );

    lifetimes.push(60 + Math.random() * 80);
    sizes.push(2 + Math.random() * 3);
  }

  return { velocities, colors, lifetimes, sizes };
}

export function randomExplosionType() {
  const types = Object.values(FIREWORK_TYPES).filter(t => t !== FIREWORK_TYPES.METEOR);
  return types[Math.floor(Math.random() * types.length)];
}

export function randomColor(palette = 'default') {
  const p = COLOR_PALETTES[palette] || COLOR_PALETTES.default;
  return p[Math.floor(Math.random() * p.length)];
}

export function heartPoint(t) {
  return {
    x: 16 * Math.pow(Math.sin(t), 3),
    y: 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)
  };
}

import * as THREE from 'three';

/**
 * Cracker Animation & Particle Physics Engine
 * Handles particle pooling, physical updates, life stages, and rendering
 * for realistic Anar fountain, Phuljhari sparkler, Chakri wheel, Rocket launch,
 * Sutli blast, and Golden Cascade.
 */

export const CRACKER_STATES = {
  IDLE: 'IDLE',
  IGNITING: 'IGNITING',
  ACTIVE: 'ACTIVE',
  FADING: 'FADING',
};

// Color palettes for particles
export const SPARKS_GOLD = [
  new THREE.Color(1.0, 0.95, 0.4),  // White-hot gold
  new THREE.Color(1.0, 0.75, 0.1),  // Warm gold
  new THREE.Color(1.0, 0.45, 0.05), // Saffron orange
  new THREE.Color(1.0, 0.25, 0.0),  // Deep amber
];

export const SPARKS_RAINBOW = [
  new THREE.Color(1.0, 0.2, 0.3),
  new THREE.Color(0.2, 0.8, 1.0),
  new THREE.Color(0.2, 1.0, 0.4),
  new THREE.Color(1.0, 0.9, 0.1),
  new THREE.Color(0.8, 0.2, 1.0),
  new THREE.Color(1.0, 0.5, 0.1),
];

export class CrackerParticleSystem {
  constructor(maxParticles = 1200) {
    this.maxParticles = maxParticles;
    this.positions = new Float32Array(maxParticles * 3);
    this.colors = new Float32Array(maxParticles * 3);
    this.sizes = new Float32Array(maxParticles);

    this.velocities = [];
    this.lifetimes = new Float32Array(maxParticles);
    this.maxLifetimes = new Float32Array(maxParticles);
    this.types = new Uint8Array(maxParticles); // 0: spark, 1: ember, 2: smoke
    this.activeCount = 0;

    for (let i = 0; i < maxParticles; i++) {
      this.velocities.push(new THREE.Vector3());
      this.positions[i * 3 + 1] = -9999; // hide
      this.sizes[i] = 0;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    this.material = new THREE.PointsMaterial({
      size: 3.5,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geometry, this.material);
  }

  emit(pos, vel, color, life, size = 3, type = 0) {
    let index = -1;
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.lifetimes[i] <= 0) {
        index = i;
        break;
      }
    }
    if (index === -1) index = Math.floor(Math.random() * this.maxParticles);

    this.positions[index * 3] = pos.x;
    this.positions[index * 3 + 1] = pos.y;
    this.positions[index * 3 + 2] = pos.z;

    this.velocities[index].copy(vel);

    this.colors[index * 3] = color.r;
    this.colors[index * 3 + 1] = color.g;
    this.colors[index * 3 + 2] = color.b;

    this.sizes[index] = size;
    this.lifetimes[index] = life;
    this.maxLifetimes[index] = life;
    this.types[index] = type;
  }

  update(delta) {
    let active = 0;
    for (let i = 0; i < this.maxParticles; i++) {
      if (this.lifetimes[i] > 0) {
        this.lifetimes[i] -= delta;
        active++;

        const lifeRatio = Math.max(0, this.lifetimes[i] / this.maxLifetimes[i]);
        const vel = this.velocities[i];

        // Physics based on particle type
        if (this.types[i] === 0) {
          // Standard spark: gravity + slight drag
          vel.y -= 9.8 * 0.45 * delta;
          vel.x *= 0.985;
          vel.z *= 0.985;
        } else if (this.types[i] === 1) {
          // Floating ember: light gravity, flickering
          vel.y -= 2.0 * delta;
          vel.x += (Math.random() - 0.5) * 0.3 * delta;
          vel.z += (Math.random() - 0.5) * 0.3 * delta;
        } else if (this.types[i] === 2) {
          // Smoke: rises gently, expands
          vel.y += 2.5 * delta;
          vel.x *= 0.97;
          vel.z *= 0.97;
          this.sizes[i] += 4.0 * delta;
        }

        // Apply velocity
        this.positions[i * 3] += vel.x * delta;
        this.positions[i * 3 + 1] += vel.y * delta;
        this.positions[i * 3 + 2] += vel.z * delta;

        // Dim color as life fades
        const fade = Math.pow(lifeRatio, 1.2);
        this.colors[i * 3] *= (0.95 + 0.05 * fade);
        this.colors[i * 3 + 1] *= (0.95 + 0.05 * fade);
        this.colors[i * 3 + 2] *= (0.95 + 0.05 * fade);
      } else {
        this.positions[i * 3 + 1] = -9999;
        this.sizes[i] = 0;
      }
    }

    this.activeCount = active;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.size.needsUpdate = true;
  }

  clear() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.lifetimes[i] = 0;
      this.positions[i * 3 + 1] = -9999;
      this.sizes[i] = 0;
    }
    this.activeCount = 0;
    this.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

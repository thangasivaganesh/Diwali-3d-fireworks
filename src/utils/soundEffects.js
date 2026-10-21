// Procedural sound effects using Web Audio API
// Generates realistic rocket whistles, explosions, fountain hiss, chakri spin,
// sparkler sizzle, and festive bells with zero external audio files.

let audioCtx = null;
let masterGain = null;
let enabled = false;

export function initAudio() {
  if (audioCtx) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioCtx = new AudioContextClass();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.45;
  masterGain.connect(audioCtx.destination);
}

export function setAudioEnabled(val) {
  enabled = val;
  if (val && !audioCtx) initAudio();
  if (audioCtx) {
    if (val && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }
}

export function setVolume(vol) {
  if (masterGain) masterGain.gain.value = Math.max(0, Math.min(1, vol));
}

// 1. Rocket launch whistle
export function playLaunch() {
  if (!enabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.85);

    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.85);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.85);
  } catch (e) {}
}

// 2. Standard explosion boom
export function playExplosion() {
  if (!enabled || !audioCtx) return;
  try {
    // Low rumble oscillator
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.connect(oscGain);
    oscGain.connect(masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + 0.7);

    oscGain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.7);

    // Noise burst
    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.5);

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(audioCtx.currentTime);
  } catch (e) {}
}

// 3. Mega explosion / Finale boom
export function playMegaExplosion() {
  if (!enabled || !audioCtx) return;
  try {
    playExplosion();
    setTimeout(() => {
      if (enabled && audioCtx) playExplosion();
    }, 180);
  } catch (e) {}
}

// 4. Anar (Fountain) continuous sizzle & roar
export function playAnarSound(duration = 4.5) {
  if (!enabled || !audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * Math.min(duration, 6);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, audioCtx.currentTime);
    filter.frequency.linearRampToValueAtTime(1400, audioCtx.currentTime + duration * 0.5);
    filter.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + duration);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 0.8);
    gain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(audioCtx.currentTime);
    noise.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// 5. Chakri (Spinning Wheel) whirring sound
export function playChakriSound(duration = 4.0) {
  if (!enabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, audioCtx.currentTime + 1.2);
    osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, audioCtx.currentTime + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

// 6. Phuljhari (Sparkler) crackle & sizzle
export function playSparkle() {
  if (!enabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1600 + Math.random() * 1200;

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (e) {}
}

// 7. Diya lighting bell chime
export function playDiyaChime() {
  if (!enabled || !audioCtx) return;
  try {
    const freqs = [523.25, 659.25, 783.99]; // C, E, G bell triad
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = audioCtx.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + 0.8);
    });
  } catch (e) {}
}

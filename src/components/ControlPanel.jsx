import React from 'react';
import {
  Zap,
  Sparkles,
  Play,
  Pause,
  RefreshCw,
  Volume2,
  VolumeX,
  Maximize,
  Trash2,
  Star,
  Edit3,
  RotateCcw,
} from 'lucide-react';

function Btn({ onClick, active, children, title, variant = 'default' }) {
  const base =
    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 select-none cursor-pointer';
  const variants = {
    default: `bg-white/5 hover:bg-white/15 text-yellow-200 border border-white/10 hover:border-yellow-400/40 ${
      active ? 'bg-yellow-900/40 border-yellow-400/60 text-yellow-300 shadow-md shadow-yellow-950/40' : ''
    }`,
    primary:
      'bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-600 hover:to-orange-400 text-white border border-orange-400/30 shadow-lg shadow-orange-900/30',
    danger: 'bg-red-900/30 hover:bg-red-800/40 text-red-300 border border-red-700/30',
  };
  return (
    <button onClick={onClick} title={title} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function Slider({ label, value, min, max, step, onChange, format }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-yellow-400/70">
        <span>{label}</span>
        <span>{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-yellow-400 cursor-pointer"
        style={{ accentColor: '#fbbf24' }}
      />
    </div>
  );
}

export default function ControlPanel({
  t,
  paused,
  autoShow,
  rainbowMode,
  goldenMode,
  soundEnabled,
  particleIntensity,
  showFrequency,
  fireworkCount,
  onPause,
  onAutoShow,
  onRainbow,
  onGolden,
  onSound,
  onIntensity,
  onFrequency,
  onLaunch,
  onMega,
  onFinale,
  onClear,
  onGreeting,
  onFullscreen,
  onResetScene,
}) {
  return (
    <div
      className="glass fixed right-4 top-16 z-30 p-4 flex flex-col gap-3 overflow-y-auto max-w-[240px] shadow-2xl border border-yellow-400/40"
      style={{ maxHeight: 'calc(100vh - 85px)' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-yellow-400/20 pb-2">
        <span className="text-yellow-400 text-sm">🎆</span>
        <span className="text-yellow-300 text-sm font-bold tracking-wider">{t.controls}</span>
        {autoShow && <span className="ml-auto text-green-400 text-xs animate-pulse font-semibold">{t.live}</span>}
      </div>

      {/* Launch Buttons */}
      <div className="grid grid-cols-1 gap-1.5">
        <Btn onClick={onLaunch} variant="primary" title={t.launchFirework}>
          <Zap size={13} /> {t.launchFirework}
        </Btn>
        <Btn onClick={onMega} variant="primary" title={t.megaExplosion}>
          <Sparkles size={13} /> {t.megaExplosion}
        </Btn>
        <Btn onClick={onFinale} variant="primary" title={t.grandFinale}>
          <Star size={13} /> {t.grandFinale}
        </Btn>
      </div>

      {/* Divider */}
      <hr className="border-yellow-400/10" />

      {/* Mode Toggles */}
      <div className="grid grid-cols-2 gap-1.5">
        <Btn onClick={onAutoShow} active={autoShow} title={autoShow ? t.stopAuto : t.autoShow}>
          <RefreshCw size={12} className={autoShow ? 'animate-spin' : ''} />
          {autoShow ? t.stopAuto : t.autoShow}
        </Btn>
        <Btn onClick={onPause} active={paused} title={paused ? t.resume : t.pause}>
          {paused ? <Play size={12} /> : <Pause size={12} />}
          {paused ? t.resume : t.pause}
        </Btn>
        <Btn onClick={onRainbow} active={rainbowMode} title={t.rainbowMode}>
          {t.rainbowMode}
        </Btn>
        <Btn onClick={onGolden} active={goldenMode} title={t.goldenNight}>
          {t.goldenNight}
        </Btn>
      </div>

      {/* Divider */}
      <hr className="border-yellow-400/10" />

      {/* Sliders */}
      <div className="flex flex-col gap-2.5">
        <Slider
          label={t.particleIntensity}
          value={particleIntensity}
          min={0.2}
          max={1.5}
          step={0.1}
          onChange={onIntensity}
          format={(v) => `${Math.round(v * 100)}%`}
        />
        <Slider
          label={t.showFrequency}
          value={showFrequency}
          min={500}
          max={5000}
          step={250}
          onChange={onFrequency}
          format={(v) => `${(v / 1000).toFixed(1)}s`}
        />
      </div>

      {/* Divider */}
      <hr className="border-yellow-400/10" />

      {/* Sound & Utility */}
      <div className="grid grid-cols-2 gap-1.5">
        <Btn
          onClick={() => onSound(!soundEnabled)}
          active={soundEnabled}
          title={soundEnabled ? t.soundOff : t.soundOn}
        >
          {soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
          {soundEnabled ? t.soundOn : t.soundOff}
        </Btn>
        <Btn onClick={onFullscreen} title={t.fullscreen}>
          <Maximize size={12} /> {t.fullscreen}
        </Btn>
        <Btn onClick={onGreeting} title={t.greeting}>
          <Edit3 size={12} /> {t.greeting}
        </Btn>
        <Btn onClick={onResetScene} title="Reset Scene">
          <RotateCcw size={12} /> Reset
        </Btn>
      </div>

      {/* Clear Sky */}
      <Btn onClick={onClear} variant="danger" title={t.clearSky}>
        <Trash2 size={12} /> {t.clearSky}
      </Btn>

      {/* Footer counter */}
      <div className="text-center text-yellow-600/70 text-xs mt-1 font-medium">
        🎆 {fireworkCount} {t.fireworksLaunched}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { Zap, Flame, Compass } from 'lucide-react';

const SPARKLE_CHARS = ['✦', '✧', '⋆', '★', '✨', '💫'];

function Sparkle({ style }) {
  const char = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
  return <span style={style} className="absolute text-yellow-400 animate-ping text-xs pointer-events-none">{char}</span>;
}

export default function DiwaliGreeting({
  fireworkCount,
  onLaunchFireworks,
  onScrollToDiyas,
  onScrollToCrackers,
}) {
  const [sparkles, setSparkles] = useState([]);
  const { lang, t } = useLang();
  const isTamil = lang === 'ta';

  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles((prev) => {
        const next = [
          ...prev.filter((s) => Date.now() - s.born < 2000),
          {
            id: Date.now(),
            born: Date.now(),
            style: {
              left: `${15 + Math.random() * 70}%`,
              top: `${Math.random() * 65}%`,
              animationDuration: `${0.8 + Math.random() * 0.8}s`,
            },
          },
        ];
        return next.slice(-14);
      });
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-12 px-4 z-20 pointer-events-none">
      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {sparkles.map((s) => (
          <Sparkle key={s.id} style={s.style} />
        ))}
      </div>

      {/* Main Hero Header */}
      <div className="text-center max-w-4xl entrance-anim">
        {/* Main Title */}
        <div className="relative inline-block mb-2">
          <h1
            className="gold-text font-black select-none tracking-widest leading-none drop-shadow-2xl"
            style={{
              fontSize: isTamil ? 'clamp(2.0rem, 6vw, 4.4rem)' : 'clamp(2.8rem, 8vw, 5.8rem)',
              fontFamily: isTamil ? "'Noto Sans Tamil', sans-serif" : 'inherit',
              letterSpacing: isTamil ? '0.04em' : '0.12em',
              textShadow: '0 0 50px rgba(251,191,36,0.6)',
              WebkitTextStroke: '1px rgba(251,191,36,0.3)',
            }}
          >
            {t.mainTitle}
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className="mt-3 text-yellow-200/90 font-bold tracking-wide entrance-anim"
          style={{ fontSize: 'clamp(1.0rem, 2.5vw, 1.5rem)', animationDelay: '0.2s' }}
        >
          {isTamil
            ? 'இரவை ஒளிரச் செய்யுங்கள். மாயாஜாலத்தைக் கொண்டாடுங்கள்.'
            : 'Light Up the Night. Celebrate the Magic.'}
        </p>

        {/* Description */}
        <p
          className="mt-2 text-yellow-100/70 text-sm md:text-base max-w-2xl mx-auto entrance-anim leading-relaxed"
          style={{ animationDelay: '0.4s' }}
        >
          {isTamil
            ? 'கண்கவர் 3D வாணவேடிக்கைகள் மற்றும் ஊடாடும் மத்தாப்புகளுடன் ஒளித்திருநாளை உற்சாகமாகக் கொண்டாடுங்கள்.'
            : 'Experience the festival of lights with spectacular 3D fireworks, interactive traditional crackers, and sacred glowing diyas.'}
        </p>

        {/* 3 Hero Buttons */}
        <div
          className="flex flex-wrap items-center justify-center gap-3.5 mt-8 pointer-events-auto entrance-anim"
          style={{ animationDelay: '0.6s' }}
        >
          {/* Button 1: Launch Fireworks */}
          <button
            onClick={onLaunchFireworks}
            className="flex items-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm md:text-base btn-gold shadow-lg shadow-yellow-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Zap size={18} />
            {isTamil ? 'வாணவேடிக்கை தொடங்கு' : 'Launch Fireworks'}
          </button>

          {/* Button 2: Light a Diya */}
          <button
            onClick={onScrollToDiyas}
            className="flex items-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm md:text-base bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-white border border-amber-400/40 shadow-lg shadow-orange-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Flame size={18} />
            {isTamil ? 'தீபம் ஏற்றுங்கள்' : 'Light a Diya 🪔'}
          </button>

          {/* Button 3: Explore Celebration */}
          <button
            onClick={onScrollToCrackers}
            className="flex items-center gap-2 py-3 px-6 rounded-2xl font-bold text-sm md:text-base glass hover:bg-white/10 text-yellow-200 border border-yellow-400/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Compass size={18} />
            {isTamil ? 'மத்தாப்புகளைக் காண்க' : 'Explore Celebration'}
          </button>
        </div>

        {/* Small Instruction & Counter */}
        <div className="mt-8 flex flex-col items-center gap-1.5 pointer-events-none">
          <p className="text-yellow-400/60 text-xs md:text-sm tracking-wider">
            {t.clickHint}
          </p>
          {fireworkCount > 0 && (
            <span className="glass px-3.5 py-1 text-xs text-yellow-300 font-semibold border border-yellow-400/40">
              🎆 {fireworkCount} {t.fireworksLaunched}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

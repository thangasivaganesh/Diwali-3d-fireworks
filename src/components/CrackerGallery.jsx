import React, { useState } from 'react';
import Cracker3DViewer from './Cracker3DViewer.jsx';
import { CRACKER_STATES } from '../utils/crackerAnimations.js';
import { Flame, RotateCcw, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function CrackerGallery({ t, isTamil, soundEnabled, particleIntensity }) {
  const [selectedCracker, setSelectedCracker] = useState('anar');
  const [animationState, setAnimationState] = useState(CRACKER_STATES.IDLE);

  const crackers = [
    {
      id: 'anar',
      icon: '🌋',
      name: isTamil ? 'அனார் (மத்தாப்பு நீரூற்று)' : 'Anar (Fountain)',
      subtitle: isTamil ? 'பொன்னிற தீப்பொறி நீரூற்று' : 'Golden Spark Fountain',
      desc: isTamil
        ? 'தரையிலிருந்து எழும் பிரம்மாண்டமான பொன்னிற மற்றும் ஆரஞ்சு வண்ணத் தீப்பொறி நீரூற்று. வானை நோக்கி சீறிப்பாயும் ஒளி வெள்ளம்.'
        : 'A traditional conical flower pot that erupts into a spectacular vertical cascade of dazzling golden sparks, warm orange embers, and festive crackles.',
      badge: isTamil ? 'கிளாசிக்' : 'Classic Favorite',
      color: 'from-amber-600 to-yellow-500',
    },
    {
      id: 'phuljhari',
      icon: '🪄',
      name: isTamil ? 'பூச்சட்டி / புல்ஜாரி (கம்பி மத்தாப்பு)' : 'Phuljhari (Sparkler)',
      subtitle: isTamil ? 'மின்னும் கை மத்தாப்பு' : 'Handheld Sparkling Wand',
      desc: isTamil
        ? 'கைகளில் பிடித்து அசைக்கும்போது ஒளிரும் தங்கத் தீப்பொறிச் சுவடுகளை வரையும் மெல்லிசான கம்பி மத்தாப்பு. திரையில் தொட்டு அசைத்துப் பாருங்கள்!'
        : 'A sparkling metallic wand emitting thousands of sizzling micro-sparks. Move your cursor or touch across the 3D canvas to draw glittering trails in the air!',
      badge: isTamil ? 'ஊடாடும் அசைவு' : 'Interactive Waving',
      color: 'from-yellow-500 to-orange-400',
    },
    {
      id: 'rocket',
      icon: '🚀',
      name: isTamil ? 'வானவெடி ராக்கெட்' : 'Diwali Sky Rocket',
      subtitle: isTamil ? 'விண்ணை முட்டும் வாணவேடிக்கை' : 'High Altitude Explorer',
      desc: isTamil
        ? 'வண்ணமயமான கூம்பு முனையுடன் புகைத்தடம் விட்டு விண்ணில் சீறிப்பாய்ந்து, உச்சியில் வானவில் வண்ணங்களில் வெடித்துச் சிதறும் ராக்கெட்.'
        : 'Aerodynamic rocket with colorful chevron patterns. Rises into the midnight sky with an exhaust fire trail, concluding with a massive spherical burst.',
      badge: isTamil ? 'உயர் வான்வெடி' : 'Sky Burst',
      color: 'from-blue-600 to-indigo-500',
    },
    {
      id: 'chakri',
      icon: '🌀',
      name: isTamil ? 'சக்கரம் (தரைச் சக்கரம்)' : 'Chakri (Ground Wheel)',
      subtitle: isTamil ? 'சுழலும் தீப்பொறி வட்டம்' : 'Spinning Fireworks Disc',
      desc: isTamil
        ? 'தரையில் சுழன்று தங்க நிறத்திலும் சிவப்பு நிறத்திலும் தீப்பொறி வளையங்களை வாரி இறைக்கும் பாரம்பரிய தீபாவளிச் சக்கரம்.'
        : 'A circular ground firework disc adorned with gold foil that spins violently, emitting a vortex of rotating sparks and vivid streaks.',
      badge: isTamil ? 'அதிவேக சுழற்சி' : 'Centrifugal Whirler',
      color: 'from-rose-600 to-purple-500',
    },
    {
      id: 'sutli',
      icon: '🧨',
      name: isTamil ? 'சுட்லி பட்டாசு (உருவகப்படுத்துதல்)' : 'Sutli Cracker (Visual Sim)',
      subtitle: isTamil ? 'திரி ஒளிரும் வண்ண வெடிப்பு' : 'Flash & Color Burst',
      desc: isTamil
        ? 'சணல் கயிறு சுற்றிய பாரம்பரிய பட்டாசின் அழகிய 3D வடிவம். திரியைப் பற்றவைத்தால் உடனடி ஒளி வெள்ளமும் வண்ணத் துகள்களும் வெடித்து விரியும்.'
        : 'Decorative twine-wrapped cracker model. Ignition lights the fuse countdown, triggering a bright flash and colorful expanding particle burst.',
      badge: isTamil ? 'ஒளி வெடிப்பு' : 'Flash Burst',
      color: 'from-emerald-600 to-teal-500',
    },
    {
      id: 'cascade',
      icon: '✨',
      name: isTamil ? 'பொன்னிற அருவி (கேஸ்கேட்)' : 'Golden Cascade (Waterfall)',
      subtitle: isTamil ? 'தொங்கும் பொன்னிற நீர்வீழ்ச்சி' : 'Shimmering Waterfall',
      desc: isTamil
        ? 'தங்கத் துகள்களும் மின்னும் தீப்பொறிகளும் மேலிருந்து மெதுவாக அருவி போலக் கொட்டும் கண்கவர் மத்தாப்புத் தோரணம்.'
        : 'A suspended row of golden fountain tubes releasing a continuous, shimmering curtain of descending golden willow sparks.',
      badge: isTamil ? 'தங்க அருவி' : 'Grand Waterfall',
      color: 'from-amber-500 to-yellow-600',
    },
  ];

  const currentCracker = crackers.find((c) => c.id === selectedCracker) || crackers[0];

  const handleIgnite = () => {
    if (animationState === CRACKER_STATES.IDLE) {
      setAnimationState(CRACKER_STATES.IGNITING);
    }
  };

  const handleReset = () => {
    setAnimationState(CRACKER_STATES.IDLE);
  };

  return (
    <section id="crackers-section" className="relative w-full py-20 px-4 md:px-8 z-20 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles size={14} className="text-yellow-400" />
          {isTamil ? 'பாரம்பரிய இந்திய மத்தாப்புகள்' : 'Traditional Indian Diwali Crackers'}
        </div>
        <h2 className="gold-text font-black text-3xl md:text-5xl tracking-wide">
          {isTamil ? 'தீபாவளி மத்தாப்புகளின் கண்கவர் உலகம்' : 'Explore the Magic of Diwali Crackers'}
        </h2>
        <p className="mt-3 text-yellow-200/70 text-sm md:text-base max-w-2xl mx-auto">
          {isTamil
            ? 'பாரம்பரிய மத்தாப்புகளை 3D-யில் சுழற்றிப் பாருங்கள். "பற்றவை" பொத்தானை அழுத்தி கண்கவர் ஒளிக் காட்சிகளை நிகழ்த்துங்கள்!'
            : 'Interact with realistic 3D procedural models of iconic Indian fireworks. Rotate 360°, inspect rich foil details, and ignite simulated light effects!'}
        </p>
      </div>

      {/* Main Interactive Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Cracker Selection List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {crackers.map((c) => {
            const isSelected = c.id === selectedCracker;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCracker(c.id);
                  setAnimationState(CRACKER_STATES.IDLE);
                }}
                className={`text-left p-4 rounded-2xl transition-all duration-300 relative border flex items-center gap-4 cursor-pointer select-none ${
                  isSelected
                    ? 'bg-gradient-to-r from-yellow-950/80 to-purple-950/60 border-yellow-400/70 shadow-lg shadow-yellow-900/30 scale-[1.02]'
                    : 'glass hover:bg-white/5 border-yellow-400/20 hover:border-yellow-400/40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${c.color} shadow-md`}
                >
                  {c.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm md:text-base text-yellow-100 truncate">{c.name}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                      {c.badge}
                    </span>
                  </div>
                  <p className="text-xs text-yellow-300/70 mt-0.5 truncate">{c.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: 3D Interactive Stage & Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass rounded-3xl p-6 border border-yellow-400/30 relative overflow-hidden shadow-2xl">
            {/* Top Toolbar / State Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-yellow-400/20">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentCracker.icon}</span>
                <span className="text-yellow-200 font-bold text-sm tracking-wide">{currentCracker.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    animationState === CRACKER_STATES.ACTIVE
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-400/60 animate-pulse'
                      : animationState === CRACKER_STATES.IGNITING
                      ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/60'
                      : 'bg-white/5 text-yellow-400/60 border border-white/10'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      animationState === CRACKER_STATES.ACTIVE
                        ? 'bg-orange-400 animate-ping'
                        : animationState === CRACKER_STATES.IGNITING
                        ? 'bg-yellow-400'
                        : 'bg-gray-500'
                    }`}
                  />
                  {isTamil
                    ? animationState === CRACKER_STATES.ACTIVE
                      ? 'வெடிக்கிறது'
                      : animationState === CRACKER_STATES.IGNITING
                      ? 'பற்றவைக்கப்படுகிறது'
                      : 'தயார்'
                    : animationState}
                </span>
              </div>
            </div>

            {/* 3D Viewport Box */}
            <div className="w-full h-80 sm:h-96 my-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-black/80 border border-yellow-400/20 relative overflow-hidden">
              <Cracker3DViewer
                crackerId={selectedCracker}
                animationState={animationState}
                onStateChange={setAnimationState}
                soundEnabled={soundEnabled}
                particleIntensity={particleIntensity}
              />
              <div className="absolute bottom-2.5 right-3 text-[11px] text-yellow-300/40 pointer-events-none tracking-wide">
                🖱️ {isTamil ? 'சுழற்ற இழுக்கவும் | பெரிதாக்க உருட்டவும்' : 'Drag to rotate 360° | Scroll to zoom'}
              </div>
            </div>

            {/* Description & Specs */}
            <p className="text-xs sm:text-sm text-yellow-100/80 leading-relaxed mb-4">
              {currentCracker.desc}
            </p>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-yellow-400/20">
              <button
                onClick={handleIgnite}
                disabled={animationState !== CRACKER_STATES.IDLE}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all select-none cursor-pointer ${
                  animationState === CRACKER_STATES.IDLE
                    ? 'btn-gold shadow-lg shadow-yellow-900/40'
                    : 'bg-yellow-900/30 text-yellow-500/50 border border-yellow-500/20 cursor-not-allowed'
                }`}
              >
                <Flame size={16} className={animationState !== CRACKER_STATES.IDLE ? 'animate-bounce' : ''} />
                {isTamil ? 'மத்தாப்பைப் பற்றவை' : 'Ignite Cracker'}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-yellow-300 bg-white/5 border border-yellow-400/30 hover:bg-white/10 transition-all select-none cursor-pointer"
                title="Reset Model"
              >
                <RotateCcw size={16} />
                {isTamil ? 'மீட்டமை' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

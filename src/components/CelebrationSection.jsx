import React from 'react';
import { Sparkles, PartyPopper, Heart } from 'lucide-react';

export default function CelebrationSection({ isTamil, onCelebrateAgain }) {
  return (
    <section className="relative w-full py-20 px-4 md:px-8 z-20 max-w-5xl mx-auto text-center">
      <div className="glass rounded-3xl p-8 md:p-14 border border-yellow-400/40 shadow-2xl relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-4 text-2xl text-yellow-400/50">🪔</div>
        <div className="absolute top-3 right-4 text-2xl text-yellow-400/50">🪔</div>
        <div className="absolute bottom-3 left-4 text-2xl text-yellow-400/50">🪔</div>
        <div className="absolute bottom-3 right-4 text-2xl text-yellow-400/50">🪔</div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-yellow-300 text-xs font-semibold tracking-wider uppercase mb-4">
          <Sparkles size={14} className="text-yellow-400" />
          {isTamil ? 'இனிய தீபாவளி நல்வாழ்த்துகள்' : 'Festive Blessings & Joy'}
        </div>

        <h2 className="gold-text font-black text-3xl md:text-6xl tracking-wide leading-tight mb-4">
          {isTamil
            ? 'உங்களுக்கும் உங்கள் குடும்பத்தினருக்கும் இனிய தீபாவளி நல்வாழ்த்துகள்!'
            : 'Wishing You and Your Family a Very Happy Diwali!'}
        </h2>

        <p className="text-yellow-100/80 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          {isTamil
            ? 'இந்த ஒளித்திருநாள் உங்கள் இல்லத்திலும் உள்ளத்திலும் மகிழ்ச்சியையும், செல்வத்தையும், அமைதியையும் நிலைநாட்டட்டும். தீபங்களின் ஒளி உங்கள் வாழ்வை என்றும் பிரகாசிக்கச் செய்யட்டும்!'
            : 'May the divine light of Diwali bring peace, prosperity, good health, and boundless joy to your home. Light up the night with love, laughter, and celebration!'}
        </p>

        {/* Celebrate Again Button */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={onCelebrateAgain}
            className="flex items-center gap-2.5 py-4 px-10 rounded-2xl font-bold text-base md:text-lg btn-gold shadow-xl shadow-yellow-900/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <PartyPopper size={20} />
            {isTamil ? 'மீண்டும் கொண்டாடுங்கள்' : 'Celebrate Again 🎆'}
          </button>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
];

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLang();

  return (
    <div
      className="flex items-center gap-1 glass px-2 py-1.5 rounded-xl"
      role="group"
      aria-label="Language selector"
      onClick={e => e.stopPropagation()}
    >
      {LANGS.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          aria-pressed={lang === code}
          aria-label={`Switch to ${label}`}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 select-none ${
            lang === code
              ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/60 shadow-sm shadow-yellow-400/20'
              : 'text-yellow-600 hover:text-yellow-300 hover:bg-white/5'
          }`}
          style={{ fontFamily: code === 'ta' ? "'Noto Sans Tamil', sans-serif" : 'inherit' }}
        >
          <span aria-hidden="true">{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

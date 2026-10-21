import React, { useState, useEffect } from 'react';
import { X, Copy, Share2, Check } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext.jsx';

const enDefault = "Happy Diwali! May your life shine with happiness, prosperity, and endless possibilities. 🪔✨";
const taDefault = "இனிய தீபாவளி நல்வாழ்த்துகள்! உங்கள் வாழ்வில் மகிழ்ச்சி, செழிப்பு மற்றும் எண்ணற்ற நல்வாய்ப்புகள் ஒளிரட்டும்! 🪔✨";

export default function GreetingEditor({ onClose }) {
  const { t, lang } = useLang();
  const [name, setName] = useState('');
  const [message, setMessage] = useState(t.defaultGreeting);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (message === enDefault || message === taDefault) {
      setMessage(t.defaultGreeting);
    }
  }, [lang, t.defaultGreeting]);

  const closing = lang === 'ta' ? 'அன்புடன் 🎆' : 'With warm wishes 🎆';
  const dearPrefix = lang === 'ta' ? 'அன்புள்ள ' : 'Dear ';
  const greeting = name.trim()
    ? `${dearPrefix}${name.trim()},\n\n${message}\n\n${closing}`
    : message;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(greeting);
      setCopied(true);
      setError('');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError(t.copyFailed);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: t.mainTitle, text: greeting });
        setError('');
      } catch (e) {
        if (e.name !== 'AbortError') setError(t.shareCancelled);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="glass w-full max-w-md p-6 flex flex-col gap-4 border border-yellow-400/40 shadow-2xl shadow-yellow-950/50"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="gold-text font-bold text-xl">{t.greetingEditorTitle}</h2>
          <button
            onClick={onClose}
            className="text-yellow-400/70 hover:text-yellow-300 transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Name */}
        <div>
          <label className="text-yellow-400/80 text-xs mb-1 block font-medium">{t.recipientLabel}</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t.recipientPlaceholder}
            className="w-full bg-white/5 border border-yellow-400/25 rounded-xl px-3 py-2 text-yellow-100 text-sm placeholder-yellow-700/50 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/30 transition-all"
          />
        </div>

        {/* Message */}
        <div>
          <label className="text-yellow-400/80 text-xs mb-1 block font-medium">{t.messageLabel}</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={4}
            className="w-full bg-white/5 border border-yellow-400/25 rounded-xl px-3 py-2 text-yellow-100 text-sm placeholder-yellow-700/50 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/30 resize-none transition-all"
          />
        </div>

        {/* Preview */}
        <div className="bg-black/40 border border-yellow-400/20 rounded-xl p-3.5">
          <p className="text-yellow-400/60 text-xs mb-1 font-semibold tracking-wider">{t.previewLabel}</p>
          <p className="text-yellow-100/90 text-sm whitespace-pre-wrap leading-relaxed">{greeting}</p>
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-xs">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 btn-gold py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? t.copiedBtn : t.copyBtn}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 border border-yellow-400/30 text-yellow-300 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all cursor-pointer"
          >
            <Share2 size={16} />
            {t.shareBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useCallback, useRef } from 'react';
import FireworksScene from './components/FireworksScene.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import DiwaliGreeting from './components/DiwaliGreeting.jsx';
import CrackerGallery from './components/CrackerGallery.jsx';
import DiyaScene from './components/DiyaScene.jsx';
import CelebrationSection from './components/CelebrationSection.jsx';
import GreetingEditor from './components/GreetingEditor.jsx';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
import { useLang } from './i18n/LanguageContext.jsx';

export default function App() {
  const { t, lang } = useLang();
  const isTamil = lang === 'ta';

  const [paused, setPaused] = useState(false);
  const [autoShow, setAutoShow] = useState(false);
  const [rainbowMode, setRainbowMode] = useState(false);
  const [goldenMode, setGoldenMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particleIntensity, setParticleIntensity] = useState(0.8);
  const [showFrequency, setShowFrequency] = useState(2200);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [showGreetingEditor, setShowGreetingEditor] = useState(false);
  const [fireworkCount, setFireworkCount] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');

  const sceneRef = useRef(null);

  const showStatus = useCallback((msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 2500);
  }, []);

  const triggerMegaExplosion = useCallback(() => {
    sceneRef.current?.megaExplosion();
    showStatus(t.megaMsg);
  }, [showStatus, t.megaMsg]);

  const triggerGrandFinale = useCallback(() => {
    sceneRef.current?.grandFinale();
    showStatus(t.finaleMsg);
  }, [showStatus, t.finaleMsg]);

  const triggerLaunch = useCallback(() => {
    sceneRef.current?.launchRandom();
  }, []);

  const clearSky = useCallback(() => {
    sceneRef.current?.clearAll();
    showStatus(t.clearedMsg);
  }, [showStatus, t.clearedMsg]);

  const handleResetScene = useCallback(() => {
    sceneRef.current?.clearAll();
    setPaused(false);
    setAutoShow(false);
    setRainbowMode(false);
    setGoldenMode(false);
    showStatus(isTamil ? 'அனைத்தும் மீட்டமைக்கப்பட்டது' : 'Scene Reset');
  }, [isTamil, showStatus]);

  // Smooth scroll helpers
  const scrollToCrackers = () => {
    const el = document.getElementById('crackers-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDiyas = () => {
    const el = document.getElementById('diyas-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#02000a] text-white selection:bg-yellow-500 selection:text-black">
      {/* 1. Fullscreen 3D Fireworks Sky Background */}
      <FireworksScene
        ref={sceneRef}
        paused={paused}
        autoShow={autoShow}
        rainbowMode={rainbowMode}
        goldenMode={goldenMode}
        soundEnabled={soundEnabled}
        particleIntensity={particleIntensity}
        showFrequency={showFrequency}
        onFireworkLaunched={() => setFireworkCount((c) => c + 1)}
      />

      {/* 2. Top-Right Navigation: Language Switcher + Controls Toggle */}
      <header className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={() => setControlsVisible((v) => !v)}
          className="glass px-3.5 py-2 text-yellow-300 text-xs sm:text-sm font-semibold hover:bg-yellow-900/30 transition-all cursor-pointer border border-yellow-400/30 shadow-lg flex items-center gap-1.5"
          style={{ borderRadius: '12px' }}
        >
          <span>{controlsVisible ? '✕' : '⚙️'}</span>
          <span>{controlsVisible ? t.hideControls : t.showControls}</span>
        </button>
      </header>

      {/* 3. Floating Status Banner */}
      {statusMsg && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="glass px-8 py-4 text-yellow-300 font-black text-2xl md:text-3xl text-center animate-pulse shadow-2xl border border-yellow-400/60 rounded-2xl">
            {statusMsg}
          </div>
        </div>
      )}

      {/* 4. Hero Section */}
      <DiwaliGreeting
        fireworkCount={fireworkCount}
        onLaunchFireworks={triggerGrandFinale}
        onScrollToDiyas={scrollToDiyas}
        onScrollToCrackers={scrollToCrackers}
      />

      {/* 5. Interactive 3D Crackers Section */}
      <CrackerGallery
        t={t}
        isTamil={isTamil}
        soundEnabled={soundEnabled}
        particleIntensity={particleIntensity}
      />

      {/* 6. Sacred 3D Diyas & Rangoli Section */}
      <DiyaScene isTamil={isTamil} soundEnabled={soundEnabled} />

      {/* 7. Grand Celebration Message */}
      <CelebrationSection isTamil={isTamil} onCelebrateAgain={triggerGrandFinale} />

      {/* 8. Floating Control Panel */}
      {controlsVisible && (
        <ControlPanel
          t={t}
          paused={paused}
          autoShow={autoShow}
          rainbowMode={rainbowMode}
          goldenMode={goldenMode}
          soundEnabled={soundEnabled}
          particleIntensity={particleIntensity}
          showFrequency={showFrequency}
          fireworkCount={fireworkCount}
          onPause={() => setPaused((p) => !p)}
          onAutoShow={() => setAutoShow((a) => !a)}
          onRainbow={() => setRainbowMode((r) => !r)}
          onGolden={() => setGoldenMode((g) => !g)}
          onSound={(v) => setSoundEnabled(v)}
          onIntensity={setParticleIntensity}
          onFrequency={setShowFrequency}
          onLaunch={triggerLaunch}
          onMega={triggerMegaExplosion}
          onFinale={triggerGrandFinale}
          onClear={clearSky}
          onResetScene={handleResetScene}
          onGreeting={() => setShowGreetingEditor(true)}
          onFullscreen={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.().catch(() => {});
            } else {
              document.exitFullscreen?.().catch(() => {});
            }
          }}
        />
      )}

      {/* 9. Personalized Wishes Modal */}
      {showGreetingEditor && <GreetingEditor onClose={() => setShowGreetingEditor(false)} />}

      {/* 10. Footer */}
      <footer className="relative w-full py-8 text-center z-20 border-t border-yellow-500/10 bg-black/40 backdrop-blur-sm">
        <p className="text-yellow-500/70 text-xs md:text-sm font-medium tracking-widest">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}

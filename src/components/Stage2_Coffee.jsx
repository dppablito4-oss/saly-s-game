import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MESSAGES = [
  "Primer sorbo... el frío se va de tus manos ☕",
  "Segundo sorbo... ya no tiemblas tanto 🌡️",
  "Tercer sorbo... perdón por lo que dije 🥺",
  "Cuarto sorbo... te mereces más que palabras frías 💛",
];

const MAX_SIPS = MESSAGES.length;

// Sonido de café: tonos generados por WebAudio
function playSipSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  } catch(e) {}
}

export default function Stage2_Coffee({ onNext }) {
  const [sips, setSips] = useState(0);
  const [message, setMessage] = useState('');
  const [msgKey, setMsgKey] = useState(0);
  const [done, setDone] = useState(false);
  const levelRef = useRef(null);
  const smokeRef = useRef(null);
  const cupRef = useRef(null);

  const coffeeLevel = Math.max(0, 100 - (sips / MAX_SIPS) * 100);

  const handleSip = () => {
    if (done) return;
    playSipSound();

    const newSips = sips + 1;
    setSips(newSips);
    setMessage(MESSAGES[sips]);
    setMsgKey(k => k + 1);

    // Shake cup
    gsap.to(cupRef.current, {
      x: -4, duration: 0.05, yoyo: true, repeat: 5, ease: 'power1.inOut',
      onComplete: () => gsap.set(cupRef.current, { x: 0 })
    });

    if (newSips >= MAX_SIPS) {
      setTimeout(() => {
        setDone(true);
        // Heart smoke
        gsap.to(smokeRef.current, { opacity: 1, y: -30, duration: 1.5, ease: 'power2.out' });
        gsap.to(smokeRef.current, { scale: 1.3, duration: 2, yoyo: true, repeat: -1, ease: 'power1.inOut' });
      }, 700);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-stone-900 to-amber-950 overflow-hidden px-4">

      <h2 className="text-2xl font-bold text-amber-300 mb-2 tracking-tight">☕ Protocolo de Calorcito</h2>
      <p className="text-slate-400 text-sm mb-8">Haz clic en la taza para cada sorbo</p>

      {/* Message */}
      <div key={msgKey} className="h-10 flex items-center mb-6">
        {message && (
          <p className="text-amber-200 font-medium text-center text-base animate-fade-in px-4">
            {message}
          </p>
        )}
      </div>

      {/* Cup */}
      <div ref={cupRef} className="relative flex flex-col items-center cursor-pointer select-none" onClick={handleSip}>
        {/* Steam */}
        <div className="flex gap-3 mb-2 h-8">
          {!done && sips === 0 && (
            <>
              <SteamLine delay="0s" />
              <SteamLine delay="0.4s" />
              <SteamLine delay="0.8s" />
            </>
          )}
        </div>

        {/* Mug body */}
        <div className="relative w-40 h-44 rounded-b-3xl rounded-t-md overflow-hidden border-4 border-amber-800 bg-amber-950 shadow-2xl shadow-amber-900/60">
          {/* Coffee liquid */}
          <div
            ref={levelRef}
            className="absolute bottom-0 left-0 right-0 coffee-level bg-gradient-to-b from-amber-700 to-amber-900 rounded-b-3xl"
            style={{ height: `${coffeeLevel}%` }}
          />
          {/* Shine */}
          <div className="absolute top-2 left-2 w-4 h-10 bg-white/10 rounded-full rotate-12" />
        </div>

        {/* Handle */}
        <div className="absolute right-[-1.2rem] top-10 w-8 h-14 rounded-r-full border-4 border-amber-800 bg-transparent" />

        {/* Base plate */}
        <div className="w-52 h-3 rounded-full bg-amber-900/80 mt-2 shadow-md" />

        {/* Click hint */}
        {!done && (
          <span className="mt-3 text-xs text-amber-400/60 animate-bounce">toca para dar un sorbo</span>
        )}
      </div>

      {/* Heart smoke when done */}
      <div ref={smokeRef} className="text-5xl opacity-0 mt-6 transition-all" style={{ pointerEvents: 'none' }}>
        💨❤️
      </div>

      {done && (
        <div className="mt-6 flex flex-col items-center gap-4 animate-fade-in">
          <p className="text-amber-100 italic text-center max-w-xs text-base px-4">
            "¿Mejor? Espero que ese café virtual haya compensado mis palabras frías."
          </p>
          <button
            onClick={onNext}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold
              transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-amber-800/50"
          >
            Ir al Panel de Control →
          </button>
        </div>
      )}
    </div>
  );
}

function SteamLine({ delay }) {
  return (
    <div
      className="w-1 h-8 rounded-full bg-white/20"
      style={{ animation: `steam 2s ${delay} ease-in-out infinite` }}
    />
  );
}

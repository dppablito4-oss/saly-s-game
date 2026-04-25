import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';

// Mensajes basados en el chat real — él le dijo "tómate un cafecito o algo caliente"
const MESSAGES = [
  { text: "Primer sorbo... el frío se va de tus manos ☕", sub: "(te dije: 'tómate algo caliente')" },
  { text: "Segundo sorbo... ya no tiemblas tanto 🌡️", sub: "(un sorbito mas y estaras bien 😌)" },
  { text: "Tercer sorbo... ya te sientes mejor? 😌", sub: "(espero que si estes bien)" },
  { text: "Cuarto sorbo... y umm... perdóname por lo que dije antes SALY🥺", sub: "no era mi intención hacerte sentir mal" },
];

const MAX_SIPS = MESSAGES.length;

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
  } catch (e) { }
}

export default function Stage2_Coffee({ onNext }) {
  const [sips, setSips] = useState(0);
  const [message, setMessage] = useState(null);
  const [msgKey, setMsgKey] = useState(0);
  const [done, setDone] = useState(false);
  const smokeRef = useRef(null);
  const cupRef = useRef(null);

  const coffeeLevel = Math.max(0, 100 - (sips / MAX_SIPS) * 100);

  const handleSip = () => {
    if (done || sips >= MAX_SIPS) return;
    playSipSound();

    const newSips = sips + 1;
    setSips(newSips);
    setMessage(MESSAGES[sips]);
    setMsgKey(k => k + 1);

    gsap.to(cupRef.current, {
      x: -5, duration: 0.06, yoyo: true, repeat: 5, ease: 'power1.inOut',
      onComplete: () => gsap.set(cupRef.current, { x: 0 })
    });

    if (newSips >= MAX_SIPS) {
      setTimeout(() => {
        setDone(true);
        gsap.fromTo(smokeRef.current,
          { opacity: 0, y: 0 },
          { opacity: 1, y: -20, duration: 1.5, ease: 'power2.out' }
        );
        gsap.to(smokeRef.current, {
          scale: 1.2, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.5
        });
      }, 600);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a0e05 0%, #2d1a0a 50%, #0f172a 100%)' }}>

      <h2 className="text-2xl font-bold mb-1" style={{ color: '#fbbf24' }}>☕ Protocolo de Calorcito</h2>
      <p className="text-sm mb-2" style={{ color: '#78716c' }}>
        — tal como te dije: "tómate un cafesito o algo caliente" —
      </p>

      {/* Sip counter */}
      <div className="flex gap-1.5 mb-6">
        {Array.from({ length: MAX_SIPS }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-500"
            style={{ background: i < sips ? '#d97706' : '#44403c' }} />
        ))}
      </div>

      {/* Message */}
      <div key={msgKey} className="h-14 flex flex-col items-center justify-center mb-4 px-4">
        {message && (
          <>
            <p className="font-medium text-center text-base animate-fade-in" style={{ color: '#fde68a' }}>
              {message.text}
            </p>
            <p className="text-xs text-center mt-0.5 animate-fade-in" style={{ color: '#78716c', fontStyle: 'italic' }}>
              {message.sub}
            </p>
          </>
        )}
      </div>

      {/* Cup */}
      <div ref={cupRef} className="relative flex flex-col items-center cursor-pointer select-none"
        onClick={handleSip}>

        {/* Steam */}
        <div className="flex gap-4 mb-1 h-10 items-end justify-center">
          {!done && [0, 0.5, 1].map((d, i) => (
            <div key={i} className="w-1 rounded-full"
              style={{
                height: '2rem',
                background: 'rgba(255,255,255,0.12)',
                animation: `steam 2s ${d}s ease-in-out infinite`
              }} />
          ))}
        </div>

        {/* Mug */}
        <div className="relative w-44 h-48 rounded-b-3xl rounded-t-lg overflow-hidden"
          style={{ border: '4px solid #92400e', background: '#1c0f05', boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}>

          {/* Coffee fill */}
          <div className="absolute bottom-0 left-0 right-0 coffee-level"
            style={{
              height: `${coffeeLevel}%`,
              background: 'linear-gradient(180deg, #b45309 0%, #78350f 100%)',
              borderRadius: '0 0 1.5rem 1.5rem'
            }} />

          {/* Foam ring */}
          {sips === 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-3 rounded-b-3xl"
              style={{ background: 'rgba(251,191,36,0.15)', bottom: `${coffeeLevel}%` }} />
          )}

          {/* Mug shine */}
          <div className="absolute top-3 left-3 w-3 h-12 rounded-full rotate-12"
            style={{ background: 'rgba(255,255,255,0.07)' }} />

          {/* Empty message */}
          {done && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs" style={{ color: '#92400e', fontStyle: 'italic' }}>vacío 🥺</span>
            </div>
          )}
        </div>

        {/* Handle */}
        <div className="absolute w-8 h-16 rounded-r-full"
          style={{ right: '-1.1rem', top: '3rem', border: '4px solid #92400e' }} />

        {/* Saucer */}
        <div className="w-56 h-3 rounded-full mt-2"
          style={{ background: 'rgba(120,53,15,0.5)', boxShadow: '0 4px 8px rgba(0,0,0,0.4)' }} />

        {!done && (
          <span className="mt-3 text-xs animate-bounce" style={{ color: 'rgba(251,191,36,0.5)' }}>
            toca para dar un sorbo ({MAX_SIPS - sips} restantes)
          </span>
        )}
      </div>

      {/* Heart smoke */}
      <div ref={smokeRef} className="mt-6 text-5xl opacity-0 select-none">💨❤️</div>

      {done && (
        <div className="mt-6 flex flex-col items-center gap-4 animate-fade-in text-center">
          <p className="italic px-6 text-base" style={{ color: '#fde68a' }}>
            "¿Mejor? Espero que ese café virtual haya compensado mis palabras frías."
          </p>
          <button onClick={onNext}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #b45309, #d97706)', boxShadow: '0 8px 24px rgba(180,83,9,0.4)' }}>
            Ir al Panel de Control →
          </button>
        </div>
      )}
    </div>
  );
}

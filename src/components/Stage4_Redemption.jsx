import React, { useState, useEffect } from 'react';

const FULL_TEXT = `Sé que el consejo de "debiste llevar abrigo" no era lo que necesitabas escuchar cuando tenías frío.

Lo que necesitabas era que estuviera ahí contigo.

Como no puedo ir corriendo a Punchao ahora mismo... te construí esto.

¿Me perdonas, Saly?`;

const FORGIVE_SOUND_FN = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
      osc.start(start); osc.stop(start + 0.6);
    });
  } catch(e) {}
};

export default function Stage4_Redemption() {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [forgiven, setForgiven] = useState(false);
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= FULL_TEXT.length) {
        setDisplayed(FULL_TEXT.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 38);
    return () => clearInterval(interval);
  }, []);

  const handleForgive = () => {
    FORGIVE_SOUND_FN();
    setForgiven(true);
    const newHearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 0.8,
      size: 1 + Math.random() * 1.5,
    }));
    setHearts(newHearts);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: 'linear-gradient(135deg, #1a0a05 0%, #2d1b10 40%, #0f172a 100%)' }}>

      {/* Floating hearts when forgiven */}
      {hearts.map(h => (
        <div
          key={h.id}
          className="absolute text-red-400 pointer-events-none"
          style={{
            left: `${h.x}%`,
            bottom: '10%',
            fontSize: `${h.size * 1.5}rem`,
            animation: `float-up 3s ${h.delay}s ease-out forwards`,
            opacity: 0,
          }}
        >
          ❤️
        </div>
      ))}

      {/* Card */}
      <div className="relative z-10 max-w-md w-full bg-stone-900/80 border border-amber-900/40 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
        {/* Icon */}
        <div className="text-center mb-6">
          <span className="text-4xl">{forgiven ? '🌟' : '💌'}</span>
        </div>

        {/* Typewriter text */}
        <p
          className="text-amber-100 leading-relaxed text-lg whitespace-pre-line text-center"
          style={{ fontFamily: "'Caveat', cursive", minHeight: '14rem' }}
        >
          {displayed}
          {!done && <span className="animate-pulse text-amber-400">|</span>}
        </p>

        {/* Button */}
        {done && !forgiven && (
          <div className="mt-8 text-center animate-fade-in">
            <button
              onClick={handleForgive}
              className="px-8 py-4 rounded-2xl font-bold text-lg
                bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400
                text-white shadow-lg shadow-rose-900/50
                transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Sí, te perdono 💛
            </button>
          </div>
        )}

        {forgiven && (
          <div className="mt-8 text-center animate-fade-in">
            <p
              className="text-amber-200 text-2xl"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              ✨ Gracias, Saly. Prometo no ser tan tonto la próxima vez. ✨
            </p>
          </div>
        )}
      </div>

      {/* Floating hearts keyframe styles (injected inline) */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-80vh) scale(1.2); opacity: 0; }
        }
        @keyframes steam {
          0%   { transform: translateY(0) scaleX(1);   opacity: 0.4; }
          50%  { transform: translateY(-12px) scaleX(1.4); opacity: 0.6; }
          100% { transform: translateY(-24px) scaleX(0.6); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease forwards; }
      `}</style>
    </div>
  );
}

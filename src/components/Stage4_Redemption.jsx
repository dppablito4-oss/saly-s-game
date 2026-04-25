import React, { useState, useEffect, useRef } from 'react';

// Mensaje actualizado — ella YA lo perdonó, así que el tono cambia
const FULL_TEXT = `Sé que lo que dije no fue justo.

"Decir que era tu 'descuido' fue un error; 
lo que realmente necesitaba decirte era que quería estar ahí para 
cuidarte. No era momento de juzgar, sino de acompañarte.

Sé que ya me perdonaste, pero quería construirte este 
rincón virtual. Porque un 'okey' tuyo vale muchísimo para mí, 
y quería esforzarme para estar a la altura de lo que mereces.

¿Ya tienes calor, Saly? 🥺`;

function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.start(t); osc.stop(t + 0.7);
    });
  } catch (e) { }
}

export default function Stage4_Redemption() {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [forgiven, setForgiven] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [showCandy, setShowCandy] = useState(false);
  const [candyClicked, setCandyClicked] = useState(false);

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
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleForgive = () => {
    playChime();
    setForgiven(true);
    setHearts(Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      delay: Math.random() * 1,
      size: 1 + Math.random() * 1.8,
    })));
    // El dulce aparece 2s después del perdón
    setTimeout(() => setShowCandy(true), 2000);
  };

  const handleCandyClick = () => {
    setCandyClicked(true);
    // pequeño chime dulce
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [880, 1046, 1318].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.12;
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        o.start(t); o.stop(t + 0.5);
      });
    } catch (e) { }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: 'linear-gradient(135deg, #1a0a05 0%, #2d1b10 40%, #0f172a 100%)' }}>

      {/* Floating hearts */}
      {hearts.map(h => (
        <div key={h.id} className="absolute pointer-events-none select-none"
          style={{
            left: `${h.x}%`, bottom: '8%',
            fontSize: `${h.size * 1.5}rem`,
            animation: `float-up 3.5s ${h.delay}s ease-out forwards`,
            opacity: 0,
          }}>❤️</div>
      ))}

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl p-8"
        style={{
          background: 'rgba(28,15,5,0.85)',
          border: '1px solid rgba(180,83,9,0.25)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)'
        }}>

        {/* Icon */}
        <div className="text-center text-4xl mb-6">
          {forgiven ? '🌟' : '💌'}
        </div>

        {/* Typewriter text */}
        <p className="leading-relaxed text-lg whitespace-pre-line text-center"
          style={{
            fontFamily: "'Caveat', cursive",
            color: '#fde68a',
            minHeight: '16rem'
          }}>
          {displayed}
          {!done && <span className="animate-pulse" style={{ color: '#d97706' }}>|</span>}
        </p>

        {/* Forgive button */}
        {done && !forgiven && (
          <div className="mt-8 text-center animate-fade-in">
            <button onClick={handleForgive}
              className="px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Caveat', cursive",
                background: 'linear-gradient(135deg, #be123c, #ec4899)',
                boxShadow: '0 8px 32px rgba(190,18,60,0.4)'
              }}>
              Sí, ya te perdoné 💛
            </button>
          </div>
        )}

        {/* After forgive */}
        {forgiven && (
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-xl mb-6" style={{ fontFamily: "'Caveat', cursive", color: '#fde68a' }}>
              ✨ Gracias, Saly. Prometo pensar antes de hablar. ✨
            </p>
            
            <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-amber-900/20 text-left">
              <p className="text-sm mb-4" style={{ fontFamily: "'Caveat', cursive", color: '#a16207' }}>
                Si quieres decirme algo (aunque sea para seguir riñéndome), puedes escribirlo aquí y me llegará directo:
              </p>
              <form 
                action="https://formspree.io/f/TU_ID_AQUÍ" 
                method="POST"
                className="flex flex-col gap-3"
              >
                <textarea 
                  name="mensaje"
                  placeholder="Escribe aquí..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-amber-900/30 text-amber-100 placeholder-amber-900/40 focus:outline-none focus:border-amber-500 transition-colors"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem' }}
                  rows="3"
                  required
                ></textarea>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 self-end"
                  style={{ 
                    fontFamily: "'Caveat', cursive", 
                    background: 'linear-gradient(135deg, #b45309, #d97706)',
                    fontSize: '1rem'
                  }}
                >
                  Enviar respuesta ✉️
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 🍬 Easter egg — el dulce que él no pudo comprarle */}
      {showCandy && !candyClicked && (
        <div
          className="mt-6 flex flex-col items-center gap-2 cursor-pointer animate-fade-in z-20"
          onClick={handleCandyClick}
          title="toca el dulce">
          <div className="text-6xl hover:scale-110 transition-transform duration-200 animate-bounce select-none">🍬</div>
          <p className="text-xs text-center" style={{ color: '#78716c', fontStyle: 'italic' }}>
            psst... toca el dulce
          </p>
        </div>
      )}

      {candyClicked && (
        <div className="mt-6 flex flex-col items-center gap-1 animate-fade-in z-20">
          <div className="text-4xl select-none">🍬</div>
          <p className="text-sm text-center px-8" style={{ fontFamily: "'Caveat', cursive", color: '#fde68a', fontSize: '1.1rem' }}>
            "Ya cómprame" — me dijiste.
          </p>
          <p className="text-sm text-center px-8" style={{ fontFamily: "'Caveat', cursive", color: '#a16207', fontSize: '1rem' }}>
            No tengo Yape... pero tengo esto. 🥺
          </p>
        </div>
      )}

      {/* Keyframes */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translateY(-85vh) scale(1.3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

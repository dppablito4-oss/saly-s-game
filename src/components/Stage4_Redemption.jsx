import React, { useState, useEffect, useRef } from 'react';

const FULL_TEXT = `Sé que lo que dije no fue justo.

"Decir que era tu 'descuido' fue un error; 
lo que realmente necesitaba decirte era que quería estar ahí para 
cuidarte. No era momento de juzgar, sino de acompañarte.

Sé que ya me perdonaste, pero quería construirte este 
rincón virtual. Porque un 'okey' tuyo vale muchísimo para mí, 
y quería esforzarme para estar a la altura de lo que mereces.

¿Ya tienes calor, Saly? 🥺`;

const CANDIES = [
  { id: 1, type: '🍫', label: 'Bolita de Chocolate', color: '#4b2c20' },
  { id: 2, type: '🍓', label: 'Dulce de Fresa', color: '#ef4444' },
  { id: 3, type: '🍬', label: 'Caramelo', color: '#fbbf24' },
  { id: 4, type: '🍫', label: 'Trufa', color: '#3e2723' },
  { id: 5, type: '🍓', label: 'Gomita de Fresa', color: '#f87171' },
  { id: 6, type: '🍭', label: 'Chupetín', color: '#ec4899' },
];

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

function playPop() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  } catch (e) { }
}

export default function Stage4_Redemption() {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [forgiven, setForgiven] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [candyPhase, setCandyPhase] = useState('none'); // none, intro, play, final
  const [eatenCount, setEatenCount] = useState(0);
  const [candies, setCandies] = useState(CANDIES.map(c => ({ ...c, eaten: false })));
  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('https://formspree.io/f/mykloova', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (e) {
      setFormStatus('error');
    }
  };

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
    setTimeout(() => setCandyPhase('intro'), 2500);
  };

  const eatCandy = (id) => {
    playPop();
    setCandies(prev => prev.map(c => c.id === id ? { ...c, eaten: true } : c));
    setEatenCount(prev => {
      const next = prev + 1;
      if (next === CANDIES.length) {
        setTimeout(() => setCandyPhase('final'), 1500);
      }
      return next;
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12"
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

      {/* Card Principal */}
      {candyPhase !== 'final' && (
        <div className="relative z-10 w-full max-w-md rounded-3xl p-8 mb-8"
          style={{
            background: 'rgba(28,15,5,0.85)',
            border: '1px solid rgba(180,83,9,0.25)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            transition: 'all 0.5s ease'
          }}>

          <div className="text-center text-4xl mb-6">
            {forgiven ? '🌟' : '💌'}
          </div>

          <p className="leading-relaxed text-lg whitespace-pre-line text-center"
            style={{
              fontFamily: "'Caveat', cursive",
              color: '#fde68a',
              minHeight: forgiven ? 'auto' : '16rem'
            }}>
            {displayed}
            {!done && <span className="animate-pulse" style={{ color: '#d97706' }}>|</span>}
          </p>

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

          {forgiven && candyPhase === 'intro' && (
            <div className="mt-8 text-center animate-fade-in">
              <p className="text-xl mb-4" style={{ fontFamily: "'Caveat', cursive", color: '#fde68a' }}>
                ✨ Gracias, Saly. Prometo pensar antes de hablar. ✨
              </p>
              <div 
                onClick={() => setCandyPhase('play')}
                className="inline-block cursor-pointer p-4 rounded-2xl bg-amber-950/40 border border-amber-600/30 hover:bg-amber-900/50 transition-all hover:scale-105"
              >
                <p className="text-2xl mb-1">🍬</p>
                <p className="text-xs" style={{ color: '#d97706' }}>Toca para una sorpresa...</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Candy Game Phase */}
      {candyPhase === 'play' && (
        <div className="relative z-10 w-full max-w-md text-center animate-fade-in">
          <h3 className="text-2xl mb-2 text-amber-200" style={{ fontFamily: "'Caveat', cursive" }}>
            Sé que no pudiste comprarte un dulce hoy...
          </h3>
          <p className="text-base mb-8 text-amber-900/80" style={{ fontFamily: "'Caveat', cursive" }}>
            Así que te envío todos estos. Toca cada uno para comerlo:
          </p>
          
          <div className="grid grid-cols-3 gap-6 mb-8 px-4">
            {candies.map(candy => (
              <div 
                key={candy.id}
                onClick={() => !candy.eaten && eatCandy(candy.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-500
                  ${candy.eaten ? 'scale-0 opacity-0' : 'scale-100 opacity-100 cursor-pointer hover:rotate-12'}`}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(180,83,9,0.1)' }}
              >
                <span className="text-4xl mb-1">{candy.type}</span>
                <span className="text-[10px] text-amber-900/40 uppercase tracking-tighter">{candy.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs italic text-slate-600">
            {CANDIES.length - eatenCount} dulces restantes...
          </p>
        </div>
      )}

      {/* Final Redemption Message Phase */}
      {candyPhase === 'final' && (
        <div className="relative z-10 w-full max-w-md text-center animate-fade-in">
          <div className="text-6xl mb-6">🍭✨❤️</div>
          <p className="text-2xl leading-relaxed mb-10 px-4" style={{ fontFamily: "'Caveat', cursive", color: '#fde68a' }}>
            Espero que te hayas divertido un poquito... <br/><br/>
            Y espero que esta vez sí te dejes comprar un dulce para que endulces tus hermosos labios. 👄💛
          </p>

          <div className="p-8 rounded-3xl bg-white/5 border border-amber-900/20 text-left mb-8 shadow-2xl">
            <p className="text-sm mb-4" style={{ fontFamily: "'Caveat', cursive", color: '#a16207' }}>
              Si quieres decirme algo, puedes escribirlo aquí y me llegará directo:
            </p>
            {formStatus === 'success' ? (
              <div className="py-8 text-center animate-fade-in">
                <p className="text-2xl mb-2">✨💌✨</p>
                <p className="text-xl" style={{ fontFamily: "'Caveat', cursive", color: '#fbbf24' }}>
                  ¡Mensaje enviado con éxito! <br/> Gracias por escribirme, Saly.
                </p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-4 text-xs text-amber-900/40 hover:text-amber-500 underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <textarea 
                  name="mensaje"
                  placeholder="Escribe aquí..."
                  className="w-full p-3 rounded-xl bg-black/40 border border-amber-900/30 text-amber-100 placeholder-amber-900/40 focus:outline-none focus:border-amber-500 transition-colors"
                  style={{ fontFamily: "'Caveat', cursive", fontSize: '1.1rem' }}
                  rows="3"
                  required
                  disabled={formStatus === 'sending'}
                ></textarea>
                <button 
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className={`px-6 py-2 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95 self-end ${formStatus === 'sending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ 
                    fontFamily: "'Caveat', cursive", 
                    background: 'linear-gradient(135deg, #b45309, #d97706)',
                    fontSize: '1rem'
                  }}
                >
                  {formStatus === 'sending' ? 'Enviando...' : 'Enviar respuesta ✉️'}
                </button>
                {formStatus === 'error' && (
                  <p className="text-xs text-red-500 text-right">Hubo un error. Inténtalo de nuevo.</p>
                )}
              </form>
            )}
            
            <div className="mt-8 pt-4 border-t border-amber-900/10 text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-4">
                Developed by Samuel (pablitodp)
              </p>
              <a 
                href="https://wa.me/51918165428?text=He%20visto%20lo%20que%20enviaste%20y%20..."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-amber-900/60 hover:text-amber-500 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span>¿Prefieres avisarme por WhatsApp?</span>
                <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px]">918165428</span>
              </a>
            </div>
          </div>
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

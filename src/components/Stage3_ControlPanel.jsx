import React, { useState, useEffect } from 'react';

const CARDS = [
  {
    emoji: '🌟',
    title: 'Para Saly,',
    body: 'Eres de las personas más especiales que han entrado en mi vida. No lo digo de relleno — lo digo porque es verdad.',
    from: '— Samuel',
    color: '#fbbf24',
    bg: 'rgba(120,53,15,0.25)',
    border: 'rgba(251,191,36,0.2)',
  },
  {
    emoji: '🌧️',
    title: 'Sobre el frío de hoy,',
    body: 'Sé que el barro de Punchao no estaba fácil. Y sé que mis palabras te hicieron más frío todavía. Lo siento de verdad.',
    from: '— el tonto de Samuel',
    color: '#93c5fd',
    bg: 'rgba(29,78,216,0.15)',
    border: 'rgba(147,197,253,0.2)',
  },
  {
    emoji: '💛',
    title: 'Lo que quiero que sepas,',
    body: 'Me importa cómo estás. Me importa si tienes frío, si te mojaste, si las carreteras están horrible. Me importas tú.',
    from: '— siempre',
    color: '#fde68a',
    bg: 'rgba(180,83,9,0.2)',
    border: 'rgba(253,230,138,0.2)',
  },
  {
    emoji: '🍃',
    title: 'Una cosita más,',
    body: 'Eres ese algo que me falta para estar bien, y por eso cuidarte es lo único que me importa ahora',
    from: '— Samuel 🥺',
    color: '#6ee7b7',
    bg: 'rgba(6,78,59,0.2)',
    border: 'rgba(110,231,183,0.15)',
  },
  {
    emoji: '✨',
    title: 'Lo más importante,',
    body: 'Para mí no eres una persona más. Eres única, con tus cosas, tus dramas y tu frío. Y así me encantas. No cambies por nada.',
    from: '— de corazón',
    color: '#fb7185',
    bg: 'rgba(159,18,57,0.18)',
    border: 'rgba(251,113,133,0.2)',
  },
];

function playOpenSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(); osc.stop(ctx.currentTime + 0.35);
  } catch (e) { }
}

export default function Stage3_ControlPanel({ onNext }) {
  const [opened, setOpened] = useState([]); // índices de cartas abiertas
  const [current, setCurrent] = useState(0); // carta activa/visible

  const handleOpen = (idx) => {
    if (opened.includes(idx)) return;
    playOpenSound();
    setOpened(o => [...o, idx]);
  };

  const allOpened = opened.length === CARDS.length;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1c1108 60%, #0f172a 100%)' }}>

      {/* Header */}
      <div className="text-center mb-8">
        <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: '#57534e' }}>
          — cartas para Saly —
        </p>
        <h2 className="text-2xl font-bold" style={{ color: '#fbbf24' }}>
          Cosas que no te dije
        </h2>
        <p className="text-sm mt-1" style={{ color: '#57534e' }}>
          Toca cada sobre para abrirlo 💌
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
        {CARDS.map((card, idx) => {
          const isOpen = opened.includes(idx);
          return (
            <div key={idx}
              onClick={() => handleOpen(idx)}
              className="relative rounded-2xl p-4 cursor-pointer select-none transition-all duration-500"
              style={{
                background: isOpen ? card.bg : 'rgba(15,23,42,0.9)',
                border: `1px solid ${isOpen ? card.border : 'rgba(71,85,105,0.35)'}`,
                boxShadow: isOpen ? `0 8px 32px ${card.border}` : '0 4px 12px rgba(0,0,0,0.4)',
                transform: isOpen ? 'scale(1.03)' : 'scale(1)',
                minHeight: '9rem',
              }}>

              {/* Envelope flap animation */}
              {!isOpen ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 py-2">
                  <div className="text-3xl" style={{ filter: 'grayscale(0.4)' }}>💌</div>
                  <p className="text-xs text-center" style={{ color: '#44403c' }}>toca para abrir</p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="text-2xl mb-2">{card.emoji}</div>
                  <p className="text-xs font-semibold mb-1" style={{ color: card.color, fontFamily: "'Caveat', cursive", fontSize: '0.95rem' }}>
                    {card.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#d6d3d1', fontFamily: "'Caveat', cursive", fontSize: '0.85rem' }}>
                    {card.body}
                  </p>
                  <p className="text-xs mt-2 text-right" style={{ color: card.color, opacity: 0.7, fontFamily: "'Caveat', cursive" }}>
                    {card.from}
                  </p>
                </div>
              )}

              {/* Seal */}
              {!isOpen && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                  style={{ background: 'rgba(180,83,9,0.3)', border: '1px solid rgba(251,191,36,0.3)' }}>
                  🔒
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {CARDS.map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full transition-all duration-500"
            style={{ background: opened.includes(i) ? '#d97706' : '#292524' }} />
        ))}
      </div>

      {/* Continue button, shows after all opened */}
      {allOpened && (
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <p className="text-sm italic" style={{ color: '#a78bfa' }}>
            ✨ Ya leíste todo lo que quería decirte ✨
          </p>
          <button onClick={onNext}
            className="px-8 py-3 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              boxShadow: '0 8px 28px rgba(124,58,237,0.4)'
            }}>
            Seguir → 💌
          </button>
        </div>
      )}
    </div>
  );
}

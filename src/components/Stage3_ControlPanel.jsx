import React, { useState } from 'react';
import { gsap } from 'gsap';

function playToggleSound(on) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'square';
    osc.frequency.setValueAtTime(on ? 660 : 330, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(on ? 880 : 220, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain(); gain.gain.value = 0.4;
    src.connect(gain); gain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

export default function Stage3_ControlPanel({ onNext }) {
  const [sw, setSw] = useState({ dry: false, mud: false, samuel: false });
  const [glowOrange, setGlowOrange] = useState(false);
  const [showMud, setShowMud] = useState(false);

  const toggle = (key) => {
    const newVal = !sw[key];
    setSw(s => ({ ...s, [key]: newVal }));
    playToggleSound(newVal);

    if (key === 'dry' && newVal) {
      setGlowOrange(false);
      requestAnimationFrame(() => setTimeout(() => setGlowOrange(true), 10));
      setTimeout(() => setGlowOrange(false), 2500);
    }
    if (key === 'mud' && newVal) {
      playPopSound();
      setShowMud(true);
      setTimeout(() => setShowMud(false), 2200);
    }
    if (key === 'samuel' && newVal) {
      setTimeout(() => onNext(), 1400);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden transition-all duration-700"
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1c1917 100%)',
        boxShadow: glowOrange ? 'inset 0 0 160px 60px rgba(251,146,60,0.3)' : 'none',
        transition: 'box-shadow 0.5s ease'
      }}>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-1" style={{ color: '#fbbf24' }}>🛡️ Escudo Térmico</h2>
        <p className="text-sm" style={{ color: '#57534e' }}>
          Panel de emergencia — Punchao, Lima
        </p>
      </div>

      {/* Panel */}
      <div className="w-full max-w-sm rounded-2xl p-7 backdrop-blur-sm"
        style={{
          background: 'rgba(15,23,42,0.85)',
          border: '1px solid rgba(71,85,105,0.4)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.6)'
        }}>

        <SwitchRow
          icon="🧥" label="Secar ropa mojada"
          sub="Termosecado de emergencia activado"
          active={sw.dry} onToggle={() => toggle('dry')}
        />
        <div className="my-5" style={{ borderTop: '1px solid rgba(71,85,105,0.3)' }} />
        <SwitchRow
          icon="👟" label="Limpiar barro de los zapatos"
          sub={`Carreteras de Punchao: "puro horrible" ✓`}
          active={sw.mud} onToggle={() => toggle('mud')}
        />
        <div className="my-5" style={{ borderTop: '1px solid rgba(71,85,105,0.3)' }} />
        <SwitchRow
          icon="🔄" label="Reiniciar humor de Samuel"
          sub="⚠ Acción: mostrar disculpa sincera"
          active={sw.samuel} onToggle={() => toggle('samuel')}
          highlight
        />
      </div>

      {/* Status */}
      <div className="mt-6 h-10 flex items-center justify-center">
        {glowOrange && (
          <p className="text-sm font-medium animate-pulse" style={{ color: '#fb923c' }}>
            🔥 Calor activado — ropa secándose a toda velocidad...
          </p>
        )}
        {showMud && (
          <p className="text-sm font-medium animate-fade-in" style={{ color: '#fbbf24' }}>
            ✨ ¡POP! Barro de Punchao eliminado. Zapatos limpios. 
          </p>
        )}
        {sw.samuel && !glowOrange && !showMud && (
          <p className="text-sm font-medium animate-pulse" style={{ color: '#34d399' }}>
            ♻ Cargando disculpa sincera... 
          </p>
        )}
      </div>
    </div>
  );
}

function SwitchRow({ icon, label, sub, active, onToggle, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="font-semibold text-sm" style={{ color: highlight ? '#fbbf24' : '#e2e8f0' }}>{label}</p>
          <p className="text-xs mt-0.5" style={{ color: '#57534e' }}>{sub}</p>
        </div>
      </div>
      <button onClick={onToggle}
        className="relative inline-flex shrink-0 cursor-pointer rounded-full border-2 transition-all duration-300 focus:outline-none"
        style={{
          width: '3.5rem', height: '1.75rem',
          background: active ? (highlight ? '#d97706' : '#10b981') : '#374151',
          borderColor: active ? (highlight ? '#f59e0b' : '#34d399') : '#4b5563'
        }}>
        <span className="inline-block rounded-full shadow-lg transform transition-transform duration-300"
          style={{
            width: '1.25rem', height: '1.25rem',
            marginTop: '0.125rem',
            background: 'white',
            transform: active ? 'translateX(1.75rem)' : 'translateX(0.125rem)'
          }} />
      </button>
    </div>
  );
}

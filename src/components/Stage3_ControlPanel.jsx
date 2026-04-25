import React, { useState, useRef } from 'react';
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
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

function playPopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain(); gain.gain.value = 0.5;
    src.connect(gain); gain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

export default function Stage3_ControlPanel({ onNext }) {
  const [switches, setSwitches] = useState({ dry: false, mud: false, samuel: false });
  const [glowOrange, setGlowOrange] = useState(false);
  const [showMudClean, setShowMudClean] = useState(false);
  const bgRef = useRef(null);

  const toggle = (key) => {
    const newVal = !switches[key];
    setSwitches(s => ({ ...s, [key]: newVal }));
    playToggleSound(newVal);

    if (key === 'dry' && newVal) {
      setGlowOrange(false);
      setTimeout(() => setGlowOrange(true), 10);
      setTimeout(() => setGlowOrange(false), 2200);
    }

    if (key === 'mud' && newVal) {
      playPopSound();
      setShowMudClean(true);
      setTimeout(() => setShowMudClean(false), 2000);
    }

    if (key === 'samuel' && newVal) {
      setTimeout(() => onNext(), 1200);
    }
  };

  return (
    <div
      ref={bgRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-stone-900 to-slate-900 overflow-hidden px-4"
      style={{
        transition: 'box-shadow 0.3s',
        boxShadow: glowOrange ? 'inset 0 0 120px 40px rgba(251, 146, 60, 0.35)' : 'none'
      }}
    >
      {/* Panel Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-300 mb-1">🛡️ Escudo Térmico</h2>
        <p className="text-slate-500 text-sm">Panel de control — Activa todos los módulos</p>
      </div>

      {/* Panel Box */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl backdrop-blur-sm">
        <SwitchItem
          label="Secar ropa mojada"
          sublabel="Módulo de termosecado activado"
          icon="🧥"
          active={switches.dry}
          onToggle={() => toggle('dry')}
        />
        <div className="my-5 border-t border-slate-700" />
        <SwitchItem
          label="Limpiar barro de los zapatos"
          sublabel="Módulo de limpieza Punchao v1.0"
          icon="👟"
          active={switches.mud}
          onToggle={() => toggle('mud')}
        />
        <div className="my-5 border-t border-slate-700" />
        <SwitchItem
          label="Reiniciar humor de Samuel"
          sublabel="⚠ Acción irreversible — activa con cuidado"
          icon="🔄"
          active={switches.samuel}
          onToggle={() => toggle('samuel')}
          highlight
        />
      </div>

      {/* Status Messages */}
      {glowOrange && (
        <p className="mt-6 text-orange-300 text-sm font-medium animate-pulse">
          🔥 Calor activado — ropa secándose...
        </p>
      )}
      {showMudClean && (
        <p className="mt-6 text-yellow-300 text-sm font-medium animate-fade-in">
          ✨ ¡POP! Barro eliminado. Zapatos impecables.
        </p>
      )}
      {switches.samuel && (
        <p className="mt-6 text-emerald-300 text-sm font-medium animate-pulse">
          ♻ Reiniciando humor... cargando disculpa sincera...
        </p>
      )}
    </div>
  );
}

function SwitchItem({ label, sublabel, icon, active, onToggle, highlight }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className={`font-semibold text-sm ${highlight ? 'text-amber-300' : 'text-white'}`}>{label}</p>
          <p className="text-slate-500 text-xs mt-0.5">{sublabel}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-300 focus:outline-none
          ${active
            ? highlight ? 'bg-amber-500 border-amber-400' : 'bg-emerald-500 border-emerald-400'
            : 'bg-slate-600 border-slate-500'
          }`}
      >
        <span
          className={`inline-block h-5 w-5 mt-0.5 rounded-full shadow-lg transform transition-transform duration-300
            ${active ? 'translate-x-7 bg-white' : 'translate-x-0.5 bg-slate-300'}`}
        />
      </button>
    </div>
  );
}

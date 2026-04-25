import React, { useEffect, useRef } from 'react';

const DROPS = 120;

export default function Stage1_Rain({ onActivate }) {
  const rainRef = useRef(null);

  useEffect(() => {
    const container = rainRef.current;
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < DROPS; i++) {
      const drop = document.createElement('div');
      drop.classList.add('drop');
      drop.style.left = Math.random() * 100 + 'vw';
      drop.style.animationDuration = (0.4 + Math.random() * 0.8) + 's';
      drop.style.animationDelay = (Math.random() * 2) + 's';
      drop.style.opacity = 0.3 + Math.random() * 0.5;
      drop.style.height = (10 + Math.random() * 20) + 'px';
      container.appendChild(drop);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-night-blue">
      {/* Rain */}
      <div ref={rainRef} className="rain-container" />

      {/* Fog overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/90 pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center max-w-2xl">
        {/* Status Terminal */}
        <div className="border border-slate-600 bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 text-left w-full font-mono shadow-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-slate-500 text-xs ml-2">sistema_calorcito.exe</span>
          </div>
          <TerminalLine delay={0} text="● Escaneando distrito de Punchao..." />
          <TerminalLine delay={600} text="● Temperatura detectada: [ FRÍO EXTREMO ]" color="text-blue-400" />
          <TerminalLine delay={1200} text="● Humedad: [ BARRO. MUCHO BARRO ]" color="text-yellow-400" />
          <TerminalLine delay={1800} text="● Ropa: [ MOJADA ]" color="text-yellow-400" />
          <TerminalLine delay={2400} text="● Estado de Saly: [ ★ ENOJADA CON SAMUEL ★ ]" color="text-red-400" />
          <TerminalLine delay={3000} text="● Causa del problema: Samuel dijo algo estúpido." color="text-red-300" />
          <TerminalLine delay={3600} text="▸ Iniciando PROTOCOLO DE CALORCITO..." color="text-emerald-400" blink />
        </div>

        {/* Button */}
        <button
          onClick={onActivate}
          className="mt-2 px-8 py-4 text-lg font-bold rounded-xl cursor-pointer
            bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400
            text-white shadow-lg shadow-amber-900/50
            border border-amber-400/40
            transition-all duration-300 hover:scale-105 hover:shadow-amber-700/60 active:scale-95
            tracking-wide"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          [ Activar Protocolo de Calorcito ]
        </button>
      </div>
    </div>
  );
}

function TerminalLine({ text, color = 'text-slate-300', delay, blink }) {
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return <div className="h-5 mb-1" />;

  return (
    <div className={`text-sm mb-1 ${color} ${blink ? 'animate-pulse' : ''} transition-opacity duration-500`}>
      {text}
    </div>
  );
}

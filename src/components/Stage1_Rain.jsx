import React, { useEffect, useRef } from 'react';

const DROPS = 140;

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
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060d1f 0%, #0a1628 60%, #0d1117 100%)' }}>

      {/* Rain */}
      <div ref={rainRef} className="rain-container" />

      {/* Fog overlay */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'linear-gradient(180deg, rgba(10,22,40,0.7) 0%, transparent 50%, rgba(10,22,40,0.85) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center max-w-lg w-full">

        {/* Distrito badge */}
        <div className="flex items-center gap-2 text-slate-500 text-xs font-mono tracking-widest uppercase">
          <span className="inline-block w-4 h-px bg-slate-600" />
          Distrito de Punchao — Lima, Perú
          <span className="inline-block w-4 h-px bg-slate-600" />
        </div>

        {/* Terminal */}
        <div className="border border-slate-700/80 bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 text-left w-full shadow-2xl shadow-black/60">
          <div className="flex items-center gap-1.5 mb-5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-slate-600 text-xs ml-2 font-mono">protocolo_calorcito.exe</span>
          </div>

          <TerminalLine delay={200} text="● Escaneando distrito de Punchao..." />
          <TerminalLine delay={900} text="● Temperatura: [ FRÍO. MUCHO FRÍO ]" color="text-blue-400" />
          <TerminalLine delay={1600} text="● Carreteras: [ BARROOOO ]" color="text-yellow-400" />
          <TerminalLine delay={2300} text="● Ropa de Saly: [ MOJADA ]" color="text-yellow-400" />
          <TerminalLine delay={3000} text='● Cambio de ropa llevado: [ NO 🥺 ]' color="text-orange-400" />
          <TerminalLine delay={3700} text="● Tiendas cercanas: [ Solo de dulces ]" color="text-slate-400" />
          <TerminalLine delay={4400} text='● Error detectado: dije "te enfermas por descuido tuyo"' color="text-red-400" />
          <TerminalLine delay={5200} text='● Respuesta de Saly: "💔' color="text-red-300" />
          <TerminalLine delay={6000} text="● Estado actual de Saly: [ Está bien, te perdono 🥺 ]" color="text-emerald-400" />
          <TerminalLine delay={6800} text="▸ Iniciando PROTOCOLO DE CAFESITO CALIENTE v3.0..." color="text-amber-400" blink />
        </div>

        {/* Button */}
        <button
          onClick={onActivate}
          className="px-8 py-4 text-base font-bold rounded-xl cursor-pointer text-white tracking-wide
            transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #b45309, #d97706)',
            boxShadow: '0 8px 32px rgba(180,83,9,0.4)',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          [ Activar Protocolo de Calorcito ]
        </button>
      </div>
    </div>
  );
}

function TerminalLine({ text, color = 'text-slate-400', delay, blink }) {
  const [visible, setVisible] = React.useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return <div className="h-5 mb-1.5" />;

  return (
    <div className={`text-sm mb-1.5 font-mono ${color} ${blink ? 'animate-pulse' : ''}`}
      style={{ animation: visible ? 'fade-in 0.4s ease forwards' : 'none' }}>
      {text}
    </div>
  );
}

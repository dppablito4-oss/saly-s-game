import { useState, useEffect, useRef } from 'react'
import Stage1_Rain from './components/Stage1_Rain'
import Stage2_Coffee from './components/Stage2_Coffee'
import Stage3_ControlPanel from './components/Stage3_ControlPanel'
import Stage4_Redemption from './components/Stage4_Redemption'

export default function App() {
  const [stage, setStage] = useState(1)
  const [isMuted, setIsMuted] = useState(true)
  const audioCtxRef = useRef(null)
  const noiseNodeRef = useRef(null)

  const startRainSound = () => {
    if (audioCtxRef.current) return;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;

    const gainNode = ctx.createGain();
    gainNode.gain.value = isMuted ? 0 : 0.05;
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    whiteNoise.start();
    noiseNodeRef.current = gainNode;
    setIsMuted(false);
  }

  useEffect(() => {
    if (noiseNodeRef.current) {
      noiseNodeRef.current.gain.setTargetAtTime(isMuted ? 0 : 0.05, audioCtxRef.current.currentTime, 0.1);
    }
  }, [isMuted]);

  const handleInteraction = () => {
    if (isMuted && !audioCtxRef.current) {
      startRainSound();
    }
  }

  return (
    <div className="min-h-screen relative" onClick={handleInteraction}>
      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
        className="fixed top-4 right-4 z-50 p-2 bg-slate-900/50 border border-slate-700 rounded-full text-white/50 hover:text-white transition-colors"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {stage === 1 && <Stage1_Rain onActivate={() => { startRainSound(); setStage(2); }} />}
      {stage === 2 && <Stage2_Coffee onNext={() => setStage(3)} />}
      {stage === 3 && <Stage3_ControlPanel onNext={() => setStage(4)} />}
      {stage === 4 && <Stage4_Redemption />}
    </div>
  )
}

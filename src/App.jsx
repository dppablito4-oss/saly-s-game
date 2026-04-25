import { useState } from 'react'
import Stage1_Rain from './components/Stage1_Rain'
import Stage2_Coffee from './components/Stage2_Coffee'
import Stage3_ControlPanel from './components/Stage3_ControlPanel'
import Stage4_Redemption from './components/Stage4_Redemption'

export default function App() {
  const [stage, setStage] = useState(1)
  const [isMuted, setIsMuted] = useState(true)
  const audioRef = useRef(null)

  const startMusic = () => {
    if (audioRef.current && isMuted) {
      audioRef.current.play().catch(e => console.log("Esperando interacción..."));
      setIsMuted(false);
    }
  }

  return (
    <div className="min-h-screen relative" onClick={startMusic}>
      {/* Background Music */}
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* Mute/Music Button */}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          if (audioRef.current.paused) {
            audioRef.current.play();
            setIsMuted(false);
          } else {
            audioRef.current.pause();
            setIsMuted(true);
          }
        }}
        className="fixed top-4 right-4 z-50 p-3 bg-black/40 border border-white/10 rounded-full text-white/70 hover:text-white hover:scale-110 transition-all backdrop-blur-md shadow-xl"
      >
        {isMuted ? '🔈' : '🎵'}
      </button>

      {stage === 1 && <Stage1_Rain onActivate={() => { startMusic(); setStage(2); }} />}
      {stage === 2 && <Stage2_Coffee onNext={() => setStage(3)} />}
      {stage === 3 && <Stage3_ControlPanel onNext={() => setStage(4)} />}
      {stage === 4 && <Stage4_Redemption />}
    </div>
  )
}

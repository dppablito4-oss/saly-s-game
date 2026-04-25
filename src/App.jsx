import { useState } from 'react'
import Stage1_Rain from './components/Stage1_Rain'
import Stage2_Coffee from './components/Stage2_Coffee'
import Stage3_ControlPanel from './components/Stage3_ControlPanel'
import Stage4_Redemption from './components/Stage4_Redemption'

export default function App() {
  const [stage, setStage] = useState(1)

  return (
    <div className="min-h-screen">
      {stage === 1 && <Stage1_Rain onActivate={() => setStage(2)} />}
      {stage === 2 && <Stage2_Coffee onNext={() => setStage(3)} />}
      {stage === 3 && <Stage3_ControlPanel onNext={() => setStage(4)} />}
      {stage === 4 && <Stage4_Redemption />}
    </div>
  )
}

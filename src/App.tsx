import { useState } from "react";
import Analytics from "./routes/analytics";
import Timer from "./components/Timer";
import Settings from "./routes/Settings";

function App() {
  const [workTime, setWorkTime] = useState<number>(1500); // 25 minutes 
  const [breakTime, setBreakTime] = useState<number>(300); // 5 minutes 
  const [completedSessions, setCompletedSessions] = useState<number>(0); 
  const [totalFocusTime, setTotalFocusTime] = useState<number>(0); 
  const [breakDuration, setBreakDuration]= useState<number>(0); 

  return (
    <div className="flex items-center justify-center bg-purple-900 h-screen">
      <div>
        <Timer />
        <Settings setWorkTime={setWorkTime} setBreakTime={setBreakTime} /> 
        <Analytics completedSessions={completedSessions} totalFocusTime={totalFocusTime} breakTime={breakDuration} /> </div>
    </div>
  )
}

export default App

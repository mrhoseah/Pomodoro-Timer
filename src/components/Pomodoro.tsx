import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faGear,faChartBar,faInfo } from '@fortawesome/free-solid-svg-icons'
import Timer from './Timer';

function Pomodoro() {
  return (
    <div className="space-y-4">
        <div className="flex justify-center items-center bg-white rounded-full h-48 w-48 sm:h-80 sm:w-80">
            <div className="text-5xl sm:text-7xl font-semibold" id="timer">25:00</div>
        </div>
        <div className="flex items-center gap-4">
            <button className="btn btn-success">Start</button>
            <button className="btn btn-warning">Pause</button>
            <button className="btn btn-primary">Resume</button>
            <button className="btn btn-danger">Reset</button>
        </div>
        <div className='flex gap-2 items-center'>
            <FontAwesomeIcon color='#ffffff' title='Settings' icon={faGear} />
            <FontAwesomeIcon color='#ffffff' title='Reports' icon={faChartBar} />
            <FontAwesomeIcon color='#ffffff' title='About' icon={faInfo} />
        </div>
        <Timer />
    </div>
  )
}

export default Pomodoro
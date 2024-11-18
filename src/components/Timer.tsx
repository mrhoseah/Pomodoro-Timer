import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { incrementCompletedSessions, incrementFocusTime, incrementBreakTime, incrementIncompleteSessions } from '@/features/analytics/analyticsSlice';
import CircularProgressBar from './CircularProgressBar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import '@/fontAwesome';
import { setBreakMinutes, setWorkMinutes } from '@/features/settings/settingsSlice';

const Timer: React.FC = () => {
  const dispatch = useDispatch();
  const workMinutes = useSelector((state: RootState) => state.settings.workMinutes);
  const breakMinutes = useSelector((state: RootState) => state.settings.breakMinutes);
  const [seconds, setSeconds] = useState<number>(workMinutes * 60); 
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    setSeconds(isBreak ? breakMinutes * 60 : workMinutes * 60);
  }, [workMinutes, breakMinutes, isBreak]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const tick = (prevSeconds: number): number => {
      if (prevSeconds <= 0) {
        if (isBreak) {
          setSeconds(workMinutes * 60); // Back to work session
        } else {
          setSeconds(breakMinutes * 60); // 5 minute break
          dispatch(incrementCompletedSessions());
        }
        setIsBreak(!isBreak);

        // Play beep sound
        const beep = new Audio('/beep.mp3');
        beep.play();
        return prevSeconds; // Return the current state to prevent setting negative seconds
      } else {
        if (!isBreak) {
          dispatch(incrementFocusTime(1 / 60));
        } else {
          dispatch(incrementBreakTime(1 / 60));
        }
        return prevSeconds - 1;
      }
    };

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(tick);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, isBreak, dispatch, workMinutes, breakMinutes]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progress = (seconds / (isBreak ? breakMinutes * 60 : workMinutes * 60)) * 100;

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    if (seconds > 0 && isActive) {
      dispatch(incrementIncompleteSessions());
    }
    setSeconds(isBreak ? breakMinutes * 60 : workMinutes * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const handleSave = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-white">{isBreak ? 'Break Time!' : 'Work Time!'}</h1>
      <CircularProgressBar size={200} progress={progress} strokeWidth={15}>
       <div className='text-white font-semibold'> {formatTime(seconds)}</div>
      </CircularProgressBar>
      <div className="mt-4">
        {!isActive && !isPaused && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2" onClick={handleStart}>
            Start
          </button>
        )}
        {isActive && !isPaused && (
          <button className="px-4 py-2 bg-yellow-500 text-white rounded mr-2" onClick={handlePause}>
            Pause
          </button>
        )}
        {isActive && isPaused && (
          <button className="px-4 py-2 bg-green-500 text-white rounded mr-2" onClick={handleResume}>
            Resume
          </button>
        )}
        <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={handleReset}>
          Reset
        </button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FontAwesomeIcon icon={faCog} className="mr-2" /> Edit Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Timer</DialogTitle>
            <DialogDescription>
              Make changes to your timer here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="work-minutes" className="text-right">
                Work Minutes
              </Label>
              <Input
                type="number"
                value={workMinutes}
                onChange={(e) => dispatch(setWorkMinutes(Number(e.target.value)))}
                id="work-minutes"
                className="col-span-3"
              />
            </div>
            <div>
              <Label htmlFor="break-minutes" className="text-right">
                Break Minutes
              </Label>
              <Input
                type="number"
                value={breakMinutes}
                onChange={(e) => dispatch(setBreakMinutes(Number(e.target.value)))}
                id="break-minutes"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className='bg-blue-600' onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timer;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { incrementCompletedSessions, incrementFocusTime, incrementBreakTime, incrementIncompleteSessions } from '@/features/analytics/analyticsSlice';
import useLocalStorage from '@/hooks/useLocalStorage';
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

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useLocalStorage<number>('timerSeconds', 1500); // 25 minutes
  const [isActive, setIsActive] = useLocalStorage<boolean>('timerIsActive', false);
  const [isPaused, setIsPaused] = useLocalStorage<boolean>('isPaused', false);
  const [isBreak, setIsBreak] = useLocalStorage<boolean>('isBreak', false);
  const [workMinutes, setWorkMinutes] = useLocalStorage<number>('workMinutes', 25);
  const [breakMinutes, setBreakMinutes] = useLocalStorage<number>('breakMinutes', 5);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setSeconds(prevSeconds - 1);
        if (!isBreak) dispatch(incrementFocusTime(1 / 60));
        else dispatch(incrementBreakTime(1 / 60));
      }, 1000);
    }

    if (seconds === 0) {
      if (isBreak) {
        setSeconds(1500); // Back to work session
      } else {
        setSeconds(300); // 5 minute break
        dispatch(incrementCompletedSessions());
      }
      setIsBreak(!isBreak);

      // Play beep sound
      const beep = new Audio('/beep.mp3');
      beep.play();
    }

    return () => clearInterval(interval!);
  }, [isActive, isPaused, seconds, isBreak, dispatch,setIsActive,setBreakMinutes,setIsBreak,setSeconds]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progress = (seconds / (isBreak ? 300 : 1500)) * 100;

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
    setSeconds(isBreak ? 300 : 1500);
    setIsActive(false);
    setIsPaused(false);
  };

  const handleSave = () => {
    setWorkMinutes(workMinutes);
    setBreakMinutes(breakMinutes);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold mb-4 text-white">{isBreak ? 'Break Time!' : 'Work Time!'}</h1>
      <CircularProgressBar size={200} progress={progress} strokeWidth={15}>
        <div className='font-semibold text-white'>{formatTime(seconds)}</div>
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
                onChange={(e) => setWorkMinutes(Number(e.target.value))}
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
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
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

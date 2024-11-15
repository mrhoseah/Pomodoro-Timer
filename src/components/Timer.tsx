import React, { useState, useEffect } from 'react';

const Timer: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(1500); // 25 minutes
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalFocusTime, setTotalFocusTime] = useState<number>(0);
  const [breakTime, setBreakTime] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
        if (!isBreak) {
          setTotalFocusTime((time) => time + 1);
        } else {
          setBreakTime((time) => time + 1);
        }
      }, 1000);
      if (seconds === 0) {
        if (isBreak) {
          setSeconds(1500); // Back to work session
        } else {
          setSeconds(300); // 5 minute break
          setCompletedSessions((sessions) => sessions + 1);
        }
        setIsBreak(!isBreak);
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds, isBreak]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <h1>{isBreak ? 'Break Time!' : 'Work Time!'}</h1>
      <h2>{formatTime(seconds)}</h2>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => setSeconds(isBreak ? 300 : 1500)}>Reset</button>
    </div>
  );
};

export default Timer;

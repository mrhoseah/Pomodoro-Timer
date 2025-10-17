import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/app/store';
import { incrementCompletedSessions, incrementFocusTime, incrementBreakTime, incrementIncompleteSessions } from '@/features/analytics/analyticsSlice';
import { completePomodoro, setCurrentTask } from '@/features/tasks/tasksSlice';
import { updateNotificationSettings } from '@/features/notifications/notificationsSlice';
import CircularProgressBar from './CircularProgressBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Settings, CheckCircle2, Coffee, Brain } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatTime, playNotificationSound, vibrateDevice } from '@/lib/utils';

const EnhancedTimer: React.FC = () => {
  const dispatch = useDispatch();
  const workMinutes = useSelector((state: RootState) => state.settings.workMinutes);
  const breakMinutes = useSelector((state: RootState) => state.settings.breakMinutes);
  const currentTask = useSelector((state: RootState) => state.tasks.tasks.find(t => t.id === state.tasks.currentTask));
  const notifications = useSelector((state: RootState) => state.notifications);
  const theme = useSelector((state: RootState) => state.theme);
  
  const [seconds, setSeconds] = useState<number>(workMinutes * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  // Update timer when settings change
  useEffect(() => {
    setSeconds(isBreak ? breakMinutes * 60 : workMinutes * 60);
  }, [workMinutes, breakMinutes, isBreak]);

  // Timer logic
  useEffect(() => {
    const tick = (prevSeconds: number): number => {
      if (prevSeconds <= 0) {
        handleSessionComplete();
        return prevSeconds;
      } else {
        // Update analytics every second
        if (!isBreak) {
          dispatch(incrementFocusTime(1 / 60));
        } else {
          dispatch(incrementBreakTime(1 / 60));
        }
        return prevSeconds - 1;
      }
    };

    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSeconds(tick);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, isBreak, dispatch, workMinutes, breakMinutes]);

  const handleSessionComplete = () => {
    // Play notification sound
    if (notifications.settings.sound && audioRef.current) {
      playNotificationSound(audioRef.current);
    }

    // Vibrate device
    if (notifications.settings.vibration) {
      vibrateDevice();
    }

    // Show desktop notification
    if (notifications.settings.desktop && notifications.permission === 'granted') {
      const notification = new Notification(
        isBreak ? 'Break Time!' : 'Work Session Complete!',
        {
          body: isBreak 
            ? 'Time to get back to work!' 
            : 'Great job! Time for a well-deserved break.',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
        }
      );
      
      setTimeout(() => notification.close(), 5000);
    }

    // Show toast notification
    toast.success(
      isBreak ? 'Break time is over! Back to work!' : 'Work session complete! Time for a break!',
      {
        duration: 4000,
        icon: isBreak ? <Brain className="w-5 h-5" /> : <Coffee className="w-5 h-5" />,
      }
    );

    // Update analytics and complete pomodoro
    if (!isBreak) {
      dispatch(incrementCompletedSessions(1));
      if (currentTask) {
        dispatch(completePomodoro(currentTask.id));
      }
      setSessionCount(prev => prev + 1);
    }

    // Switch to next session
    setIsBreak(!isBreak);
    setSeconds(isBreak ? workMinutes * 60 : breakMinutes * 60);
    setIsActive(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const progress = (seconds / (isBreak ? breakMinutes * 60 : workMinutes * 60)) * 100;

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    
    // Request notification permission if needed
    if (notifications.permission === 'default' && notifications.settings.desktop) {
      dispatch(updateNotificationSettings({ desktop: false }));
      toast('Enable notifications in settings for session alerts', { icon: '🔔' });
    }
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
    setSessionCount(0);
  };

  const getThemeColors = () => {
    const colorSchemes = {
      blue: { 
        primary: 'bg-blue-500', 
        secondary: 'bg-blue-600', 
        accent: 'text-blue-400',
        card: 'bg-blue-500/10 border-blue-500/20',
        ring: 'ring-blue-500'
      },
      purple: { 
        primary: 'bg-purple-500', 
        secondary: 'bg-purple-600', 
        accent: 'text-purple-400',
        card: 'bg-purple-500/10 border-purple-500/20',
        ring: 'ring-purple-500'
      },
      green: { 
        primary: 'bg-green-500', 
        secondary: 'bg-green-600', 
        accent: 'text-green-400',
        card: 'bg-green-500/10 border-green-500/20',
        ring: 'ring-green-500'
      },
      orange: { 
        primary: 'bg-orange-500', 
        secondary: 'bg-orange-600', 
        accent: 'text-orange-400',
        card: 'bg-orange-500/10 border-orange-500/20',
        ring: 'ring-orange-500'
      },
      red: { 
        primary: 'bg-red-500', 
        secondary: 'bg-red-600', 
        accent: 'text-red-400',
        card: 'bg-red-500/10 border-red-500/20',
        ring: 'ring-red-500'
      },
    };
    return colorSchemes[theme.colorScheme];
  };

  const colors = getThemeColors();

  return (
    <div className="flex flex-col items-center space-y-6">
      <Helmet>
        <title>{isBreak ? 'Break Time - Pomodoro Pro' : 'Work Time - Pomodoro Pro'}</title>
        <meta name="description" content="Stay focused with our next-gen Pomodoro timer" />
      </Helmet>

      {/* Current Task Display */}
      {currentTask && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className={`${colors.card} backdrop-blur-md border shadow-lg`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white truncate">{currentTask.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                      {currentTask.completedPomodoros}/{currentTask.pomodoros} pomodoros
                    </Badge>
                    <Badge 
                      variant={currentTask.priority === 'high' ? 'destructive' : 
                              currentTask.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {currentTask.priority}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(setCurrentTask(undefined))}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Timer Display */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <CircularProgressBar size={300} progress={progress} strokeWidth={20}>
          <div className="text-center">
            <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              {formatTime(seconds)}
            </div>
            <div className="text-xl text-white/90 font-medium">
              {isBreak ? 'Break Time' : 'Focus Time'}
            </div>
            {sessionCount > 0 && (
              <div className={`text-sm ${colors.accent} mt-2 font-medium`}>
                Session {sessionCount}
              </div>
            )}
          </div>
        </CircularProgressBar>
      </motion.div>

      {/* Control Buttons */}
      <motion.div 
        className="flex space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {!isActive && !isPaused && (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                size="lg"
                className={`${colors.primary} hover:${colors.secondary} text-white px-8 py-3 rounded-full`}
                onClick={handleStart}
              >
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            </motion.div>
          )}
          
          {isActive && !isPaused && (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-full"
                onClick={handlePause}
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            </motion.div>
          )}
          
          {isActive && isPaused && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                size="lg"
                className={`${colors.primary} hover:${colors.secondary} text-white px-8 py-3 rounded-full`}
                onClick={handleResume}
              >
                <Play className="w-5 h-5 mr-2" />
                Resume
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="lg"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full"
          onClick={handleReset}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`flex space-x-6 ${colors.card} backdrop-blur-md rounded-xl p-4 shadow-lg`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{workMinutes}m</div>
          <div className="text-xs text-white/70">Work</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{breakMinutes}m</div>
          <div className="text-xs text-white/70">Break</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{sessionCount}</div>
          <div className="text-xs text-white/70">Sessions</div>
        </div>
      </motion.div>
    </div>
  );
};

export default EnhancedTimer;

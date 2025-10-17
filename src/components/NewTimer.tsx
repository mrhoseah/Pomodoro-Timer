import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/app/store';
import { incrementCompletedSessions, incrementFocusTime, incrementBreakTime, incrementIncompleteSessions } from '@/features/analytics/analyticsSlice';
import { Play, Pause, Square, RotateCcw, Coffee, Brain, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  sessionCount: number;
  totalSessions: number;
}

const NewTimer: React.FC = () => {
  const dispatch = useDispatch();
  const workMinutes = useSelector((state: RootState) => state.settings.workMinutes);
  const breakMinutes = useSelector((state: RootState) => state.settings.breakMinutes);
  const { colorScheme } = useSelector((state: RootState) => state.theme);
  
  const [timer, setTimer] = useState<TimerState>({
    timeLeft: workMinutes * 60,
    isRunning: false,
    isPaused: false,
    isBreak: false,
    sessionCount: 0,
    totalSessions: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Color schemes
  const getColors = () => {
    const schemes = {
      blue: {
        primary: 'from-blue-500 to-blue-700',
        secondary: 'from-blue-400 to-blue-600',
        accent: 'text-blue-300',
        ring: 'ring-blue-500',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
      },
      purple: {
        primary: 'from-purple-500 to-purple-700',
        secondary: 'from-purple-400 to-purple-600',
        accent: 'text-purple-300',
        ring: 'ring-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
      },
      green: {
        primary: 'from-green-500 to-green-700',
        secondary: 'from-green-400 to-green-600',
        accent: 'text-green-300',
        ring: 'ring-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
      },
      orange: {
        primary: 'from-orange-500 to-orange-700',
        secondary: 'from-orange-400 to-orange-600',
        accent: 'text-orange-300',
        ring: 'ring-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
      },
      red: {
        primary: 'from-red-500 to-red-700',
        secondary: 'from-red-400 to-red-600',
        accent: 'text-red-300',
        ring: 'ring-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
      },
    };
    return schemes[colorScheme as keyof typeof schemes] || schemes.purple;
  };

  const colors = getColors();

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/sounds/notification.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  // Timer logic
  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.timeLeft <= 0) {
            handleSessionComplete();
            return prev;
          }
          
          // Update analytics
          if (!prev.isBreak) {
            dispatch(incrementFocusTime(1 / 60));
          } else {
            dispatch(incrementBreakTime(1 / 60));
          }
          
          return {
            ...prev,
            timeLeft: prev.timeLeft - 1,
          };
        });
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
  }, [timer.isRunning, timer.isPaused, dispatch]);

  const handleSessionComplete = () => {
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Show notification
    toast.success(
      timer.isBreak ? 'Break time is over! Back to work!' : 'Work session complete! Time for a break!',
      {
        duration: 4000,
        icon: timer.isBreak ? <Brain className="w-5 h-5" /> : <Coffee className="w-5 h-5" />,
      }
    );

    // Update analytics
    if (!timer.isBreak) {
      dispatch(incrementCompletedSessions(1));
    }

    // Switch to next session
    setTimer(prev => ({
      ...prev,
      isBreak: !prev.isBreak,
      timeLeft: !prev.isBreak ? breakMinutes * 60 : workMinutes * 60,
      isRunning: false,
      isPaused: false,
      sessionCount: !prev.isBreak ? prev.sessionCount + 1 : prev.sessionCount,
      totalSessions: prev.totalSessions + 1,
    }));
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timer.timeLeft / (timer.isBreak ? breakMinutes * 60 : workMinutes * 60)) * 100;

  const startTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: true, isPaused: false }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isPaused: true }));
  };

  const resumeTimer = () => {
    setTimer(prev => ({ ...prev, isPaused: false }));
  };

  const resetTimer = () => {
    if (timer.isRunning) {
      dispatch(incrementIncompleteSessions());
    }
    setTimer(prev => ({
      ...prev,
      timeLeft: prev.isBreak ? breakMinutes * 60 : workMinutes * 60,
      isRunning: false,
      isPaused: false,
    }));
  };

  const stopTimer = () => {
    if (timer.isRunning) {
      dispatch(incrementIncompleteSessions());
    }
    setTimer(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      sessionCount: 0,
      totalSessions: 0,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            {timer.isBreak ? 'Break Time' : 'Focus Time'}
          </h1>
          <p className="text-gray-400">
            {timer.isBreak ? 'Take a well-deserved break!' : 'Stay focused and productive!'}
          </p>
        </motion.div>

        {/* Timer Circle */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="relative w-80 h-80 mx-auto">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke={`url(#gradient-${colorScheme})`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100) }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id={`gradient-${colorScheme}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colorScheme === 'blue' ? '#3B82F6' : colorScheme === 'purple' ? '#8B5CF6' : colorScheme === 'green' ? '#10B981' : colorScheme === 'orange' ? '#F59E0B' : '#EF4444'} />
                  <stop offset="100%" stopColor={colorScheme === 'blue' ? '#1D4ED8' : colorScheme === 'purple' ? '#7C3AED' : colorScheme === 'green' ? '#059669' : colorScheme === 'orange' ? '#D97706' : '#DC2626'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Time Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  key={timer.timeLeft}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold text-white mb-2"
                >
                  {formatTime(timer.timeLeft)}
                </motion.div>
                <div className={`text-lg ${colors.accent} font-medium`}>
                  {timer.isBreak ? 'Break' : 'Focus'}
                </div>
                {timer.sessionCount > 0 && (
                  <div className="text-sm text-gray-400 mt-2">
                    Session {timer.sessionCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4 mb-8"
        >
          <AnimatePresence mode="wait">
            {!timer.isRunning && !timer.isPaused && (
              <motion.button
                key="start"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={startTimer}
                className={`px-8 py-4 bg-gradient-to-r ${colors.primary} text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
              >
                <Play className="w-5 h-5" />
                <span>Start</span>
              </motion.button>
            )}
            
            {timer.isRunning && !timer.isPaused && (
              <motion.button
                key="pause"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={pauseTimer}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </motion.button>
            )}
            
            {timer.isRunning && timer.isPaused && (
              <motion.button
                key="resume"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={resumeTimer}
                className={`px-8 py-4 bg-gradient-to-r ${colors.primary} text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
              >
                <Play className="w-5 h-5" />
                <span>Resume</span>
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={resetTimer}
            className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>

          <button
            onClick={stopTimer}
            className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
          >
            <Square className="w-5 h-5" />
            <span>Stop</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${colors.bg} ${colors.border} backdrop-blur-sm rounded-2xl p-6 border`}
        >
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{workMinutes}m</div>
              <div className="text-sm text-gray-400">Work</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{breakMinutes}m</div>
              <div className="text-sm text-gray-400">Break</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{timer.totalSessions}</div>
              <div className="text-sm text-gray-400">Sessions</div>
            </div>
          </div>
        </motion.div>

        {/* Status Indicator */}
        {timer.isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center mt-6 space-x-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-3 h-3 rounded-full ${colors.primary.replace('from-', 'bg-').replace(' to-', '')}`}
            />
            <span className="text-sm text-gray-400">
              {timer.isPaused ? 'Paused' : 'Running'}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewTimer;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/app/store';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Coffee, 
  TrendingUp, 
  Target,
  Calendar,
  Zap,
  Activity,
  Award,
  Timer,
  Pause
} from 'lucide-react';

const NewAnalytics: React.FC = () => {
  const { completedSessions, totalFocusTime, breakTime, incompleteSessions } = useSelector((state: RootState) => state.analytics);
  const { colorScheme } = useSelector((state: RootState) => state.theme);
  const { workMinutes, breakMinutes } = useSelector((state: RootState) => state.settings);
  
  const [timeRange, setTimeRange] = useState('week');
  const [showDetails, setShowDetails] = useState(false);

  const getColors = () => {
    const schemes = {
      blue: {
        primary: 'from-blue-500 to-blue-700',
        secondary: 'from-blue-400 to-blue-600',
        accent: 'text-blue-300',
        card: 'bg-blue-500/10 border-blue-500/20',
        button: 'bg-blue-500 hover:bg-blue-600',
      },
      purple: {
        primary: 'from-purple-500 to-purple-700',
        secondary: 'from-purple-400 to-purple-600',
        accent: 'text-purple-300',
        card: 'bg-purple-500/10 border-purple-500/20',
        button: 'bg-purple-500 hover:bg-purple-600',
      },
      green: {
        primary: 'from-green-500 to-green-700',
        secondary: 'from-green-400 to-green-600',
        accent: 'text-green-300',
        card: 'bg-green-500/10 border-green-500/20',
        button: 'bg-green-500 hover:bg-green-600',
      },
      orange: {
        primary: 'from-orange-500 to-orange-700',
        secondary: 'from-orange-400 to-orange-600',
        accent: 'text-orange-300',
        card: 'bg-orange-500/10 border-orange-500/20',
        button: 'bg-orange-500 hover:bg-orange-600',
      },
      red: {
        primary: 'from-red-500 to-red-700',
        secondary: 'from-red-400 to-red-600',
        accent: 'text-red-300',
        card: 'bg-red-500/10 border-red-500/20',
        button: 'bg-red-500 hover:bg-red-600',
      },
    };
    return schemes[colorScheme as keyof typeof schemes] || schemes.purple;
  };

  const colors = getColors();

  const performancePercentage = (completedSessions + incompleteSessions) === 0 
    ? 0 
    : Math.round((completedSessions / (completedSessions + incompleteSessions)) * 100);

  const totalSessions = completedSessions + incompleteSessions;
  const totalTime = totalFocusTime + breakTime;
  const averageSessionLength = completedSessions > 0 ? totalFocusTime / completedSessions : 0;
  const productivityScore = Math.round((performancePercentage + (totalFocusTime / 60) * 2) / 3);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProductivityLevel = (score: number): { level: string; color: string; icon: React.ComponentType<any> } => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-400', icon: Award };
    if (score >= 60) return { level: 'Good', color: 'text-blue-400', icon: TrendingUp };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-400', icon: Activity };
    return { level: 'Needs Improvement', color: 'text-red-400', icon: Target };
  };

  const productivityLevel = getProductivityLevel(productivityScore);
  const ProductivityIcon = productivityLevel.icon;

  const stats = [
    {
      title: 'Completed Sessions',
      value: completedSessions,
      icon: CheckCircle2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      description: 'Work sessions finished',
      trend: '+12% this week'
    },
    {
      title: 'Focus Time',
      value: formatTime(totalFocusTime),
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      description: 'Total productive time',
      trend: '+8% this week'
    },
    {
      title: 'Break Time',
      value: formatTime(breakTime),
      icon: Coffee,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      description: 'Total rest time',
      trend: '+5% this week'
    },
    {
      title: 'Incomplete Sessions',
      value: incompleteSessions,
      icon: Pause,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      description: 'Interrupted sessions',
      trend: '-3% this week'
    },
    {
      title: 'Performance Rate',
      value: `${performancePercentage}%`,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      description: 'Completion percentage',
      trend: '+15% this week'
    },
    {
      title: 'Productivity Score',
      value: productivityScore,
      icon: Zap,
      color: productivityLevel.color,
      bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
      description: productivityLevel.level,
      trend: '+10% this week'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your productivity and focus patterns</p>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-1 border`}>
            {['day', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize ${
                  timeRange === range
                    ? 'bg-white text-gray-900 font-semibold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border hover:shadow-lg transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.trend}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{stat.title}</h3>
                  <p className="text-gray-400 text-sm">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Productivity Overview */}
          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Productivity Overview
              </h2>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${productivityLevel.bgColor}`}>
                <ProductivityIcon className={`w-4 h-4 ${productivityLevel.color}`} />
                <span className={`text-sm font-medium ${productivityLevel.color}`}>
                  {productivityLevel.level}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Score</span>
                <span className="text-white font-semibold">{productivityScore}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${productivityScore}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{performancePercentage}%</div>
                  <div className="text-sm text-gray-400">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{formatTime(averageSessionLength)}</div>
                  <div className="text-sm text-gray-400">Avg Session</div>
                </div>
              </div>
            </div>
          </div>

          {/* Session Breakdown */}
          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Session Breakdown
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Work Sessions</span>
                <span className="text-white font-semibold">{completedSessions}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Incomplete Sessions</span>
                <span className="text-white font-semibold">{incompleteSessions}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalSessions > 0 ? (incompleteSessions / totalSessions) * 100 : 0}%` }}
                />
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Sessions</span>
                  <span className="text-white font-semibold">{totalSessions}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Time Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Time Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Timer className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{formatTime(totalFocusTime)}</div>
              <div className="text-gray-400 text-sm">Total Focus Time</div>
              <div className="text-xs text-gray-500 mt-1">
                {workMinutes}min per session
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{formatTime(breakTime)}</div>
              <div className="text-gray-400 text-sm">Total Break Time</div>
              <div className="text-xs text-gray-500 mt-1">
                {breakMinutes}min per break
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{formatTime(totalTime)}</div>
              <div className="text-gray-400 text-sm">Total Time</div>
              <div className="text-xs text-gray-500 mt-1">
                Focus + Break
              </div>
            </div>
          </div>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Insights & Recommendations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performancePercentage >= 80 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Excellent Performance!</span>
                </div>
                <p className="text-green-300 text-sm">
                  You're maintaining a great completion rate. Keep up the excellent work!
                </p>
              </div>
            )}
            
            {performancePercentage < 50 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">Focus on Completion</span>
                </div>
                <p className="text-yellow-300 text-sm">
                  Try to complete more sessions. Consider shorter work periods to build momentum.
                </p>
              </div>
            )}
            
            {incompleteSessions > completedSessions && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Pause className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Reduce Interruptions</span>
                </div>
                <p className="text-red-300 text-sm">
                  You're interrupting sessions frequently. Try to minimize distractions during work time.
                </p>
              </div>
            )}
            
            {totalFocusTime > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Consistent Progress</span>
                </div>
                <p className="text-blue-300 text-sm">
                  You've logged {formatTime(totalFocusTime)} of focused work time. Great consistency!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewAnalytics;

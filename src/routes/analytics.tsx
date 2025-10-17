import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/app/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const Analytics: React.FC = () => {
  const completedSessions = useSelector((state: RootState) => state.analytics.completedSessions);
  const totalFocusTime = useSelector((state: RootState) => state.analytics.totalFocusTime);
  const breakTime = useSelector((state: RootState) => state.analytics.breakTime);
  const incompleteSessions = useSelector((state: RootState) => state.analytics.incompleteSessions);

const performancePercentage = (completedSessions + incompleteSessions) === 0 ?
 0 : ((completedSessions / (completedSessions + incompleteSessions)) * 100).toFixed();
;  // Helper function to format time in a human-readable way

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-white/70">Track your productivity and focus patterns</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-green-400 text-xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Completed Sessions</h3>
              <p className="text-white/60 text-sm">Work sessions finished</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{completedSessions}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="text-blue-400 text-xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Focus Time</h3>
              <p className="text-white/60 text-sm">Total productive time</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{Math.round(totalFocusTime)}m</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartPie} className="text-purple-400 text-xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Break Time</h3>
              <p className="text-white/60 text-sm">Total rest time</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{Math.round(breakTime)}m</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartBar} className="text-red-400 text-xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Incomplete</h3>
              <p className="text-white/60 text-sm">Interrupted sessions</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{incompleteSessions}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-md border-white/20 rounded-xl p-6 shadow-lg md:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartPie} className="text-orange-400 text-xl" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Performance</h3>
              <p className="text-white/60 text-sm">Completion rate</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{Number(performancePercentage)}%</div>
          <div className="mt-2 bg-white/20 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Number(performancePercentage)}%` }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;

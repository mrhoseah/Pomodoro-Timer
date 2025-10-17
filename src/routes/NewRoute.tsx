import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import NewLayout from '../components/NewLayout';
import NewTimer from '../components/NewTimer';
import NewTaskManager from '../components/NewTaskManager';
import NewAnalytics from '../components/NewAnalytics';
import NewSettings from '../components/NewSettings';

export default function NewRoute() {
  const [currentPage, setCurrentPage] = useState('timer');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'timer':
        return <NewTimer />;
      case 'tasks':
        return <NewTaskManager />;
      case 'analytics':
        return <NewAnalytics />;
      case 'settings':
        return <NewSettings />;
      default:
        return <NewTimer />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Pomodoro Pro</h2>
          <p className="text-gray-400">Loading your productivity dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <NewLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </NewLayout>
  );
}

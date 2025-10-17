import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import EnhancedTimer from '../components/EnhancedTimer';
import TaskManager from '../components/TaskManager';
import Analytics from './analytics';
import Settings from './Settings';

export default function Root() {
  const [currentPage, setCurrentPage] = useState('timer');

  const renderPage = () => {
    switch (currentPage) {
      case 'timer':
        return <EnhancedTimer />;
      case 'tasks':
        return <TaskManager />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <EnhancedTimer />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

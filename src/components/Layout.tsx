import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/app/store';
import { setSystemTheme } from '@/features/theme/themeSlice';
import { requestPermission } from '@/features/notifications/notificationsSlice';
import { Toaster } from 'react-hot-toast';
import { Moon, Sun, Download, Settings, BarChart3, CheckSquare, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const dispatch = useDispatch();
  const { theme, colorScheme } = useSelector((state: RootState) => state.theme);
  const { permission } = useSelector((state: RootState) => state.notifications);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(setSystemTheme(e.matches ? 'dark' : 'light'));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  // Request notification permission on mount
  useEffect(() => {
    if (permission === 'default') {
      dispatch(requestPermission());
    }
  }, [dispatch, permission]);

  const getThemeClass = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const isDark = getThemeClass() === 'dark';
  
  const getColorSchemeClasses = () => {
    const schemes = {
      blue: {
        primary: 'from-blue-600 to-blue-800',
        secondary: 'from-blue-500 to-blue-700',
        accent: 'text-blue-400',
        card: 'bg-blue-500/10 border-blue-500/20',
        button: 'bg-blue-500 hover:bg-blue-600',
      },
      purple: {
        primary: 'from-purple-600 to-purple-800',
        secondary: 'from-purple-500 to-purple-700',
        accent: 'text-purple-400',
        card: 'bg-purple-500/10 border-purple-500/20',
        button: 'bg-purple-500 hover:bg-purple-600',
      },
      green: {
        primary: 'from-green-600 to-green-800',
        secondary: 'from-green-500 to-green-700',
        accent: 'text-green-400',
        card: 'bg-green-500/10 border-green-500/20',
        button: 'bg-green-500 hover:bg-green-600',
      },
      orange: {
        primary: 'from-orange-600 to-orange-800',
        secondary: 'from-orange-500 to-orange-700',
        accent: 'text-orange-400',
        card: 'bg-orange-500/10 border-orange-500/20',
        button: 'bg-orange-500 hover:bg-orange-600',
      },
      red: {
        primary: 'from-red-600 to-red-800',
        secondary: 'from-red-500 to-red-700',
        accent: 'text-red-400',
        card: 'bg-red-500/10 border-red-500/20',
        button: 'bg-red-500 hover:bg-red-600',
      },
    };
    return schemes[colorScheme as keyof typeof schemes] || schemes.purple;
  };

  const colors = getColorSchemeClasses();

  const pages = [
    { id: 'timer', label: 'Timer', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleInstallPWA = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      } catch (error) {
        console.error('PWA installation failed:', error);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? `bg-gradient-to-br ${colors.primary} via-gray-900 to-gray-800` 
        : `bg-gradient-to-br ${colors.primary} via-blue-50 to-purple-50`
    }`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className={`w-12 h-12 rounded-xl ${colors.button} shadow-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Pomodoro Pro</h1>
                  <p className={`${colors.accent} text-sm font-medium`}>Next-Gen Productivity</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-3">
              {/* PWA Install Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallPWA}
                className="text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>

              {/* Notification Status */}
              {permission === 'granted' && (
                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 backdrop-blur-sm">
                  Notifications On
                </Badge>
              )}
            </div>
          </div>
        </motion.header>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className={`flex space-x-1 ${colors.card} backdrop-blur-md rounded-xl p-1 shadow-lg`}>
            {pages.map((page) => {
              const Icon = page.icon;
              const isActive = currentPage === page.id;
              
              return (
                <motion.button
                  key={page.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPageChange(page.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-lg font-semibold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{page.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="min-h-[calc(100vh-200px)]"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center text-white/60 text-sm"
        >
          <p>&copy; 2024 Pomodoro Pro - Built with React & TypeScript</p>
        </motion.footer>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: isDark ? '#1f2937' : '#ffffff',
            color: isDark ? '#ffffff' : '#000000',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
          },
        }}
      />
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/app/store';
import { setSystemTheme } from '@/features/theme/themeSlice';
import { requestPermission } from '@/features/notifications/notificationsSlice';
import { 
  Home, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Download, 
  Bell,
  Sun,
  Moon,
  Monitor,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NewLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const NewLayout: React.FC<NewLayoutProps> = ({ children, currentPage, onPageChange }) => {
  const dispatch = useDispatch();
  const { theme, colorScheme } = useSelector((state: RootState) => state.theme);
  const { permission } = useSelector((state: RootState) => state.notifications);

  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

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

  // PWA installation
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      toast.success('App installed successfully!', {
        icon: <Download className="w-5 h-5" />,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const getThemeClass = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const isDark = getThemeClass() === 'dark';

  const getColorClasses = () => {
    const schemes = {
      blue: {
        primary: 'from-blue-600 to-blue-800',
        secondary: 'from-blue-500 to-blue-700',
        accent: 'text-blue-300',
        card: 'bg-blue-500/10 border-blue-500/20',
        button: 'bg-blue-500 hover:bg-blue-600',
      },
      purple: {
        primary: 'from-purple-600 to-purple-800',
        secondary: 'from-purple-500 to-purple-700',
        accent: 'text-purple-300',
        card: 'bg-purple-500/10 border-purple-500/20',
        button: 'bg-purple-500 hover:bg-purple-600',
      },
      green: {
        primary: 'from-green-600 to-green-800',
        secondary: 'from-green-500 to-green-700',
        accent: 'text-green-300',
        card: 'bg-green-500/10 border-green-500/20',
        button: 'bg-green-500 hover:bg-green-600',
      },
      orange: {
        primary: 'from-orange-600 to-orange-800',
        secondary: 'from-orange-500 to-orange-700',
        accent: 'text-orange-300',
        card: 'bg-orange-500/10 border-orange-500/20',
        button: 'bg-orange-500 hover:bg-orange-600',
      },
      red: {
        primary: 'from-red-600 to-red-800',
        secondary: 'from-red-500 to-red-700',
        accent: 'text-red-300',
        card: 'bg-red-500/10 border-red-500/20',
        button: 'bg-red-500 hover:bg-red-600',
      },
    };
    return schemes[colorScheme as keyof typeof schemes] || schemes.purple;
  };

  const colors = getColorClasses();

  const pages = [
    { id: 'timer', label: 'Timer', icon: Home, description: 'Focus and productivity' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, description: 'Manage your work' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Track progress' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Customize app' },
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? `bg-gradient-to-br ${colors.primary} via-gray-900 to-gray-800` 
        : `bg-gradient-to-br ${colors.primary} via-blue-50 to-purple-50`
    }`}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className={`w-12 h-12 rounded-xl ${colors.button} shadow-lg flex items-center justify-center`}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Pomodoro Pro</h1>
                  <p className={`${colors.accent} text-sm font-medium`}>Next-Gen Productivity</p>
                </div>
              </motion.div>

              {/* Right side */}
              <div className="flex items-center space-x-3">
                {/* Theme indicator */}
                <div className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg">
                  {theme === 'light' && <Sun className="w-4 h-4 text-yellow-400" />}
                  {theme === 'dark' && <Moon className="w-4 h-4 text-blue-400" />}
                  {theme === 'system' && <Monitor className="w-4 h-4 text-gray-400" />}
                  <span className="text-white text-sm font-medium capitalize">{theme}</span>
                </div>

                {/* Notification status */}
                {permission === 'granted' && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
                    <Bell className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">Notifications On</span>
                  </div>
                )}

                {/* PWA Install Button */}
                {deferredPrompt && !isInstalled && (
                  <button
                    onClick={handleInstallPWA}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-16 z-40 backdrop-blur-md bg-black/10 border-b border-white/5"
        >
          <div className="container mx-auto px-4 py-3">
            <div className={`flex space-x-1 ${colors.card} backdrop-blur-md rounded-xl p-1 shadow-lg border`}>
              {pages.map((page) => {
                const Icon = page.icon;
                const isActive = currentPage === page.id;
                
                return (
                  <motion.button
                    key={page.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onPageChange(page.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 flex-1 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-lg font-semibold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{page.label}</div>
                      <div className="text-xs opacity-75">{page.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          {children}
        </motion.main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-md bg-black/20 border-t border-white/10 py-6"
        >
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/60 text-sm">
              &copy; 2024 Pomodoro Pro - Built with React & TypeScript
            </p>
            <p className="text-white/40 text-xs mt-1">
              Version 2.0.0 • PWA Enabled • Offline Support
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default NewLayout;

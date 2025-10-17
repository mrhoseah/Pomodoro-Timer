import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/app/store';
import { setWorkMinutes, setBreakMinutes } from '@/features/settings/settingsSlice';
import { setTheme, setColorScheme } from '@/features/theme/themeSlice';
import { updateNotificationSettings, requestPermission } from '@/features/notifications/notificationsSlice';
import { 
  Settings, 
  Clock, 
  Palette, 
  Bell, 
  Volume2, 
  Vibrate, 
  Monitor, 
  Sun, 
  Moon, 
  Smartphone,
  Save,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const NewSettings: React.FC = () => {
  const dispatch = useDispatch();
  const workMinutes = useSelector((state: RootState) => state.settings.workMinutes);
  const breakMinutes = useSelector((state: RootState) => state.settings.breakMinutes);
  const { theme, colorScheme } = useSelector((state: RootState) => state.theme);
  const { settings, permission } = useSelector((state: RootState) => state.notifications);

  const [activeTab, setActiveTab] = useState('timer');
  const [hasChanges, setHasChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState({
    workMinutes: workMinutes,
    breakMinutes: breakMinutes,
    theme: theme,
    colorScheme: colorScheme,
    notifications: settings,
  });

  const tabs: SettingsTab[] = [
    {
      id: 'timer',
      label: 'Timer',
      icon: Clock,
      description: 'Configure work and break durations'
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      description: 'Customize themes and colors'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Manage alerts and sounds'
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: Settings,
      description: 'Advanced settings and data'
    }
  ];

  // Check for changes
  useEffect(() => {
    const hasLocalChanges = 
      localSettings.workMinutes !== workMinutes ||
      localSettings.breakMinutes !== breakMinutes ||
      localSettings.theme !== theme ||
      localSettings.colorScheme !== colorScheme ||
      JSON.stringify(localSettings.notifications) !== JSON.stringify(settings);
    
    setHasChanges(hasLocalChanges);
  }, [localSettings, workMinutes, breakMinutes, theme, colorScheme, settings]);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoro-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setLocalSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const handleWorkMinutesChange = (value: number) => {
    const clampedValue = Math.max(1, Math.min(60, value));
    setLocalSettings(prev => ({ ...prev, workMinutes: clampedValue }));
  };

  const handleBreakMinutesChange = (value: number) => {
    const clampedValue = Math.max(1, Math.min(30, value));
    setLocalSettings(prev => ({ ...prev, breakMinutes: clampedValue }));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setLocalSettings(prev => ({ ...prev, theme: newTheme }));
  };

  const handleColorSchemeChange = (newScheme: string) => {
    setLocalSettings(prev => ({ ...prev, colorScheme: newScheme }));
  };

  const handleNotificationChange = (key: keyof typeof settings, value: boolean) => {
    setLocalSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const saveSettings = () => {
    // Save to Redux
    dispatch(setWorkMinutes(localSettings.workMinutes));
    dispatch(setBreakMinutes(localSettings.breakMinutes));
    dispatch(setTheme(localSettings.theme as any));
    dispatch(setColorScheme(localSettings.colorScheme as any));
    dispatch(updateNotificationSettings(localSettings.notifications));

    // Save to localStorage
    const settingsToSave = {
      workMinutes: localSettings.workMinutes,
      breakMinutes: localSettings.breakMinutes,
      theme: localSettings.theme,
      colorScheme: localSettings.colorScheme,
      notifications: localSettings.notifications,
    };
    
    localStorage.setItem('pomodoro-settings', JSON.stringify(settingsToSave));
    
    setHasChanges(false);
    toast.success('Settings saved successfully!', {
      icon: <CheckCircle className="w-5 h-5" />,
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      workMinutes: 25,
      breakMinutes: 5,
      theme: 'system' as const,
      colorScheme: 'purple' as const,
      notifications: {
        enabled: true,
        sound: true,
        vibration: true,
        desktop: true,
        workComplete: true,
        breakComplete: true,
        sessionStart: false,
      },
    };
    
    setLocalSettings(defaultSettings);
    toast.success('Settings reset to defaults!', {
      icon: <RotateCcw className="w-5 h-5" />,
    });
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!', {
          icon: <Bell className="w-5 h-5" />,
        });
      } else {
        toast.error('Notification permission denied', {
          icon: <AlertCircle className="w-5 h-5" />,
        });
      }
    } catch (error) {
      toast.error('Failed to request notification permission', {
        icon: <AlertCircle className="w-5 h-5" />,
      });
    }
  };

  const getColorClasses = (scheme: string) => {
    const schemes = {
      blue: 'from-blue-500 to-blue-700',
      purple: 'from-purple-500 to-purple-700',
      green: 'from-green-500 to-green-700',
      orange: 'from-orange-500 to-orange-700',
      red: 'from-red-500 to-red-700',
    };
    return schemes[scheme as keyof typeof schemes] || schemes.purple;
  };

  const colorOptions = [
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your Pomodoro experience</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">{tab.label}</div>
                        <div className="text-xs opacity-75">{tab.description}</div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <AnimatePresence mode="wait">
                {activeTab === 'timer' && (
                  <motion.div
                    key="timer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Clock className="w-6 h-6 mr-3" />
                        Timer Settings
                      </h2>
                      <p className="text-gray-400 mb-6">Configure your work and break durations</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-white font-medium">Work Duration (minutes)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={localSettings.workMinutes}
                            onChange={(e) => handleWorkMinutesChange(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            min
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">Recommended: 25 minutes</p>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-white font-medium">Break Duration (minutes)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={localSettings.breakMinutes}
                            onChange={(e) => handleBreakMinutesChange(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            min
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">Recommended: 5 minutes</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div
                    key="appearance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Palette className="w-6 h-6 mr-3" />
                        Appearance
                      </h2>
                      <p className="text-gray-400 mb-6">Customize themes and color schemes</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-white font-medium mb-4">Theme</label>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { value: 'light', label: 'Light', icon: Sun },
                            { value: 'dark', label: 'Dark', icon: Moon },
                            { value: 'system', label: 'System', icon: Monitor },
                          ].map((themeOption) => {
                            const Icon = themeOption.icon;
                            return (
                              <button
                                key={themeOption.value}
                                onClick={() => handleThemeChange(themeOption.value as any)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                  localSettings.theme === themeOption.value
                                    ? 'border-purple-500 bg-purple-500/20'
                                    : 'border-gray-600 hover:border-gray-500'
                                }`}
                              >
                                <Icon className="w-6 h-6 mx-auto mb-2 text-white" />
                                <div className="text-white font-medium">{themeOption.label}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-4">Color Scheme</label>
                        <div className="grid grid-cols-5 gap-4">
                          {colorOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleColorSchemeChange(option.value)}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                localSettings.colorScheme === option.value
                                  ? 'border-purple-500 bg-purple-500/20'
                                  : 'border-gray-600 hover:border-gray-500'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full ${option.color} mx-auto mb-2`} />
                              <div className="text-white font-medium text-sm">{option.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Bell className="w-6 h-6 mr-3" />
                        Notifications
                      </h2>
                      <p className="text-gray-400 mb-6">Manage alerts and notification preferences</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'enabled', label: 'Enable Notifications', description: 'Allow all notifications' },
                        { key: 'sound', label: 'Sound Alerts', description: 'Play sound when sessions complete' },
                        { key: 'vibration', label: 'Vibration', description: 'Vibrate device on mobile' },
                        { key: 'desktop', label: 'Desktop Notifications', description: 'Show system notifications' },
                        { key: 'workComplete', label: 'Work Complete', description: 'Notify when work sessions finish' },
                        { key: 'breakComplete', label: 'Break Complete', description: 'Notify when breaks finish' },
                        { key: 'sessionStart', label: 'Session Start', description: 'Notify when sessions begin' },
                      ].map((setting) => (
                        <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                          <div>
                            <div className="text-white font-medium">{setting.label}</div>
                            <div className="text-gray-400 text-sm">{setting.description}</div>
                          </div>
                          <button
                            onClick={() => handleNotificationChange(setting.key as keyof typeof settings, !localSettings.notifications[setting.key as keyof typeof settings])}
                            className={`w-12 h-6 rounded-full transition-all duration-200 ${
                              localSettings.notifications[setting.key as keyof typeof settings]
                                ? 'bg-purple-500'
                                : 'bg-gray-600'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              localSettings.notifications[setting.key as keyof typeof settings]
                                ? 'translate-x-6'
                                : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      ))}

                      {permission === 'default' && (
                        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-blue-400 font-medium">Permission Required</div>
                              <div className="text-blue-300 text-sm">Grant notification permission to enable desktop alerts</div>
                            </div>
                            <button
                              onClick={requestNotificationPermission}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
                            >
                              Grant Permission
                            </button>
                          </div>
                        </div>
                      )}

                      {permission === 'granted' && (
                        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Notifications are enabled</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'advanced' && (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <Settings className="w-6 h-6 mr-3" />
                        Advanced Settings
                      </h2>
                      <p className="text-gray-400 mb-6">Advanced options and data management</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <h3 className="text-white font-medium mb-2">Data Management</h3>
                        <p className="text-gray-400 text-sm mb-4">Manage your stored data and settings</p>
                        <div className="flex space-x-4">
                          <button
                            onClick={resetSettings}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors duration-200"
                          >
                            Reset to Defaults
                          </button>
                          <button
                            onClick={() => {
                              const data = localStorage.getItem('pomodoro-settings');
                              if (data) {
                                navigator.clipboard.writeText(data);
                                toast.success('Settings copied to clipboard!');
                              }
                            }}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg transition-colors duration-200"
                          >
                            Export Settings
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <h3 className="text-white font-medium mb-2">App Information</h3>
                        <div className="text-gray-400 text-sm space-y-1">
                          <div>Version: 2.0.0</div>
                          <div>Build: Production</div>
                          <div>Storage: {localStorage.getItem('pomodoro-settings') ? 'Configured' : 'Default'}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6"
          >
            <button
              onClick={saveSettings}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewSettings;

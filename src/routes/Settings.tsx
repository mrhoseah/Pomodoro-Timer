import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '@/app/store';
import { setWorkMinutes, setBreakMinutes } from '@/features/settings/settingsSlice';
import { setTheme, setColorScheme } from '@/features/theme/themeSlice';
import { updateNotificationSettings, requestPermission } from '@/features/notifications/notificationsSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sun, Moon, Monitor, Palette, Bell, Volume2, Vibrate, Smartphone } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const workMinutes = useSelector((state: RootState) => state.settings.workMinutes);
  const breakMinutes = useSelector((state: RootState) => state.settings.breakMinutes);
  const { theme, colorScheme } = useSelector((state: RootState) => state.theme);
  const { settings, permission } = useSelector((state: RootState) => state.notifications);

  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(60, Number(e.target.value)));
    dispatch(setWorkMinutes(value));
  };

  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, Math.min(30, Number(e.target.value)));
    dispatch(setBreakMinutes(value));
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    dispatch(setTheme(newTheme));
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleColorSchemeChange = (newScheme: string) => {
    dispatch(setColorScheme(newScheme as any));
    toast.success(`Color scheme changed to ${newScheme}`);
  };

  const handleNotificationToggle = (key: keyof typeof settings, value: boolean) => {
    dispatch(updateNotificationSettings({ [key]: value }));
    if (key === 'desktop' && value && permission === 'default') {
      dispatch(requestPermission());
    }
  };

  const handleRequestPermission = () => {
    dispatch(requestPermission());
  };

  useEffect(() => {
    document.title = `Settings - Pomodoro Pro`;
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/70">Customize your Pomodoro experience</p>
      </motion.div>

      <Tabs defaultValue="timer" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Timer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="work-minutes" className="text-white">Work Duration (minutes)</Label>
                  <Input
                    id="work-minutes"
                    type="number"
                    min="1"
                    max="60"
                    value={workMinutes}
                    onChange={handleWorkMinutesChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break-minutes" className="text-white">Break Duration (minutes)</Label>
                  <Input
                    id="break-minutes"
                    type="number"
                    min="1"
                    max="30"
                    value={breakMinutes}
                    onChange={handleBreakMinutesChange}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Appearance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white">Theme</Label>
                  <Select value={theme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="w-4 h-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center space-x-2">
                          <Monitor className="w-4 h-4" />
                          <span>System</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Color Scheme</Label>
                  <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
                    <SelectTrigger className="bg-white/20 border-white/30 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Enable Notifications</Label>
                    <p className="text-white/70 text-sm">Allow desktop notifications</p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) => handleNotificationToggle('enabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Sound Alerts</Label>
                    <p className="text-white/70 text-sm">Play sound when sessions complete</p>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => handleNotificationToggle('sound', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Vibration</Label>
                    <p className="text-white/70 text-sm">Vibrate device on mobile</p>
                  </div>
                  <Switch
                    checked={settings.vibration}
                    onCheckedChange={(checked) => handleNotificationToggle('vibration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-white">Desktop Notifications</Label>
                    <p className="text-white/70 text-sm">Show system notifications</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.desktop}
                      onCheckedChange={(checked) => handleNotificationToggle('desktop', checked)}
                    />
                    {permission === 'default' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRequestPermission}
                        className="text-white border-white/30"
                      >
                        Grant Permission
                      </Button>
                    )}
                  </div>
                </div>

                {permission === 'granted' && (
                  <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">✓ Notifications are enabled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">About Pomodoro Pro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-white/70 space-y-2">
                <p>Version 2.0.0</p>
                <p>A next-generation Pomodoro timer built with React, TypeScript, and modern web technologies.</p>
                <p>Features include task management, analytics, PWA support, and customizable themes.</p>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-white/50 text-sm">&copy; 2024 Pomodoro Pro. Built with ❤️</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

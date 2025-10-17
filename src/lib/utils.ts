import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export const playNotificationSound = (audio: HTMLAudioElement) => {
  try {
    audio.currentTime = 0;
    audio.play().catch(console.error);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const vibrateDevice = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'default') {
    return await Notification.requestPermission();
  }
  
  return Notification.permission;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      ...options,
    });
    
    setTimeout(() => notification.close(), 5000);
    return notification;
  }
};

export const getThemeClass = (theme: 'light' | 'dark' | 'system', systemTheme: 'light' | 'dark') => {
  if (theme === 'system') {
    return systemTheme;
  }
  return theme;
};

export const getColorSchemeClasses = (colorScheme: string) => {
  const schemes = {
    blue: {
      primary: 'bg-blue-500',
      secondary: 'bg-blue-600',
      accent: 'text-blue-500',
      border: 'border-blue-500',
      ring: 'ring-blue-500',
    },
    purple: {
      primary: 'bg-purple-500',
      secondary: 'bg-purple-600',
      accent: 'text-purple-500',
      border: 'border-purple-500',
      ring: 'ring-purple-500',
    },
    green: {
      primary: 'bg-green-500',
      secondary: 'bg-green-600',
      accent: 'text-green-500',
      border: 'border-green-500',
      ring: 'ring-green-500',
    },
    orange: {
      primary: 'bg-orange-500',
      secondary: 'bg-orange-600',
      accent: 'text-orange-500',
      border: 'border-orange-500',
      ring: 'ring-orange-500',
    },
    red: {
      primary: 'bg-red-500',
      secondary: 'bg-red-600',
      accent: 'text-red-500',
      border: 'border-red-500',
      ring: 'ring-red-500',
    },
  };
  
  return schemes[colorScheme as keyof typeof schemes] || schemes.purple;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
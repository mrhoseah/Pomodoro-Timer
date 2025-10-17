import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
  workComplete: boolean;
  breakComplete: boolean;
  sessionStart: boolean;
}

interface NotificationsState {
  settings: NotificationSettings;
  permission: NotificationPermission;
  isSupported: boolean;
}

const initialState: NotificationsState = {
  settings: {
    enabled: true,
    sound: true,
    vibration: true,
    desktop: true,
    workComplete: true,
    breakComplete: true,
    sessionStart: false,
  },
  permission: 'default',
  isSupported: 'Notification' in window,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    updateNotificationSettings(state, action: PayloadAction<Partial<NotificationSettings>>) {
      state.settings = { ...state.settings, ...action.payload };
    },
    setPermission(state, action: PayloadAction<NotificationPermission>) {
      state.permission = action.payload;
    },
    requestPermission(state) {
      if (state.isSupported && state.permission === 'default') {
        Notification.requestPermission().then((permission) => {
          state.permission = permission;
        });
      }
    },
  },
});

export const { updateNotificationSettings, setPermission, requestPermission } = notificationsSlice.actions;

export default notificationsSlice.reducer;

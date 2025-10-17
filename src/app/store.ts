import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import analyticsReducer from '@/features/analytics/analyticsSlice';
import settingsReducer from '@/features/settings/settingsSlice';
import tasksReducer from '@/features/tasks/tasksSlice';
import themeReducer from '@/features/theme/themeSlice';
import notificationsReducer from '@/features/notifications/notificationsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings', 'tasks', 'theme', 'notifications'],
};

const rootReducer = combineReducers({
  analytics: analyticsReducer,
  settings: settingsReducer,
  tasks: tasksReducer,
  theme: themeReducer,
  notifications: notificationsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

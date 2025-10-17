import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'purple' | 'green' | 'orange' | 'red';

interface ThemeState {
  theme: Theme;
  colorScheme: ColorScheme;
  systemTheme: 'light' | 'dark';
}

const initialState: ThemeState = {
  theme: 'system',
  colorScheme: 'purple',
  systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    setColorScheme(state, action: PayloadAction<ColorScheme>) {
      state.colorScheme = action.payload;
    },
    setSystemTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.systemTheme = action.payload;
    },
  },
});

export const { setTheme, setColorScheme, setSystemTheme } = themeSlice.actions;

export default themeSlice.reducer;

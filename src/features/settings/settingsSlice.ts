import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    workMinutes: number;
    breakMinutes: number;
}

const initialState: SettingsState = {
    workMinutes: 25,
    breakMinutes: 5,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setWorkMinutes(state, action: PayloadAction<number>) {
            state.workMinutes = action.payload;
        },
        setBreakMinutes(state, action: PayloadAction<number>) {
            state.breakMinutes = action.payload;
        },
    },
});

export const { setWorkMinutes, setBreakMinutes } = settingsSlice.actions;

export default settingsSlice.reducer;

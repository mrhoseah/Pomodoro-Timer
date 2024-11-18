import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AnalyticsState {
    completedSessions: number;
    totalFocusTime: number; // in minutes
    breakTime: number; // in minutes
    incompleteSessions: number;
}

const initialState: AnalyticsState = {
    completedSessions: 0,
    totalFocusTime: 0,
    breakTime: 0,
    incompleteSessions: 0,
};

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        incrementCompletedSessions(state, action: PayloadAction<number>) {
            state.completedSessions += action.payload;
        },
        incrementFocusTime(state, action: PayloadAction<number>) {
            state.totalFocusTime += action.payload;
        },
        incrementBreakTime(state, action: PayloadAction<number>) {
            state.breakTime += action.payload;
        },
        incrementIncompleteSessions(state) {
            state.incompleteSessions += 1;
        },
        resetAnalytics(state) {
            state.completedSessions = 0;
            state.totalFocusTime = 0;
            state.breakTime = 0;
            state.incompleteSessions = 0;
        },
    },
});

export const {
    incrementCompletedSessions,
    incrementFocusTime,
    incrementBreakTime,
    incrementIncompleteSessions,
    resetAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

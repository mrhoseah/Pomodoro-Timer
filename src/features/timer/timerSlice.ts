import { createSlice } from '@reduxjs/toolkit'

const timerSlice = createSlice({
    name: 'timer',
    initialState: [],
    reducers: {
        incrementCompletedSessions(state, action) {
            state.push({
                id: action.payload.id,
                text: action.payload.text,
                completed: false,
            })
        },
        incrementTotalFocus(state, action) {
            const todo = state.find((todo) => todo.id === action.payload)
            todo.completed = !todo.completed
        },
    },
})

export const { incrementCompletedSessions, incrementTotalFocus } = timerSlice.actions
export default timerSlice.reducer
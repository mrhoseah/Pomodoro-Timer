import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  pomodoros: number;
  completedPomodoros: number;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  completedAt?: string;
}

interface TasksState {
  tasks: Task[];
  currentTask?: string;
  filter: 'all' | 'active' | 'completed';
  searchQuery: string;
}

const initialState: TasksState = {
  tasks: [],
  currentTask: undefined,
  filter: 'all',
  searchQuery: '',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'completed' | 'completedPomodoros'>>) {
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completed: false,
        completedPomodoros: 0,
      };
      state.tasks.push(newTask);
    },
    updateTask(state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) {
      const task = state.tasks.find(t => t.id === action.payload.id);
      if (task) {
        Object.assign(task, action.payload.updates);
        if (action.payload.updates.completed) {
          task.completedAt = new Date().toISOString();
        }
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      if (state.currentTask === action.payload) {
        state.currentTask = undefined;
      }
    },
    setCurrentTask(state, action: PayloadAction<string | undefined>) {
      state.currentTask = action.payload;
    },
    completePomodoro(state, action: PayloadAction<string>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task && task.completedPomodoros < task.pomodoros) {
        task.completedPomodoros += 1;
        if (task.completedPomodoros >= task.pomodoros) {
          task.completed = true;
          task.completedAt = new Date().toISOString();
        }
      }
    },
    setFilter(state, action: PayloadAction<'all' | 'active' | 'completed'>) {
      state.filter = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearCompletedTasks(state) {
      state.tasks = state.tasks.filter(task => !task.completed);
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  setCurrentTask,
  completePomodoro,
  setFilter,
  setSearchQuery,
  clearCompletedTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;

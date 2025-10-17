import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/app/store';
import { addTask, updateTask, deleteTask, setCurrentTask, setFilter, setSearchQuery, clearCompletedTasks } from '@/features/tasks/tasksSlice';
import { 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Star, 
  Clock, 
  Filter,
  Edit3,
  Play,
  Pause,
  MoreVertical,
  Target,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Task {
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

const NewTaskManager: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, currentTask, filter, searchQuery } = useSelector((state: RootState) => state.tasks);
  const { colorScheme } = useSelector((state: RootState) => state.theme);
  
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    pomodoros: 1, 
    priority: 'medium' as const 
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const getColors = () => {
    const schemes = {
      blue: {
        primary: 'from-blue-500 to-blue-700',
        secondary: 'from-blue-400 to-blue-600',
        accent: 'text-blue-300',
        card: 'bg-blue-500/10 border-blue-500/20',
        button: 'bg-blue-500 hover:bg-blue-600',
      },
      purple: {
        primary: 'from-purple-500 to-purple-700',
        secondary: 'from-purple-400 to-purple-600',
        accent: 'text-purple-300',
        card: 'bg-purple-500/10 border-purple-500/20',
        button: 'bg-purple-500 hover:bg-purple-600',
      },
      green: {
        primary: 'from-green-500 to-green-700',
        secondary: 'from-green-400 to-green-600',
        accent: 'text-green-300',
        card: 'bg-green-500/10 border-green-500/20',
        button: 'bg-green-500 hover:bg-green-600',
      },
      orange: {
        primary: 'from-orange-500 to-orange-700',
        secondary: 'from-orange-400 to-orange-600',
        accent: 'text-orange-300',
        card: 'bg-orange-500/10 border-orange-500/20',
        button: 'bg-orange-500 hover:bg-orange-600',
      },
      red: {
        primary: 'from-red-500 to-red-700',
        secondary: 'from-red-400 to-red-600',
        accent: 'text-red-300',
        card: 'bg-red-500/10 border-red-500/20',
        button: 'bg-red-500 hover:bg-red-600',
      },
    };
    return schemes[colorScheme as keyof typeof schemes] || schemes.purple;
  };

  const colors = getColors();

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !task.completed) || 
      (filter === 'completed' && task.completed);
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      dispatch(addTask(newTask));
      setNewTask({ title: '', description: '', pomodoros: 1, priority: 'medium' });
      toast.success('Task added successfully!', {
        icon: <CheckCircle2 className="w-5 h-5" />,
      });
    }
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    dispatch(updateTask({ id, updates }));
    setEditingTask(null);
    toast.success('Task updated!', {
      icon: <Edit3 className="w-5 h-5" />,
    });
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
    toast.success('Task deleted!', {
      icon: <Trash2 className="w-5 h-5" />,
    });
  };

  const handleSetCurrentTask = (id: string) => {
    dispatch(setCurrentTask(id));
    toast.success('Task set as current focus!', {
      icon: <Target className="w-5 h-5" />,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="w-3 h-3" />;
      case 'medium': return <Clock className="w-3 h-3" />;
      case 'low': return <Circle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Task Manager</h1>
          <p className="text-gray-400">Organize your work and stay productive</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalTasks}</div>
                <div className="text-sm text-gray-400">Total Tasks</div>
              </div>
            </div>
          </div>

          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completedTasks}</div>
                <div className="text-sm text-gray-400">Completed</div>
              </div>
            </div>
          </div>

          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{completionRate}%</div>
                <div className="text-sm text-gray-400">Completion Rate</div>
              </div>
            </div>
          </div>

          <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {tasks.reduce((acc, task) => acc + task.pomodoros, 0)}
                </div>
                <div className="text-sm text-gray-400">Total Pomodoros</div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Task Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Add New Task
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Task Title</label>
                  <input
                    type="text"
                    placeholder="Enter task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="Enter task description..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Pomodoros</label>
                    <select
                      value={newTask.pomodoros}
                      onChange={(e) => setNewTask({ ...newTask, pomodoros: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} pomodoro{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddTask}
                  className={`w-full px-6 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Task</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tasks List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className={`${colors.card} backdrop-blur-sm rounded-xl p-6 border`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Tasks ({filteredTasks.length})
                </h2>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                      className="pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    onClick={() => dispatch(clearCompletedTasks())}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-colors duration-200"
                  >
                    Clear Completed
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2 mb-6">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'completed', label: 'Completed' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => dispatch(setFilter(tab.id as any))}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                      filter === tab.id
                        ? 'bg-white text-gray-900 font-semibold'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={`p-4 rounded-xl border transition-all duration-200 ${
                        task.id === currentTask 
                          ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30' 
                          : 'bg-gray-700/30 border-gray-600/50 hover:bg-gray-700/50'
                      } ${task.completed ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className={`font-semibold text-white ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                                {getPriorityIcon(task.priority)}
                                <span className="ml-1 capitalize">{task.priority}</span>
                              </span>
                              {task.id === currentTask && (
                                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs">
                                  Current
                                </span>
                              )}
                            </div>
                            
                            {task.description && (
                              <p className="text-sm text-gray-400 mb-3">{task.description}</p>
                            )}
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                {task.completedPomodoros}/{task.pomodoros} pomodoros
                              </span>
                              <div className="flex-1 bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(task.completedPomodoros / task.pomodoros) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {!task.completed && (
                              <button
                                onClick={() => handleSetCurrentTask(task.id)}
                                disabled={task.id === currentTask}
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Set as current focus"
                              >
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                            
                            <button
                              onClick={() => setEditingTask(task.id)}
                              className="p-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded-lg transition-colors duration-200"
                              title="Edit task"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200"
                              title="Delete task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks found. Add one above to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NewTaskManager;

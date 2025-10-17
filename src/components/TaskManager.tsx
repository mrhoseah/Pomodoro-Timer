import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '@/app/store';
import { addTask, updateTask, deleteTask, setCurrentTask, setFilter, setSearchQuery, clearCompletedTasks } from '@/features/tasks/tasksSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Trash2, CheckCircle2, Circle, Star, Clock, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaskManager: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, currentTask, filter, searchQuery } = useSelector((state: RootState) => state.tasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', pomodoros: 1, priority: 'medium' as const });
  const [editingTask, setEditingTask] = useState<string | null>(null);

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
      toast.success('Task added successfully!');
    }
  };

  const handleUpdateTask = (id: string, updates: any) => {
    dispatch(updateTask({ id, updates }));
    setEditingTask(null);
    toast.success('Task updated!');
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
    toast.success('Task deleted!');
  };

  const handleSetCurrentTask = (id: string) => {
    dispatch(setCurrentTask(id));
    toast.success('Task set as current focus!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
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

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Plus className="w-5 h-5" />
            Add New Task
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
            <Input
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={newTask.pomodoros.toString()}
              onValueChange={(value) => setNewTask({ ...newTask, pomodoros: parseInt(value) })}
            >
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} pomodoro{num > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={newTask.priority}
              onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
            >
              <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="w-5 h-5" />
              Tasks ({filteredTasks.length})
            </CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-48 bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(clearCompletedTasks())}
                className="text-white border-white/30 hover:bg-white/20"
              >
                Clear Completed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <Tabs value={filter} onValueChange={(value: any) => dispatch(setFilter(value))}>
          <TabsList className="grid w-full grid-cols-3 bg-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white">All</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white">Active</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-white">Completed</TabsTrigger>
          </TabsList>
            
            <TabsContent value={filter} className="mt-4">
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={`${task.id === currentTask ? 'ring-2 ring-blue-500' : ''} ${task.completed ? 'opacity-60' : ''} bg-white/5 backdrop-blur-sm border-white/10`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className={`font-semibold text-white ${task.completed ? 'line-through' : ''}`}>
                                  {task.title}
                                </h3>
                                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                  {getPriorityIcon(task.priority)}
                                  <span className="ml-1 capitalize">{task.priority}</span>
                                </Badge>
                                {task.id === currentTask && (
                                  <Badge variant="default" className="text-xs">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-white/70 mb-2">{task.description}</p>
                              )}
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {task.completedPomodoros}/{task.pomodoros} pomodoros
                                </span>
                                <div className="flex-1 bg-white/20 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(task.completedPomodoros / task.pomodoros) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {!task.completed && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSetCurrentTask(task.id)}
                                  disabled={task.id === currentTask}
                                >
                                  Focus
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingTask(task.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-8 text-white/60">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks found. Add one above to get started!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;

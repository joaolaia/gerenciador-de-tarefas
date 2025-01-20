import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchTasks, Task } from '../services/taskService';
import { message } from 'antd';

interface TasksContextData {
  tasks: Task[];
  filteredTasks: Task[];
  categories: string[];
  selectedTask: Task | null;
  search: string;
  filterCategory: string;
  filterStatus: string;
  setSearch: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setSelectedTask: (task: Task | null) => void;
  clearFilters: () => void;
  refreshTasks: () => void;
}

const TasksContext = createContext<TasksContextData>({} as TasksContextData);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState('pendente');

  const refreshTasks = async () => {
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
      setFilteredTasks(tasksData);

      const sortedTasks = tasksData.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
      setSelectedTask(sortedTasks[0] || null);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao carregar tarefas!');
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  useEffect(() => {
    const uniquePendingCategories = Array.from(
      new Set(tasks.filter((task) => task.status === 'pendente').map((task) => task.category))
    );
    setCategories(uniquePendingCategories);

    const sortedTasks = tasks.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    setSelectedTask(sortedTasks[0] || null);
  }, [tasks]);

  useEffect(() => {
    let filtered = tasks;

    if (search) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((task) => task.category === filterCategory);
    }

    if (filterStatus) {
      filtered = filtered.filter((task) => task.status === filterStatus);
    }

    setFilteredTasks(filtered);
  }, [search, filterCategory, filterStatus, tasks]);

  const clearFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterStatus('pendente');
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        selectedTask,
        search,
        filterCategory,
        filterStatus,
        setSearch,
        setFilterCategory,
        setFilterStatus,
        setSelectedTask,
        clearFilters,
        refreshTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);

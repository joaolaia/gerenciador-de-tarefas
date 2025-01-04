import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import axios from '../services/api';
import HeaderComponent from '../components/Header';
import FiltersComponent from '../components/Filters';
import TasksTableComponent from '../components/TasksTable';
import TaskDetailsComponent from '../components/TaskDetails';

const { Content } = Layout;

interface Task {
  id: number;
  title: string;
  category: string;
  status: string;
  dueDate: string;
  description: string;
}

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filterCategory, filterStatus, tasks]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setFilteredTasks(response.data);

      const sortedTasks = response.data.sort((a: Task, b: Task) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return dateA - dateB;
      });
      setSelectedTask(sortedTasks[0] || null);
    } catch (error: any) {
      message.error(
        error.response?.data?.message || 'Erro ao carregar tarefas!'
      );
    }
  };

  const applyFilters = () => {
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
  };

  const clearFilters = () => {
    setSearch('');
    setFilterCategory('');
    setFilterStatus('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleTaskAction = (action: 'complete' | 'delete') => {
    if (!selectedTask) return;

    const token = localStorage.getItem('token');

    if (action === 'complete') {
      axios
        .put(
          `/tasks/${selectedTask.id}`,
          { status: 'concluído' },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          message.success('Tarefa concluída!');
          fetchTasks();
        })
        .catch(() => {
          message.error('Erro ao concluir a tarefa.');
        });
    } else if (action === 'delete') {
      axios
        .delete(`/tasks/${selectedTask.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          message.success('Tarefa excluída!');
          fetchTasks();
        })
        .catch(() => {
          message.error('Erro ao excluir a tarefa.');
        });
    }
  };

  return (
    <Layout>
      <HeaderComponent handleLogout={handleLogout} />
      <Content style={{ padding: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <FiltersComponent
            search={search}
            filterCategory={filterCategory}
            filterStatus={filterStatus}
            setSearch={setSearch}
            setFilterCategory={setFilterCategory}
            setFilterStatus={setFilterStatus}
            clearFilters={clearFilters}
          />
          <TasksTableComponent
            filteredTasks={filteredTasks}
            onTaskSelect={setSelectedTask}
          />
        </div>
        <div style={{ flex: 1 }}>
          <TaskDetailsComponent
            task={selectedTask}
            onTaskAction={handleTaskAction}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default DashboardPage;

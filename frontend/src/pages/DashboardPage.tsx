import React, { useState } from 'react';
import { Layout, message } from 'antd';
import { useTasks } from '../contexts/TasksContext';
import { PlusOutlined } from '@ant-design/icons';
import AddTaskModal from '../components/AddTaskModal';
import HeaderComponent from '../components/Header';
import FiltersComponent from '../components/Filters';
import TasksTableComponent from '../components/TasksTable';
import TaskDetailsComponent from '../components/TaskDetails';
import { completeTask, deleteTask } from '../services/taskService';
import { Button } from 'antd';


const { Content } = Layout;

const DashboardPage: React.FC = () => {
  const {
    filteredTasks,
    selectedTask,
    setSelectedTask,
    refreshTasks,
  } = useTasks();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleTaskAction = async (action: 'complete' | 'delete') => {
    if (!selectedTask) return;

    try {
      if (action === 'complete') {
        await completeTask(selectedTask.id);
        message.success('Tarefa concluída!');
      } else if (action === 'delete') {
        await deleteTask(selectedTask.id);
        message.success('Tarefa excluída!');
      }
      refreshTasks();
    } catch {
      message.error(`Erro ao ${action === 'complete' ? 'concluir' : 'excluir'} a tarefa.`);
    }
  };

  return (
    <Layout>
      <HeaderComponent handleLogout={handleLogout} />
      <Content style={{ padding: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <FiltersComponent/>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: 16 }}
            onClick={() => setIsModalVisible(true)}
          >
            Adicionar Tarefa
          </Button>
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
        <AddTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      </Content>
    </Layout>
  );
};

export default DashboardPage;

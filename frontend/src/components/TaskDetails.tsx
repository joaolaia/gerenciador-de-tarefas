import React, { useState } from 'react';
import { Card, Space, Button } from 'antd';
import EditTaskModal from './EditTaskModal';

interface Task {
  id: number;
  title: string;
  category: string;
  status: string;
  dueDate: string;
  description: string;
}

interface TaskDetailsProps {
  task: Task | null;
  onTaskAction: (action: 'complete' | 'delete') => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onTaskAction,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  return (
  <Card title="Detalhes da Tarefa">
    {task ? (
      <div>
        <p>
          <strong>Título:</strong> {task.title}
        </p>
        <p>
          <strong>Categoria:</strong> {task.category}
        </p>
        <p>
          <strong>Data de Entrega:</strong>{' '}
          {new Date(task.dueDate).toLocaleDateString('pt-BR')}
        </p>
        <p>
          <strong>Descrição:</strong> {task.description}
        </p>
        <Space style={{ marginTop: 16 }}>
        <Button onClick={() => setIsEditModalVisible(true)}>Editar Tarefa</Button>
          <Button  type="primary" onClick={() => onTaskAction('complete')}>
            Concluir
          </Button>
          <Button type="primary" danger onClick={() => onTaskAction('delete')}>
            Excluir
          </Button>
        </Space>
        <EditTaskModal
            visible={isEditModalVisible}
            onClose={() => setIsEditModalVisible(false)}
          />
      </div>
    ) : (
      <p>Nenhuma tarefa selecionada.</p>
    )}
  </Card>)
};

export default TaskDetails;

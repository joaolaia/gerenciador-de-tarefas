// frontend/src/services/taskService.ts
import api from './api';

export interface Task {
  id: number;
  title: string;
  category: string;
  status: string;
  dueDate: string;
  description: string;
}

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  console.log('Tarefas recebidas:', response.data);
  return response.data;
};

export const completeTask = async (taskId: number): Promise<void> => {
  await api.put(`/tasks/${taskId}`, { status: 'concluído' });
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/tasks/${taskId}`);
};

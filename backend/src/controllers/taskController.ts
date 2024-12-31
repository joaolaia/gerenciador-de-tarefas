import { Request, Response } from 'express';
import Task from '../models/task';

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.findAll();

    if (tasks.length === 0) {
      res.status(404).json({ message: 'Nenhuma tarefa cadastrada no momento.' });
      return;
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Erro ao buscar as tarefas:', error);
    res.status(500).json({ message: 'Erro ao buscar as tarefas. Tente novamente mais tarde.' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, status, dueDate, category } = req.body;
  
      if (!title || !category) {
        res.status(400).json({ message: 'Título e categoria são obrigatórios.' });
        return;
      }

      const newTask = await Task.create({
        title,
        description,
        status: status || 'pendente',
        dueDate: dueDate || null,
        category,
      });
  
      res.status(201).json({
        message: 'Tarefa criada com sucesso.',
        task: newTask,
      });
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      res.status(500).json({ message: 'Erro ao criar tarefa. Tente novamente mais tarde.' });
    }
  };

  export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, status, dueDate, category } = req.body;
  
      const task = await Task.findByPk(id);
      if (!task) {
        res.status(404).json({ message: 'Tarefa não encontrada.' });
        return;
      }
  
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
      task.category = category || task.category;
  
      await task.save();
  
      res.status(200).json({ message: 'Tarefa atualizada com sucesso!', task });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ message: 'Erro no servidor.' });
    }
  };

  export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
  
      const task = await Task.findByPk(id);
      if (!task) {
        res.status(404).json({ message: 'Tarefa não encontrada.' });
        return;
      }
  
      await task.destroy();
  
      res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
      res.status(500).json({ message: 'Erro no servidor. Não foi possível excluir a tarefa.' });
    }
  };
import { Router } from 'express';
import { deleteTask, updateTask, createTask, getAllTasks } from '../controllers/taskController';

const router = Router();

router.put('/:id', updateTask);
router.get('/', getAllTasks);
router.post('/', createTask);
router.delete('/:id', deleteTask);


export default router;

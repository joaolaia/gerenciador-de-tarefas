import { Router } from 'express';
import { registerUser, loginUser, getProfile, updateProfile, changePassword } from '../controllers/authController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

export default router;

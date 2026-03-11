import express from 'express';
import { registerUser, loginUser, getProfile, adminLogin } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/profile', authMiddleware, getProfile);
userRouter.post('/admin', adminLogin);

export default userRouter;

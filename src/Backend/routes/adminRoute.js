import express from 'express';
import { getDashboardStats, getAllCustomers } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();

adminRouter.get('/dashboard', adminAuth, getDashboardStats);
adminRouter.get('/customers', adminAuth, getAllCustomers);

export default adminRouter;

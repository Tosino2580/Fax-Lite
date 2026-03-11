import express from 'express';
import {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getOrderStats,
    placeOrder,
    getMyOrders,
    trackOrder,
} from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// Public route - track order (no auth needed)
orderRouter.get('/track/:id', trackOrder);

// Customer routes (authenticated user)
orderRouter.post('/place', authMiddleware, placeOrder);
orderRouter.get('/my-orders', authMiddleware, getMyOrders);

// Admin routes
orderRouter.get('/', adminAuth, getAllOrders);
orderRouter.get('/stats', adminAuth, getOrderStats);
orderRouter.get('/:id', adminAuth, getOrderById);
orderRouter.put('/:id/status', adminAuth, updateOrderStatus);

export default orderRouter;

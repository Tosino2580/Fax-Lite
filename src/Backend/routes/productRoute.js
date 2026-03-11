import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
} from '../controllers/productController.js';
import adminAuth from '../middleware/adminAuth.js';
import upload from '../middleware/multer.js';

const productRouter = express.Router();

// Public routes
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProduct);

// Admin-only routes
productRouter.post('/', adminAuth, upload.array('images', 4), createProduct);
productRouter.put('/:id', adminAuth, updateProduct);
productRouter.delete('/:id', adminAuth, deleteProduct);
productRouter.patch('/:id/toggle', adminAuth, toggleProductStatus);

export default productRouter;

import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/Product.js';

// GET /api/products — public
const getAllProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        // Only return active products for public consumers unless admin flag present
        if (!req.query.includeInactive) {
            filter.isActive = true;
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error('getAllProducts error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/products/:id — public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('getProduct error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/products — admin only, multipart/form-data with up to 4 images
const createProduct = async (req, res) => {
    try {
        const { name, description, price, oldPrice, category, sizes, inStock, isActive, badge } = req.body;

        // Upload each file to Cloudinary
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: 'fax_products',
                });
                imageUrls.push(result.secure_url);
            }
        }

        // Parse sizes if sent as a JSON string or comma-separated
        let parsedSizes;
        if (sizes) {
            if (typeof sizes === 'string') {
                try {
                    parsedSizes = JSON.parse(sizes);
                } catch {
                    parsedSizes = sizes.split(',').map((s) => s.trim()).filter(Boolean);
                }
            } else {
                parsedSizes = sizes;
            }
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : undefined,
            category,
            images: imageUrls,
            sizes: parsedSizes,
            inStock: inStock !== undefined ? Number(inStock) : undefined,
            isActive: isActive !== undefined ? isActive === 'true' || isActive === true : undefined,
            badge,
        });

        res.status(201).json({ success: true, message: 'Product created successfully', product });
    } catch (error) {
        console.error('createProduct error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/products/:id — admin only
const updateProduct = async (req, res) => {
    try {
        const { name, description, price, oldPrice, category, images, sizes, inStock, isActive, badge } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (oldPrice !== undefined) updateData.oldPrice = Number(oldPrice);
        if (category !== undefined) updateData.category = category;
        if (images !== undefined) updateData.images = images;
        if (sizes !== undefined) updateData.sizes = sizes;
        if (inStock !== undefined) updateData.inStock = Number(inStock);
        if (isActive !== undefined) updateData.isActive = isActive;
        if (badge !== undefined) updateData.badge = badge;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('updateProduct error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/products/:id — admin only
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('deleteProduct error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// PATCH /api/products/:id/toggle — admin only
const toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        product.isActive = !product.isActive;
        await product.save();

        res.json({
            success: true,
            message: `Product is now ${product.isActive ? 'active' : 'inactive'}`,
            product,
        });
    } catch (error) {
        console.error('toggleProductStatus error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, toggleProductStatus };

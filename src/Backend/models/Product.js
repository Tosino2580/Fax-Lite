import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
        },
        oldPrice: {
            type: Number,
        },
        category: {
            type: String,
            required: [true, 'Product category is required'],
            enum: ['Collections', 'Jalabiya', 'Agbada', 'Kaftan', 'Abaya', 'CropTop', 'Kids'],
        },
        images: {
            type: [String],
            default: [],
        },
        sizes: {
            type: [String],
            default: ['S', 'M', 'L', 'XL', 'XXL'],
        },
        inStock: {
            type: Number,
            default: 10,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        badge: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;

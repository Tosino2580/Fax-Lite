import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
        },
        items: [
            {
                productId: {
                    type: String,
                    required: [true, 'Product ID is required'],
                },
                name: {
                    type: String,
                    required: [true, 'Product name is required'],
                },
                price: {
                    type: Number,
                    required: [true, 'Product price is required'],
                },
                quantity: {
                    type: Number,
                    required: [true, 'Quantity is required'],
                },
                size: {
                    type: String,
                    required: [true, 'Size is required'],
                },
                image: {
                    type: String,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        shippingAddress: {
            fullName: { type: String },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            phone: { type: String },
        },
        paymentMethod: {
            type: String,
            default: 'cash_on_delivery',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;

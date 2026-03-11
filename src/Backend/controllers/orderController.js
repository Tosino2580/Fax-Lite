import Order from '../models/Order.js';

// GET /api/orders — admin only, all orders, newest first
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });
    } catch (error) {
        console.error('getAllOrders error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/stats — admin only
const getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const recentOrders = await Order.find()
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                totalRevenue,
                recentOrders,
            },
        });
    } catch (error) {
        console.error('getOrderStats error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/:id — admin only
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, order });
    } catch (error) {
        console.error('getOrderById error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/orders/:id/status — admin only
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('updateOrderStatus error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/orders/place — authenticated user places an order
const placeOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.phone) {
            return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
        }

        const order = new Order({
            user: req.userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'cash_on_delivery',
            status: 'pending',
        });

        await order.save();

        res.status(201).json({ success: true, message: 'Order placed successfully', order });
    } catch (error) {
        console.error('placeOrder error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/my-orders — authenticated user gets their own orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('getMyOrders error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/orders/track/:id — public, track order by ID (last 8 chars or full ID)
const trackOrder = async (req, res) => {
    try {
        const id = req.params.id.trim();
        let order = null;

        // Try exact match first
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        }

        // If not found, try matching last 8 characters of _id
        if (!order) {
            const allOrders = await Order.find({}, '_id items totalAmount status shippingAddress paymentMethod createdAt');
            order = allOrders.find(o => o._id.toString().slice(-8).toUpperCase() === id.toUpperCase());
        }

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found. Please check the ID and try again.' });
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error('trackOrder error:', error.message);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

export { getAllOrders, getOrderById, updateOrderStatus, getOrderStats, placeOrder, getMyOrders, trackOrder };

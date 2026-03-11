import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// GET /api/admin/dashboard — admin only
const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalProducts, totalOrders, revenueResult, recentOrders, ordersByStatusRaw] =
            await Promise.all([
                User.countDocuments(),
                Product.countDocuments(),
                Order.countDocuments(),
                Order.aggregate([
                    { $match: { status: { $ne: 'cancelled' } } },
                    { $group: { _id: null, total: { $sum: '$totalAmount' } } },
                ]),
                Order.find()
                    .populate('user', 'firstName lastName')
                    .sort({ createdAt: -1 })
                    .limit(5),
                Order.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } },
                ]),
            ]);

        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Convert array of { _id, count } to a readable object
        const ordersByStatus = ordersByStatusRaw.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                recentOrders,
                ordersByStatus,
            },
        });
    } catch (error) {
        console.error('getDashboardStats error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/admin/customers — admin only, all users without passwords
const getAllCustomers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        console.error('getAllCustomers error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getDashboardStats, getAllCustomers };

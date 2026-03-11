/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized. Admin access required.' });
        }

        req.adminId = decoded.id;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Token expired or invalid.' });
    }
};

export default adminAuth;

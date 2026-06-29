/* eslint-disable no-undef */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { logEventToSentinelX } from '../sentinelx-ecommerce-client.js'

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            await logEventToSentinelX(req, email ? email.toLowerCase() : 'unknown', 'register', 'failure', { reason: 'missing_fields' });
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password.length < 6) {
            await logEventToSentinelX(req, email.toLowerCase(), 'register', 'failure', { reason: 'password_too_short' });
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            await logEventToSentinelX(req, email.toLowerCase(), 'register', 'failure', { reason: 'email_exists' });
            return res.status(409).json({ success: false, message: 'An account with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        const token = createToken(user._id);

        await logEventToSentinelX(req, user.email, 'register', 'success', { userId: user._id, firstName, lastName });

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        await logEventToSentinelX(req, email ? email.toLowerCase() : 'unknown', 'register', 'failure', { reason: error.message || 'server_error' });
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

// POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            await logEventToSentinelX(req, email ? email.toLowerCase() : 'unknown', 'login', 'failure', { reason: 'missing_fields' });
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            await logEventToSentinelX(req, email.toLowerCase(), 'login', 'failure', { reason: 'user_not_found' });
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await logEventToSentinelX(req, email.toLowerCase(), 'login', 'failure', { reason: 'incorrect_password' });
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = createToken(user._id);

        await logEventToSentinelX(req, user.email, 'login', 'success', { userId: user._id });

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);
        await logEventToSentinelX(req, email ? email.toLowerCase() : 'unknown', 'login', 'failure', { reason: error.message || 'server_error' });
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// GET /api/users/profile (protected)
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Profile error:', error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Admin login (env-based)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            await logEventToSentinelX(req, email ? email.toLowerCase() : 'unknown', 'login', 'failure', { reason: 'missing_fields' }, 'admin');
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            await logEventToSentinelX(req, email, 'login', 'success', {}, 'admin');
            return res.json({ success: true, token });
        }

        await logEventToSentinelX(req, email, 'login', 'failure', { reason: 'invalid_credentials' }, 'admin');
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error('Admin login error:', error.message);
        await logEventToSentinelX(req, email ? email : 'unknown', 'login', 'failure', { reason: error.message || 'server_error' }, 'admin');
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export { registerUser, loginUser, getProfile, adminLogin }

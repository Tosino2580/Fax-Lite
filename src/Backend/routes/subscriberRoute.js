import express from 'express';
import Subscriber from '../models/Subscriber.js';
import { sendWelcomeEmail } from '../config/mailer.js';

const subscriberRouter = express.Router();

// POST /api/subscribers — subscribe to newsletter
subscriberRouter.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This email is already subscribed!' });
    }

    // Save subscriber
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send welcome email (don't fail the request if email fails)
    try {
      await sendWelcomeEmail(email);
    } catch (emailErr) {
      console.error('Welcome email failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Successfully subscribed! Check your inbox for a welcome email.' });
  } catch (err) {
    console.error('Subscribe error:', err.message);
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
});

export default subscriberRouter;

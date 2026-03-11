import express from 'express';
import { sendWelcomeEmail } from '../config/mailer.js';
import nodemailer from 'nodemailer';

const contactRouter = express.Router();

contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FAX Collections Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject || 'No Subject'} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;padding:20px;background:#18181b;color:#e4e4e7;border-radius:12px;">
          <h2 style="color:#eab308;margin:0 0 16px;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr style="border-color:#333;margin:16px 0;" />
          <p style="white-space:pre-wrap;">${message}</p>
        </div>
      `,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

export default contactRouter;

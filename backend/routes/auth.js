import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import { generateResetToken } from '../utils/token.js';

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password',
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// GET /api/auth/me (protected)
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email',
      });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset link has been sent to your email',
      });
    }
    const token = generateResetToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || '';
    const resetUrl = frontendUrl
      ? `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${token}`
      : '';
    
    if (!resetUrl) {
      console.error('[Password Reset] FRONTEND_URL not set on Render. Set FRONTEND_URL to your Netlify URL.');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact support.',
      });
    }

    const emailSent = await sendPasswordResetEmail(user.email, resetUrl);
    
    // In development/testing: if email wasn't sent (no SendGrid), return the link in response
    const isDev = process.env.NODE_ENV !== 'production';
    const response = {
      success: true,
      message: 'If an account exists, a reset link has been sent to your email',
    };
    
    if (!emailSent && isDev) {
      response.resetLink = resetUrl;
      response.note = 'Email not sent (SendGrid not configured). Use this link to reset:';
    }

    res.json(response);
  } catch (err) {
    console.error('[forgot-password]', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new one.',
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const authToken = generateToken(user._id);
    res.json({
      success: true,
      token: authToken,
      user: { id: user._id, name: user.name, email: user.email },
      message: 'Password updated successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
});

export default router;

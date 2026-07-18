const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';

router.post('/signup', async (req, res) => {
  try {
    const { username, password, country } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }

    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasMinLength || !hasLetter || !hasNumber) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include letters and numbers.' });
    }

    const existing = await userModel.findByUsername(username);
    if (existing) {
      return res.status(409).json({ message: 'Username already taken.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create(username, hashed, country);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({ token, isNewUser: true, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed.' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required.' });
    }

    const user = await userModel.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, isNewUser: !user.onboarded, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed.' });
  }
});

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const workoutModel = require('./workoutModel');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-this';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });
  const token = authHeader.split(' ')[1];
  try {
    req.userId = jwt.verify(token, JWT_SECRET).id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// POST /api/day1/complete  -> called when user finishes the full Day 1 flow
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    await workoutModel.logSession(req.userId, 'day1', 'completed');
    res.json({ message: 'Day 1 workout logged.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to log workout.' });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const history = await workoutModel.getHistory(req.userId, 'day1');
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch history.' });
  }
});

module.exports = router;
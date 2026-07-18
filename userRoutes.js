const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');

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

// Approximate — one timezone per country. Add more as needed.
const COUNTRY_TIMEZONES = {
  'Pakistan': 'Asia/Karachi',
  'India': 'Asia/Kolkata',
  'United States': 'America/New_York',
  'USA': 'America/New_York',
  'United Kingdom': 'Europe/London',
  'UK': 'Europe/London',
  'Canada': 'America/Toronto',
  'Australia': 'Australia/Sydney',
  'UAE': 'Asia/Dubai',
  'United Arab Emirates': 'Asia/Dubai',
  'Saudi Arabia': 'Asia/Riyadh',
  'Germany': 'Europe/Berlin',
  'France': 'Europe/Paris',
  'China': 'Asia/Shanghai',
  'Japan': 'Asia/Tokyo',
  'Bangladesh': 'Asia/Dhaka',
  'Nigeria': 'Africa/Lagos',
  'Egypt': 'Africa/Cairo',
  'Turkey': 'Europe/Istanbul',
  'Brazil': 'America/Sao_Paulo',
  'Indonesia': 'Asia/Jakarta',
  'Russia': 'Europe/Moscow',
  'South Africa': 'Africa/Johannesburg',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Philippines': 'Asia/Manila',
};

function getWeekdayForCountry(country) {
  const tz = COUNTRY_TIMEZONES[country] || 'UTC';
  return new Date().toLocaleString('en-US', { timeZone: tz, weekday: 'long' });
}

// Mon/Wed/Fri = Day 1, Tue/Thu/Sat = Day 2, Sunday = rest. Adjust here if you want a different split.
function getWorkoutForWeekday(weekday) {
  const day1Days = ['Monday', 'Wednesday', 'Friday'];
  const day2Days = ['Tuesday', 'Thursday', 'Saturday'];
  if (day1Days.includes(weekday)) return { day: 'day1', label: 'Day 1: Hypertrophy' };
  if (day2Days.includes(weekday)) return { day: 'day2', label: 'Day 2: Skills' };
  return { day: 'rest', label: 'Rest Day' };
}

router.post('/onboarding', authMiddleware, async (req, res) => {
  try {
    const { current_weight, height } = req.body;
    if (!current_weight || !height) {
      return res.status(400).json({ message: 'Weight and height are required.' });
    }
    await userModel.completeOnboarding(req.userId, current_weight, height);
    const user = await userModel.findById(req.userId);
    res.json({ message: 'Onboarding complete.', user: sanitize(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Onboarding failed.' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: sanitize(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

router.get('/today-workout', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    const weekday = getWeekdayForCountry(user.country);
    const result = getWorkoutForWeekday(weekday);

    let completedToday = false;
    if (result.day !== 'rest') {
      const workoutModel = require('./workoutModel');
      completedToday = await workoutModel.isCompletedToday(req.userId, result.day);
    }

    res.json({ weekday, ...result, completedToday });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to determine workout.' });
  }
});

router.get('/weight-check-status', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user.last_weight_check) return res.json({ due: false });
    const last = new Date(user.last_weight_check);
    const daysSince = (new Date() - last) / (1000 * 60 * 60 * 24);
    res.json({ due: daysSince >= 7 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to check status.' });
  }
});

router.post('/weight-check', authMiddleware, async (req, res) => {
  try {
    const { weight, height } = req.body;
    if (!weight) return res.status(400).json({ message: 'Weight is required.' });
    await userModel.updateWeightCheck(req.userId, weight, height);
    res.json({ message: 'Weight check updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update weight check.' });
  }
});

function sanitize(user) {
  const { password, ...safe } = user;
  return safe;
}

module.exports = router;
const express = require('express');
const jwt = require('jsonwebtoken');
const nutritionModel = require('./nutritionModel');
const userModel = require('./userModel');
const llmClient = require('./llmClient');
const calorieCalc = require('./calorieCalc');

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

// POST /api/nutrition/log  { text: "I drank a 500ml water bottle" }
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Text input required.' });
    }

    const parsed = await llmClient.parseNutritionText(text);
    await nutritionModel.addLog(req.userId, parsed.type, parsed.value, text);

    const totals = await nutritionModel.getTodayTotals(req.userId);
    const user = await userModel.findById(req.userId);

    const calorieTarget = calorieCalc.calculateBaselineCalories(user.current_weight, user.height);
    const waterTarget = calorieCalc.calculateWaterTarget(user.current_weight);

    res.json({
      parsed,
      caloriesLeft: Math.max(calorieTarget - totals.food, 0),
      waterLeft: Math.max(waterTarget - totals.water, 0),
      calorieTarget,
      waterTarget,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to log entry.' });
  }
});

// GET /api/nutrition/status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    const totals = await nutritionModel.getTodayTotals(req.userId);
    const entries = await nutritionModel.getTodayEntries(req.userId);

    const calorieTarget = calorieCalc.calculateBaselineCalories(user.current_weight, user.height);
    const waterTarget = calorieCalc.calculateWaterTarget(user.current_weight);

    res.json({
      caloriesLeft: Math.max(calorieTarget - totals.food, 0),
      waterLeft: Math.max(waterTarget - totals.water, 0),
      calorieTarget,
      waterTarget,
      entries,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch status.' });
  }
});

module.exports = router;
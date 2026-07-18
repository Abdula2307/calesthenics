const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');
const workoutModel = require('./workoutModel');
const skillTree = require('./skillTree');

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

// GET /api/day2/state -> current step, folder, training data, warmups, gatekeeper question
router.get('/state', authMiddleware, async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    const step = user.current_skill_step || 1;
    const stepData = skillTree.getStepData(step);
    const warmups = skillTree.getWarmups(step);

    res.json({
      currentStep: step,
      folder: stepData.folder,
      label: stepData.label,
      training: stepData.training,
      question: stepData.question,
      warmups,
      isMaintenance: !!stepData.isMaintenance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch Day 2 state.' });
  }
});

// POST /api/day2/gatekeeper  { passed: true|false }
router.post('/gatekeeper', authMiddleware, async (req, res) => {
  try {
    const { passed } = req.body;
    if (typeof passed !== 'boolean') {
      return res.status(400).json({ message: 'passed (boolean) is required.' });
    }

    const user = await userModel.findById(req.userId);
    const currentStep = user.current_skill_step || 1;
    const newStep = skillTree.advanceStep(currentStep, passed);

    await new Promise((resolve, reject) => {
      const db = require('./db');
      db.run(`UPDATE users SET current_skill_step = ? WHERE id = ?`, [newStep, req.userId], function (err) {
        if (err) return reject(err);
        resolve();
      });
    });

    await workoutModel.logSession(req.userId, 'day2', passed ? 'leveled_up' : 'locked_in');

    res.json({
      leveledUp: passed && newStep !== currentStep,
      newStep,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to process gatekeeper.' });
  }
});

module.exports = router;
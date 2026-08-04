const db = require('./db');

const workoutModel = {
  logSession: (userId, day, status) => {
    const stmt = db.prepare(`INSERT INTO workout_progress (user_id, day, status) VALUES (?, ?, ?)`);
    const result = stmt.run(userId, day, status);
    return { id: Number(result.lastInsertRowid) };
  },

  getHistory: (userId, day) => {
    const stmt = db.prepare(`SELECT * FROM workout_progress WHERE user_id = ? AND day = ? ORDER BY logged_at DESC LIMIT 20`);
    return stmt.all(userId, day);
  },

  isCompletedToday: (userId, day) => {
    const stmt = db.prepare(`SELECT * FROM workout_progress WHERE user_id = ? AND day = ? AND date(logged_at) = date('now') LIMIT 1`);
    const row = stmt.get(userId, day);
    return !!row;
  },
};

module.exports = workoutModel;

const db = require('./db');

const workoutModel = {
  logSession: (userId, day, status) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO workout_progress (user_id, day, status) VALUES (?, ?, ?)`;
      db.run(sql, [userId, day, status], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    });
  },

  getHistory: (userId, day) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM workout_progress WHERE user_id = ? AND day = ? ORDER BY logged_at DESC LIMIT 20`;
      db.all(sql, [userId, day], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  isCompletedToday: (userId, day) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM workout_progress WHERE user_id = ? AND day = ? AND date(logged_at) = date('now') LIMIT 1`;
      db.get(sql, [userId, day], (err, row) => {
        if (err) return reject(err);
        resolve(!!row);
      });
    });
  },
};

module.exports = workoutModel;
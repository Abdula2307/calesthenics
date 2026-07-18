const db = require('./db');

const nutritionModel = {
  addLog: (userId, type, value, rawText) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO nutrition_logs (user_id, type, value, raw_text) VALUES (?, ?, ?, ?)`;
      db.run(sql, [userId, type, value, rawText], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    });
  },

  getTodayTotals: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT type, SUM(value) as total
        FROM nutrition_logs
        WHERE user_id = ? AND date(logged_at) = date('now')
        GROUP BY type
      `;
      db.all(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        const totals = { food: 0, water: 0 };
        rows.forEach((r) => { totals[r.type] = r.total; });
        resolve(totals);
      });
    });
  },

  getTodayEntries: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM nutrition_logs
        WHERE user_id = ? AND date(logged_at) = date('now')
        ORDER BY logged_at ASC
      `;
      db.all(sql, [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },
};

module.exports = nutritionModel;
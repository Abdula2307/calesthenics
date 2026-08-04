const db = require('./db');

const nutritionModel = {
  addLog: (userId, type, value, rawText) => {
    const stmt = db.prepare(`INSERT INTO nutrition_logs (user_id, type, value, raw_text) VALUES (?, ?, ?, ?)`);
    const result = stmt.run(userId, type, value, rawText);
    return { id: Number(result.lastInsertRowid) };
  },

  getTodayTotals: (userId) => {
    const stmt = db.prepare(`
      SELECT type, SUM(value) as total
      FROM nutrition_logs
      WHERE user_id = ? AND date(logged_at) = date('now')
      GROUP BY type
    `);
    const rows = stmt.all(userId);
    const totals = { food: 0, water: 0 };
    rows.forEach((r) => { totals[r.type] = r.total; });
    return totals;
  },

  getTodayEntries: (userId) => {
    const stmt = db.prepare(`
      SELECT * FROM nutrition_logs
      WHERE user_id = ? AND date(logged_at) = date('now')
      ORDER BY logged_at ASC
    `);
    return stmt.all(userId);
  },
};

module.exports = nutritionModel;

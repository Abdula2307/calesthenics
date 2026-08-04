const db = require('./db');

const userModel = {
  create: (username, hashedPassword, country) => {
    const stmt = db.prepare(`INSERT INTO users (username, password, country) VALUES (?, ?, ?)`);
    const result = stmt.run(username, hashedPassword, country || null);
    return { id: Number(result.lastInsertRowid), username };
  },

  findByUsername: (username) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE username = ?`);
    return stmt.get(username);
  },

  findById: (id) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE id = ?`);
    return stmt.get(id);
  },

  completeOnboarding: (id, weight, height) => {
    const stmt = db.prepare(`UPDATE users SET current_weight = ?, height = ?, onboarded = 1, last_weight_check = CURRENT_TIMESTAMP WHERE id = ?`);
    const result = stmt.run(weight, height, id);
    return { changes: result.changes };
  },

  updateWeight: (id, weight) => {
    const stmt = db.prepare(`UPDATE users SET current_weight = ? WHERE id = ?`);
    const result = stmt.run(weight, id);
    return { changes: result.changes };
  },

  updateWeightCheck: (id, weight, height) => {
    const stmt = height
      ? db.prepare(`UPDATE users SET current_weight = ?, height = ?, last_weight_check = CURRENT_TIMESTAMP WHERE id = ?`)
      : db.prepare(`UPDATE users SET current_weight = ?, last_weight_check = CURRENT_TIMESTAMP WHERE id = ?`);
    const result = height ? stmt.run(weight, height, id) : stmt.run(weight, id);
    return { changes: result.changes };
  },
};

module.exports = userModel;

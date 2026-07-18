const db = require('./db');

const userModel = {
  create: (username, hashedPassword, country) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (username, password, country) VALUES (?, ?, ?)`;
      db.run(sql, [username, hashedPassword, country || null], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, username });
      });
    });
  },

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  completeOnboarding: (id, weight, height) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE users SET current_weight = ?, height = ?, onboarded = 1, last_weight_check = CURRENT_TIMESTAMP WHERE id = ?`;
      db.run(sql, [weight, height, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  updateWeight: (id, weight) => {
    return new Promise((resolve, reject) => {
      db.run(`UPDATE users SET current_weight = ? WHERE id = ?`, [weight, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },

  updateWeightCheck: (id, weight, height) => {
    return new Promise((resolve, reject) => {
      const sql = height
        ? `UPDATE users SET current_weight = ?, height = ?, last_weight_check = CURRENT_TIMESTAMP WHERE id = ?`
        : `UPDATE users SET current_weight = ?, last_weight_check = CURRENT_TIMESTAMP WHERE id = ?`;
      const params = height ? [weight, height, id] : [weight, id];
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      });
    });
  },
};

module.exports = userModel;
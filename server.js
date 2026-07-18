require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const nutritionRoutes = require('./nutritionRoutes');
const day1Routes = require('./day1Routes');
const day2Routes = require('./day2Routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/day1', day1Routes);
app.use('/api/day2', day2Routes);

app.get('/', (req, res) => res.send('Calisthenics API running.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
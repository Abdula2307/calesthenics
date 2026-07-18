function calculateBaselineCalories(weightKg, heightCm) {
  const age = 25;
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return Math.round(bmr * 1.55); // moderate activity, lean aesthetic target — no bulk/cut branching
}

function calculateWaterTarget(weightKg) {
  const baseMl = weightKg * 35;
  const athleticBuffer = 500;
  return Math.round(baseMl + athleticBuffer);
}

module.exports = { calculateBaselineCalories, calculateWaterTarget };
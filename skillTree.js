// Folder 1: Pushing Mastery & Balance (steps 1-6)
// Folder 2: Pulling Power (steps 7-15)
// Step 16: God-Mode maintenance (permanent, after Folder 2 complete)

const STEPS = {
  1: {
    folder: 1,
    label: 'The L-Sit Foundation',
    training: 'Ground L-Sit Hold (Goal: Accumulated 1 Minute)',
    question: 'Did you achieve the 1-minute L-Sit hold today?',
    warmupAdd: 'L-Sit Hold (1 min)',
  },
  2: {
    folder: 1,
    label: 'The Vertical Balance Era',
    training: 'Forearm Handstand & Wall Handstand Practice (Goal: 1 min freestanding across 2 sets)',
    question: 'Did you achieve a stable 1-minute freestanding Handstand today?',
    warmupAdd: 'Handstand Hold (1 min)',
  },
  3: {
    folder: 1,
    label: 'The Press Link',
    training: 'L-Sit to Handstand Press Transitions',
    question: 'Did you achieve a clean, dynamic L-Sit to Handstand Press today?',
    warmupAdd: 'L-Sit to Handstand Press',
  },
  4: {
    folder: 1,
    label: 'The Planche Entry (Frog Pose)',
    training: 'Frog Pose / Crow Stand',
    question: 'Did you achieve a solid Frog Pose balance today?',
    warmupAdd: 'Frog Pose Hold',
  },
  5: {
    folder: 1,
    label: 'Single-Leg Planche',
    training: 'Single-Leg Planche (one leg extended, one tucked)',
    question: 'Did you achieve the Single-Leg Planche hold today?',
    warmupAdd: 'Single-Leg Planche Hold',
  },
  6: {
    folder: 1,
    label: 'Full Planche Mastery',
    training: 'Full Planche Hold (Goal: 5 seconds parallel)',
    question: 'Did you achieve a perfect 5-second Full Planche today?',
    warmupAdd: null,
    completesFolder: 1,
  },
  7: {
    folder: 2,
    label: 'Passive & Active Hang Conditioning',
    training: 'Scapular Pull-ups & Dead Hangs (Goal: 1.5 min continuous dead hang)',
    question: 'Did you achieve the 1.5-minute continuous dead hang today?',
    warmupAdd: 'Dead Hang (1 min)',
  },
  8: {
    folder: 2,
    label: 'The High Chest-to-Bar Pull-up',
    training: 'Strict Chest-to-Bar Pull-ups (Goal: 10 clean reps in one set)',
    question: 'Did you achieve 10 clean strict chest-to-bar pull-ups in one set today?',
    warmupAdd: '5 Chest-to-Bar Pull-ups',
  },
  9: {
    folder: 2,
    label: 'Explosive Belly-Button Pulls',
    training: 'High Explosive Pull-ups (pulling past chest toward belly button)',
    question: 'Did you achieve 3 consecutive belly-button height explosive pull-ups today?',
    warmupAdd: '3 Explosive Pull-ups',
  },
  10: {
    folder: 2,
    label: 'The Jumping & Negative Muscle-Up',
    training: 'Jump into muscle-up + 5-second ultra-slow negative',
    question: 'Did you successfully control 5 ultra-slow, smooth muscle-up negatives today?',
    warmupAdd: '3 Controlled Negatives',
  },
  11: {
    folder: 2,
    label: 'Above the Bar Control (Strict Muscle-Up)',
    training: 'Strict, slow Bar Muscle-Ups (no kipping, no momentum)',
    question: 'Did you achieve 5 strict, consecutive Bar Muscle-Ups today?',
    warmupAdd: '2 Strict Muscle-Ups',
  },
  12: {
    folder: 2,
    label: 'Front Lever Core Compression (Tuck Lever)',
    training: 'Tuck Front Lever Hold (knees tucked, body horizontal)',
    question: 'Did you hold a clean Tuck Front Lever for 20 seconds today?',
    warmupAdd: '10s Tuck Lever Hold',
  },
  13: {
    folder: 2,
    label: 'Advanced Tuck Front Lever Balance',
    training: 'Advanced Tuck Front Lever (hips extended, flat back, knees at 90°)',
    question: 'Did you achieve a perfectly flat-back Advanced Tuck Front Lever hold for 15 seconds today?',
    warmupAdd: '10s Advanced Tuck Hold',
  },
  14: {
    folder: 2,
    label: 'Single-Leg Front Lever',
    training: 'Single-Leg Front Lever Hold (one leg extended, one tucked)',
    question: 'Did you achieve a clean 10-second Single-Leg Front Lever hold per leg today?',
    warmupAdd: 'Single-Leg Lever Holds',
  },
  15: {
    folder: 2,
    label: 'Full Front Lever Mastery',
    training: 'Full Front Lever Hold (Goal: 5 seconds perfectly horizontal, legs locked)',
    question: 'Did you achieve a perfect 5-second Full Front Lever hold today?',
    warmupAdd: null,
    completesFolder: 2,
  },
  16: {
    folder: 3,
    label: 'THE ULTIMATE CALISTHENICS GOD-MODE ROUTINE',
    training: 'Master Pushing Flow (20 reps) + Master Pulling Flow (20 reps)',
    question: 'Did you complete all 20 Pushing Loops and 20 Pulling Loops today with flawless form?',
    warmupAdd: null,
    isMaintenance: true,
  },
};

function getStepData(stepNumber) {
  return STEPS[stepNumber] || STEPS[16]; // clamp to God-Mode if somehow beyond 16
}

// Builds the list of mandatory warmups: all previously mastered steps' warmupAdd, in order.
function getWarmups(currentStep) {
  const warmups = [];
  for (let i = 1; i < currentStep; i++) {
    const step = STEPS[i];
    if (step && step.warmupAdd) warmups.push(step.warmupAdd);
  }
  return warmups;
}

function getFolderForStep(stepNumber) {
  return getStepData(stepNumber).folder;
}

// Applies YES/NO gatekeeper answer, returns the new step number.
function advanceStep(currentStep, passed) {
  const step = getStepData(currentStep);
  if (step.isMaintenance) return currentStep; // Step 16 never advances further
  return passed ? currentStep + 1 : currentStep;
}

module.exports = { STEPS, getStepData, getWarmups, getFolderForStep, advanceStep };
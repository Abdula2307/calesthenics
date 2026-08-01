const RAW_SETS = [
  { label: 'Pull-Up Challenge', reps: '50 total reps', instructions: 'Do as many reps as possible until you hit 50 total. If you get fatigued, DO NOT drop to the floor — hang on the bar, rest 10-20 seconds, then resume. Stay on the bar the entire time until you reach 50.' },
  { label: 'Push-Ups', reps: 'Until failure', instructions: 'Push-ups to absolute failure. Set 1 of 2.' },
  { label: 'Push-Ups', reps: 'Until failure', instructions: 'Push-ups to absolute failure. Set 2 of 2.' },
  { label: 'Arm Superset', reps: '30 + 30, x3 rounds', instructions: '30 Hammer Curls straight into 30 Skull Crushers, repeated 3 times total. No rest between movements.' },
  { label: 'Leg Circuit', reps: '10 / 20 / 25 / 15', instructions: 'Lunges → Squats → Calf Raises → Single-Leg Calf Raises, straight through. Set 1 of 2.' },
  { label: 'Leg Circuit', reps: '10 / 20 / 25 / 15', instructions: 'Lunges → Squats → Calf Raises → Single-Leg Calf Raises, straight through. Set 2 of 2.' },
  { label: 'Forearm Finisher', reps: '20 / 20 / 20', instructions: 'Wrist Extensions → Wrist Flexions → Wrist Rotations, straight through. Set 1 of 2.' },
  { label: 'Forearm Finisher', reps: '20 / 20 / 20', instructions: 'Wrist Extensions → Wrist Flexions → Wrist Rotations, straight through. Set 2 of 2.' },
  { label: 'Ab Superset', reps: '15 / 20 / 30s / 20', instructions: 'Hanging Leg Raises → Bicycle Crunches → Plank Hold → Russian Twists, straight through. Set 1 of 2.' },
  { label: 'Ab Superset', reps: '15 / 20 / 30s / 20', instructions: 'Hanging Leg Raises → Bicycle Crunches → Plank Hold → Russian Twists, straight through. Set 2 of 2.' },
];

export const DAY1_SLIDES = [];
let setCount = 0;
RAW_SETS.forEach((set, i) => {
  setCount++;
  DAY1_SLIDES.push({ type: 'set', ...set, setPosition: setCount, totalSets: RAW_SETS.length });
  if (i !== RAW_SETS.length - 1) {
    DAY1_SLIDES.push({ type: 'rest', seconds: 120, setPosition: setCount, totalSets: RAW_SETS.length });
  } else {
    DAY1_SLIDES[DAY1_SLIDES.length - 1].isLast = true;
  }
});

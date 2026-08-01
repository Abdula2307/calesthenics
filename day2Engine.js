export function buildDay2Slides(state) {
  const rawSets = [];

  const push = (label, reps, instructions) => {
    rawSets.push({ label, reps, instructions });
  };

  if (state.isMaintenance) {
    push('Pike Push-Ups', 'Until failure', 'Set 1 of 3 — go until absolute failure.');
    push('Pike Push-Ups', 'Until failure', 'Set 2 of 3 — go until absolute failure.');
    push('Pike Push-Ups', 'Until failure', 'Set 3 of 3 — go until absolute failure.');
    push('Master Pushing Flow', '20 reps total', '[L-Sit 5s] → [Handstand 5s] → [Planche 5s] → [Return to L-Sit]. No dropping within a rep.');
    push('Master Pulling Flow', '20 reps total', '[Bar Muscle-Up] → [Full Front Lever 5s] → [Return to Dead Hang].');
  } else {
    push('Pike Push-Ups', 'Until failure', 'Set 1 of 3 — go until absolute failure.');
    push('Pike Push-Ups', 'Until failure', 'Set 2 of 3 — go until absolute failure.');
    push('Pike Push-Ups', 'Until failure', 'Set 3 of 3 — go until absolute failure.');

    if (state.folder === 2) {
      push('Infinite Flow Loop', '10 reps', '1 Rep = [L-Sit 5s] → [Handstand 5s] → [Planche 5s] → [Return to L-Sit]. No dropping between holds.');
    }

    if (state.warmups && state.warmups.length > 0) {
      state.warmups.forEach((w) => {
        push(w, 'Mastered warmup', 'Hold/complete this mastered move before today\'s main training.');
      });
    }

    push(`Step ${state.currentStep}`, 'Today\'s target', state.training);
  }

  const slides = [];
  rawSets.forEach((set, i) => {
    slides.push({ type: 'set', ...set, setPosition: i + 1, totalSets: rawSets.length });
    if (i !== rawSets.length - 1) {
      slides.push({ type: 'rest', seconds: 120, setPosition: i + 1, totalSets: rawSets.length });
    } else {
      slides[slides.length - 1].isLast = true;
    }
  });

  return slides;
}

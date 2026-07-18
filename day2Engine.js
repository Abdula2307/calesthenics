// Flattens a Day 2 state into a slide-by-slide sequence, same pattern as Day 1:
// Set → Done → 2min Rest → next Set. Last set triggers the gatekeeper instead of rest.

export function buildDay2Slides(state) {
  const slides = [];

  const pushSet = (label, instructions) => {
    slides.push({ type: 'set', label, instructions });
  };
  const pushRest = () => {
    slides.push({ type: 'rest', seconds: 120 });
  };

  if (state.isMaintenance) {
    pushSet('Pike Push-Ups to Failure', 'Set 1 of 3 — go until absolute failure.');
    pushRest();
    pushSet('Pike Push-Ups to Failure', 'Set 2 of 3 — go until absolute failure.');
    pushRest();
    pushSet('Pike Push-Ups to Failure', 'Set 3 of 3 — go until absolute failure.');
    pushRest();
    pushSet(
      'Master Pushing Flow (20 Reps Total)',
      '[L-Sit 5s] → [Press up to Handstand 5s] → [Lower to Planche 5s] → [Return to L-Sit]. No dropping within a rep.'
    );
    pushRest();
    pushSet(
      'Master Pulling Flow (20 Reps Total)',
      '[Bar Muscle-Up] → [Lower to Full Front Lever 5s] → [Return to Dead Hang].'
    );
    slides[slides.length - 1].isLast = true;
    return slides;
  }

  // Step 0 — compulsory pike push-ups, always first
  pushSet('Pike Push-Ups to Failure', 'Set 1 of 3 — go until absolute failure.');
  pushRest();
  pushSet('Pike Push-Ups to Failure', 'Set 2 of 3 — go until absolute failure.');
  pushRest();
  pushSet('Pike Push-Ups to Failure', 'Set 3 of 3 — go until absolute failure.');
  pushRest();

  // Folder 2 mandatory warmup — the Infinite Flow Loop
  if (state.folder === 2) {
    pushSet(
      'The 10-Rep Infinite Flow Loop',
      '1 Rep = [L-Sit 5s] → [Press to Handstand 5s] → [Lower to Planche 5s] → [Return to L-Sit]. No dropping between holds within a rep. Complete 10 reps.'
    );
    pushRest();
  }

  // Every previously mastered move — each gets its own set + rest
  if (state.warmups && state.warmups.length > 0) {
    state.warmups.forEach((w) => {
      pushSet(w, 'Mastered warmup — hold/complete this before moving to today\'s main training.');
      pushRest();
    });
  }

  // Main training for the current step — last slide, no rest after, triggers gatekeeper
  pushSet(`Step ${state.currentStep}: ${state.label}`, state.training);
  slides[slides.length - 1].isLast = true;

  return slides;
}
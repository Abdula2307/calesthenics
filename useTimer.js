import { useEffect, useState, useCallback } from 'react';

// Reusable countdown hook — RestTimer.js can use this instead of managing
// its own useState/useEffect if you want to DRY it up later.
export default function useTimer(initialSeconds, onComplete) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, isRunning]);

  const reset = useCallback((newSeconds = initialSeconds) => {
    setTimeLeft(newSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return { timeLeft, minutes, seconds, isRunning, reset, pause, resume };
}
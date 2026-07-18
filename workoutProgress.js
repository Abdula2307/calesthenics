import AsyncStorage from '@react-native-async-storage/async-storage';

function todayKey(day) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `workout_progress_${day}_${today}`;
}

export async function saveProgress(day, index) {
  try {
    await AsyncStorage.setItem(todayKey(day), JSON.stringify({ index }));
  } catch (err) {
    console.log('Failed to save workout progress', err.message);
  }
}

export async function loadProgress(day) {
  try {
    const raw = await AsyncStorage.getItem(todayKey(day));
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return parsed.index || 0;
  } catch (err) {
    return 0;
  }
}

export async function clearProgress(day) {
  try {
    await AsyncStorage.removeItem(todayKey(day));
  } catch (err) {
    console.log('Failed to clear workout progress', err.message);
  }
}
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from './apiClient';
import RestTimer from './RestTimer';
import { DAY1_SLIDES } from './day1Engine';
import { saveProgress, loadProgress, clearProgress } from './workoutProgress';

export default function Day1WorkoutScreen({ navigation }) {
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const savedIndex = await loadProgress('day1');
      setIndex(Math.min(savedIndex, DAY1_SLIDES.length - 1));
      setReady(true);
    })();
  }, []);

  const advance = async () => {
    if (index + 1 >= DAY1_SLIDES.length) {
      finishWorkout();
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    await saveProgress('day1', nextIndex);
  };

  const finishWorkout = async () => {
    try {
      await apiClient.post('/day1/complete');
    } catch (err) {
      console.log('Failed to log Day 1 completion', err.message);
    } finally {
      await clearProgress('day1');
      navigation.replace('Dashboard');
    }
  };

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e63946" size="large" />
      </View>
    );
  }

  const slide = DAY1_SLIDES[index];

  if (slide.type === 'rest') {
    return <RestTimer seconds={slide.seconds} onComplete={advance} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{slide.label}</Text>
      <Text style={styles.instructions}>{slide.instructions}</Text>
      <TouchableOpacity style={styles.btn} onPress={advance}>
        <Text style={styles.btnText}>{slide.isLast ? 'Complete Workout' : 'Done'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', padding: 24 },
  center: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
  instructions: { color: '#ccc', fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 34, paddingHorizontal: 8 },
  btn: { backgroundColor: '#e63946', borderRadius: 10, paddingHorizontal: 40, paddingVertical: 16 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
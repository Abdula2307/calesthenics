import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from './apiClient';
import RestTimer from './RestTimer';
import ProgressBar from './ProgressBar';
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
        <ActivityIndicator color="#c6ff1a" size="large" />
      </View>
    );
  }

  const slide = DAY1_SLIDES[index];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DAY 1 WORKOUT</Text>
      <Text style={styles.subtitle}>
        {slide.type === 'rest' ? 'RESTING' : `SET ${slide.setPosition}/${slide.totalSets}`} ({slide.label})
      </Text>

      <ProgressBar current={slide.setPosition} total={slide.totalSets} />

      {slide.type === 'rest' ? (
        <RestTimer
          seconds={slide.seconds}
          onComplete={advance}
          completedSetNumber={slide.setPosition}
          nextSetNumber={slide.setPosition + 1}
        />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{slide.label.toUpperCase()}</Text>
            <View style={styles.iconWrap}>
              <Ionicons name="barbell-outline" size={64} color="#333" />
            </View>
            <Text style={styles.explanation}>{slide.instructions}</Text>
          </View>

          <Text style={styles.recordTitle}>REPS</Text>
          <View style={styles.repsBox}>
            <Ionicons name="list-outline" size={18} color="#c6ff1a" style={{ marginRight: 10 }} />
            <Text style={styles.repsText}>{slide.reps}</Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={advance}>
            <Text style={styles.btnText}>{slide.isLast ? 'Complete Workout' : 'Done'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const LIME = '#c6ff1a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: 50, paddingHorizontal: 4 },
  center: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  subtitle: { color: '#999', fontSize: 13, textAlign: 'center', marginBottom: 16 },
  card: { backgroundColor: '#141414', borderRadius: 16, borderWidth: 1, borderColor: '#242424', marginHorizontal: 20, padding: 18, marginBottom: 24 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5, marginBottom: 14 },
  iconWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  explanation: { color: '#bbb', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  recordTitle: { color: '#fff', fontSize: 15, fontWeight: '800', textAlign: 'center', marginBottom: 14, letterSpacing: 0.5 },
  repsBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', borderWidth: 1, borderColor: LIME, borderRadius: 12, marginHorizontal: 20, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 26 },
  repsText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btn: { backgroundColor: LIME, borderRadius: 12, marginHorizontal: 20, paddingVertical: 17, alignItems: 'center' },
  btnText: { color: '#0a0a0a', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
});

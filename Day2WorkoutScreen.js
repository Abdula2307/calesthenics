import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from './apiClient';
import RestTimer from './RestTimer';
import GatekeeperModal from './GatekeeperModal';
import { buildDay2Slides } from './day2Engine';
import { saveProgress, loadProgress, clearProgress } from './workoutProgress';

export default function Day2WorkoutScreen({ navigation }) {
  const [state, setState] = useState(null);
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showGatekeeper, setShowGatekeeper] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);

  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      const res = await apiClient.get('/day2/state');
      const builtSlides = buildDay2Slides(res.data);
      const savedIndex = await loadProgress('day2');

      setState(res.data);
      setSlides(builtSlides);
      setIndex(Math.min(savedIndex, builtSlides.length - 1));
    } catch (err) {
      console.log('Failed to fetch Day 2 state', err.message);
    } finally {
      setLoading(false);
    }
  };

  const advance = async () => {
    const current = slides[index];
    if (current?.isLast) {
      setShowGatekeeper(true);
      return;
    }
    const nextIndex = index + 1;
    setIndex(nextIndex);
    await saveProgress('day2', nextIndex);
  };

  const handleAnswer = async (passed) => {
    if (passed === null) {
      setShowGatekeeper(false);
      setLeveledUp(false);
      await clearProgress('day2');
      navigation.replace('Dashboard');
      return;
    }
    try {
      const res = await apiClient.post('/day2/gatekeeper', { passed });
      if (res.data.leveledUp) {
        setLeveledUp(true);
      } else {
        setShowGatekeeper(false);
        await clearProgress('day2');
        navigation.replace('Dashboard');
      }
    } catch (err) {
      console.log('Gatekeeper submit failed', err.message);
      setShowGatekeeper(false);
    }
  };

  if (loading || !state || slides.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#e63946" size="large" />
      </View>
    );
  }

  const slide = slides[index];

  if (slide.type === 'rest') {
    return (
      <>
        <RestTimer seconds={slide.seconds} onComplete={advance} />
        <GatekeeperModal visible={showGatekeeper} question={state.question} onAnswer={handleAnswer} leveledUp={leveledUp} />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tag}>{state.isMaintenance ? 'GOD-MODE ROUTINE' : `Folder ${state.folder}`}</Text>
      <Text style={styles.title}>{slide.label}</Text>
      {slide.instructions ? <Text style={styles.instructions}>{slide.instructions}</Text> : null}

      <TouchableOpacity style={styles.btn} onPress={advance}>
        <Text style={styles.btnText}>{slide.isLast ? 'Finish Session' : 'Done'}</Text>
      </TouchableOpacity>

      <GatekeeperModal visible={showGatekeeper} question={state.question} onAnswer={handleAnswer} leveledUp={leveledUp} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', padding: 24 },
  center: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  tag: { color: '#e63946', fontSize: 14, fontWeight: '800', letterSpacing: 2, marginBottom: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
  instructions: { color: '#aaa', fontSize: 14, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  btn: { backgroundColor: '#e63946', borderRadius: 10, paddingHorizontal: 50, paddingVertical: 18 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});
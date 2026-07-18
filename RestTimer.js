import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayRestKey() {
  const today = new Date().toISOString().split('T')[0];
  return `rest_timer_end_${today}`;
}

export default function RestTimer({ seconds = 120, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [ready, setReady] = useState(false);
  const endTimeRef = useRef(null);

  useEffect(() => {
    (async () => {
      const key = todayRestKey();
      const savedEnd = await AsyncStorage.getItem(key);

      let endTime;
      if (savedEnd) {
        endTime = parseInt(savedEnd, 10);
      } else {
        endTime = Date.now() + seconds * 1000;
        await AsyncStorage.setItem(key, endTime.toString());
      }

      endTimeRef.current = endTime;
      const remaining = Math.max(Math.ceil((endTime - Date.now()) / 1000), 0);
      setTimeLeft(remaining);
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (timeLeft <= 0) {
      AsyncStorage.removeItem(todayRestKey());
      onComplete?.();
      return;
    }
    const interval = setInterval(() => {
      const remaining = Math.max(Math.ceil((endTimeRef.current - Date.now()) / 1000), 0);
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, ready]);

  if (!ready) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>REST</Text>
      <Text style={styles.timer}>
        {mins}:{secs.toString().padStart(2, '0')}
      </Text>
      <Text style={styles.hint}>Auto-advancing when timer hits 0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  label: { color: '#e63946', fontSize: 16, fontWeight: '800', letterSpacing: 3, marginBottom: 10 },
  timer: { color: '#fff', fontSize: 64, fontWeight: '900' },
  hint: { color: '#666', fontSize: 12, marginTop: 20 },
});
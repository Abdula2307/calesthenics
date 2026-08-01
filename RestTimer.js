import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayRestKey() {
  const today = new Date().toISOString().split('T')[0];
  return `rest_timer_end_${today}`;
}

export default function RestTimer({ seconds = 120, onComplete, completedSetNumber, nextSetNumber }) {
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

  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = seconds > 0 ? timeLeft / seconds : 0;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <View style={styles.container}>
      {completedSetNumber ? (
        <Text style={styles.completeText}>SET {completedSetNumber} COMPLETE!</Text>
      ) : null}

      <View style={styles.ringWrap}>
        <Svg width={size} height={size}>
          <Circle stroke="#242424" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
          <Circle
            stroke="#c6ff1a"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>
        <View style={styles.centerText}>
          <Text style={styles.label}>REST TIMER</Text>
          <Text style={styles.timer}>
            {mins}:{secs.toString().padStart(2, '0')}
          </Text>
        </View>
      </View>

      {nextSetNumber ? (
        <Text style={styles.prepareText}>PREPARE FOR SET {nextSetNumber}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  completeText: { color: '#c6ff1a', fontSize: 18, fontWeight: '900', letterSpacing: 0.5, marginBottom: 30 },
  ringWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  centerText: { position: 'absolute', alignItems: 'center' },
  label: { color: '#999', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  timer: { color: '#fff', fontSize: 52, fontWeight: '900' },
  prepareText: { color: '#888', fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
});

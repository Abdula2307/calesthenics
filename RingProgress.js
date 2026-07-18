import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

export default function RingProgress({ label, current, target, color, unit }) {
  const size = 130;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#1a1a1a"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
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
        <Text style={styles.value}>{current}</Text>
        <Text style={styles.unit}>{unit} left</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  centerText: { position: 'absolute', top: 45, alignItems: 'center' },
  value: { color: '#fff', fontSize: 22, fontWeight: '800' },
  unit: { color: '#888', fontSize: 11 },
  label: { color: '#aaa', fontSize: 13, marginTop: 8, fontWeight: '600' },
});
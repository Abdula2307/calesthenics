import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ current, total }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.segment, i < current ? styles.segmentDone : styles.segmentTodo]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 5, paddingHorizontal: 20, marginBottom: 24 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
  segmentDone: { backgroundColor: '#c6ff1a' },
  segmentTodo: { backgroundColor: '#2a2a2a' },
});

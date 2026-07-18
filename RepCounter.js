import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RepCounter({ label, count, target, onIncrement, onNext, instructions }) {
  const isComplete = count >= target;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {instructions ? <Text style={styles.instructions}>{instructions}</Text> : null}

      <Text style={styles.counter}>
        {count}/{target}
      </Text>

      <TouchableOpacity
        style={[styles.tapBtn, isComplete && styles.tapBtnDisabled]}
        onPress={onIncrement}
        disabled={isComplete}
      >
        <Text style={styles.tapText}>+1 REP</Text>
      </TouchableOpacity>

      {isComplete && (
        <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
          <Text style={styles.nextText}>Next →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', padding: 24 },
  label: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  instructions: { color: '#aaa', fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 20 },
  counter: { color: '#e63946', fontSize: 56, fontWeight: '900', marginVertical: 30 },
  tapBtn: { backgroundColor: '#1a1a1a', borderWidth: 2, borderColor: '#e63946', borderRadius: 100, width: 160, height: 160, justifyContent: 'center', alignItems: 'center' },
  tapBtnDisabled: { opacity: 0.4 },
  tapText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  nextBtn: { backgroundColor: '#e63946', borderRadius: 10, paddingHorizontal: 40, paddingVertical: 14, marginTop: 30 },
  nextText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
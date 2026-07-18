import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GatekeeperModal({ visible, question, onAnswer, leveledUp }) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {leveledUp ? (
            <>
              <Text style={styles.levelUpText}>LEVEL UP!</Text>
              <Text style={styles.subtitle}>
                The AI has added your mastered move to your mandatory warmup and unlocked the next variation.
              </Text>
              <TouchableOpacity style={styles.continueBtn} onPress={() => onAnswer(null)}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.header}>Workout Complete!</Text>
              <Text style={styles.question}>{question}</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.answerBtn, styles.noBtn]} onPress={() => onAnswer(false)}>
                  <Text style={styles.answerText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answerBtn, styles.yesBtn]} onPress={() => onAnswer(true)}>
                  <Text style={styles.answerText}>YES</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 28, width: '100%', alignItems: 'center' },
  header: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
  question: { color: '#ccc', fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  btnRow: { flexDirection: 'row', gap: 16 },
  answerBtn: { paddingVertical: 16, paddingHorizontal: 36, borderRadius: 10 },
  noBtn: { backgroundColor: '#333' },
  yesBtn: { backgroundColor: '#e63946' },
  answerText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  levelUpText: { color: '#e63946', fontSize: 30, fontWeight: '900', marginBottom: 16, letterSpacing: 2 },
  subtitle: { color: '#ccc', fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 26 },
  continueBtn: { backgroundColor: '#e63946', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40 },
  continueText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
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
                Your mastered move has been added to your warmup, and the next skill is unlocked.
              </Text>
              <TouchableOpacity style={styles.continueBtn} onPress={() => onAnswer(null)}>
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.header}>SESSION COMPLETE</Text>
              <Text style={styles.question}>{question}</Text>
              <View style={styles.btnRow}>
                <TouchableOpacity style={[styles.answerBtn, styles.yesBtn]} onPress={() => onAnswer(true)}>
                  <Text style={styles.answerText}>YES</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.answerBtn, styles.noBtn]} onPress={() => onAnswer(false)}>
                  <Text style={styles.answerText}>NO</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const LIME = '#c6ff1a';
const RED = '#ff3b3b';

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#141414', borderRadius: 18, borderWidth: 1, borderColor: '#242424', padding: 26, width: '100%', alignItems: 'center' },
  header: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 0.5, marginBottom: 18, textAlign: 'center' },
  question: { color: '#ccc', fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 26, lineHeight: 22, textTransform: 'uppercase' },
  btnRow: { flexDirection: 'row', gap: 12, width: '100%' },
  answerBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  yesBtn: { backgroundColor: LIME },
  noBtn: { backgroundColor: RED },
  answerText: { color: '#0a0a0a', fontWeight: '900', fontSize: 15, letterSpacing: 0.5 },
  levelUpText: { color: LIME, fontSize: 28, fontWeight: '900', marginBottom: 16, letterSpacing: 1 },
  subtitle: { color: '#ccc', fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  continueBtn: { backgroundColor: LIME, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 40 },
  continueText: { color: '#0a0a0a', fontWeight: '900', fontSize: 15 },
});

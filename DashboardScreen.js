import { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from './apiClient';
import RingProgress from './RingProgress';
import ChatBubble from './ChatBubble';

export default function DashboardScreen({ navigation }) {
  const [status, setStatus] = useState({ caloriesLeft: 0, waterLeft: 0, calorieTarget: 0, waterTarget: 0 });
  const [messages, setMessages] = useState([
    { id: 'welcome', text: "Hey! Tell me what you ate or drank and I'll log it for you.", isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [checkDue, setCheckDue] = useState(false);
  const [checkWeight, setCheckWeight] = useState('');
  const [checkHeight, setCheckHeight] = useState('');
  const listRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const res = await apiClient.get('/nutrition/status');
      setStatus(res.data);
    } catch (err) {
      console.log('Status fetch failed', err.message);
    }
  };

  const fetchTodayWorkout = async () => {
    try {
      const res = await apiClient.get('/user/today-workout');
      setTodayWorkout(res.data);
    } catch (err) {
      console.log('Today workout fetch failed', err.message);
    }
  };

  const fetchCheckStatus = async () => {
    try {
      const res = await apiClient.get('/user/weight-check-status');
      setCheckDue(res.data.due);
    } catch (err) {
      console.log('Weight check status failed', err.message);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTodayWorkout();
    fetchCheckStatus();
  }, []);

  const submitWeightCheck = async () => {
    if (!checkWeight) {
      Alert.alert('Missing info', 'Enter your current weight.');
      return;
    }
    try {
      await apiClient.post('/user/weight-check', {
        weight: parseInt(checkWeight, 10),
        height: checkHeight ? parseInt(checkHeight, 10) : undefined,
      });
      setCheckDue(false);
      setCheckWeight('');
      setCheckHeight('');
      fetchStatus();
    } catch (err) {
      Alert.alert('Error', 'Failed to save weight check.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg = { id: Date.now().toString(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    const textToSend = input;
    setInput('');
    setSending(true);

    try {
      const res = await apiClient.post('/nutrition/log', { text: textToSend });
      const { reply, caloriesLeft, waterLeft, calorieTarget, waterTarget } = res.data;
      setStatus({ caloriesLeft, waterLeft, calorieTarget, waterTarget });

      setMessages((prev) => [...prev, { id: Date.now().toString() + 'ai', text: reply, isUser: false }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'err', text: "Hmm, couldn't catch that — mind rephrasing?", isUser: false },
      ]);
    } finally {
      setSending(false);
    }
  };

  const goToWorkout = () => {
    if (!todayWorkout) return;
    if (todayWorkout.day === 'day1') navigation.navigate('Day1Workout');
    else if (todayWorkout.day === 'day2') navigation.navigate('Day2Workout');
  };

  const caloriesEaten = status.calorieTarget - status.caloriesLeft;
  const waterDrankL = ((status.waterTarget - status.waterLeft) / 1000).toFixed(1);
  const waterTargetL = (status.waterTarget / 1000).toFixed(1);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble text={item.text} isUser={item.isUser} />}
        ListHeaderComponent={
          <View>
            <Text style={styles.brand}>BARBELLION</Text>
            <Text style={styles.sectionTitle}>YOUR PROGRESS</Text>

            <View style={styles.ringsRow}>
              <View style={styles.ringBlock}>
                <View style={styles.ringLabelRow}>
                  <Ionicons name="flame" size={14} color="#c6ff1a" />
                  <Text style={styles.ringLabel}>CALORIES</Text>
                </View>
                <RingProgress current={caloriesEaten} target={status.calorieTarget} color="#c6ff1a" displayValue={caloriesEaten} displayUnit={`/ ${status.calorieTarget} kcal`} />
              </View>

              <View style={styles.ringBlock}>
                <View style={styles.ringLabelRow}>
                  <Ionicons name="water" size={14} color="#3ac1ff" />
                  <Text style={styles.ringLabel}>WATER</Text>
                </View>
                <RingProgress current={waterDrankL} target={waterTargetL} color="#3ac1ff" displayValue={waterDrankL} displayUnit={`/ ${waterTargetL} L`} />
              </View>
            </View>

            {todayWorkout && (
              <View style={styles.workoutSection}>
                <Text style={styles.sectionTitle}>TODAY'S WORKOUT</Text>
                {todayWorkout.day === 'rest' ? (
                  <Text style={styles.restText}>Rest Day — recover up 💤</Text>
                ) : todayWorkout.completedToday ? (
                  <Text style={styles.restText}>Today's workout is done. Come back tomorrow 💪</Text>
                ) : (
                  <>
                    <TouchableOpacity style={styles.workoutBtn} onPress={goToWorkout}>
                      <Text style={styles.workoutText}>START TODAY'S WORKOUT</Text>
                    </TouchableOpacity>
                    <Text style={styles.workoutSubtext}>
                      You have {todayWorkout.label.toLowerCase()} scheduled.
                    </Text>
                  </>
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>AI NUTRITION CHAT</Text>
          </View>
        }
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask AI about your food..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
          <Ionicons name="send" size={18} color={sending ? '#555' : '#c6ff1a'} />
        </TouchableOpacity>
      </View>

      <Modal visible={checkDue} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Check-In</Text>
            <Text style={styles.cardSubtitle}>Update your weight so your targets stay accurate.</Text>

            <TextInput
              style={styles.cardInput}
              keyboardType="numeric"
              placeholder="Current weight (kg)"
              placeholderTextColor="#666"
              value={checkWeight}
              onChangeText={setCheckWeight}
            />
            <TextInput
              style={styles.cardInput}
              keyboardType="numeric"
              placeholder="Height (cm) — optional"
              placeholderTextColor="#666"
              value={checkHeight}
              onChangeText={setCheckHeight}
            />

            <TouchableOpacity style={styles.cardBtn} onPress={submitWeightCheck}>
              <Text style={styles.cardBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const LIME = '#c6ff1a';
const BLUE = '#3ac1ff';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  scrollContent: { paddingBottom: 16 },
  brand: { color: '#fff', fontSize: 30, fontWeight: '900', textAlign: 'center', letterSpacing: 1, marginTop: 20, marginBottom: 20 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5, marginTop: 20, marginBottom: 14 },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-evenly', paddingHorizontal: 16 },
  ringBlock: { alignItems: 'center' },
  ringLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 4 },
  ringLabel: { color: '#ccc', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  workoutSection: { paddingHorizontal: 20, alignItems: 'center' },
  workoutBtn: { backgroundColor: LIME, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 24, width: '100%', alignItems: 'center' },
  workoutText: { color: '#0a0a0a', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  workoutSubtext: { color: '#888', fontSize: 12, marginTop: 10, textAlign: 'center' },
  restText: { color: '#888', textAlign: 'center', fontSize: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#1a1a1a', backgroundColor: '#0a0a0a' },
  input: { flex: 1, backgroundColor: '#161616', color: '#fff', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, borderWidth: 1, borderColor: '#2a2a2a' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#161616', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#2a2a2a' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 24, width: '100%' },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  cardSubtitle: { color: '#aaa', fontSize: 13, marginBottom: 20 },
  cardInput: { backgroundColor: '#161616', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2a2a2a' },
  cardBtn: { backgroundColor: LIME, borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 6 },
  cardBtnText: { color: '#0a0a0a', fontWeight: '800' },
});

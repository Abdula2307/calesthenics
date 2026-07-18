import { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import apiClient from './apiClient';
import RingProgress from './RingProgress';
import ChatBubble from './ChatBubble';

export default function DashboardScreen({ navigation }) {
  const [status, setStatus] = useState({ caloriesLeft: 0, waterLeft: 0, calorieTarget: 0, waterTarget: 0 });
  const [messages, setMessages] = useState([
    { id: 'welcome', text: "Tell me what you ate or drank — e.g. '3 scrambled eggs and toast'", isUser: false },
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
      const { parsed, caloriesLeft, waterLeft, calorieTarget, waterTarget } = res.data;
      setStatus({ caloriesLeft, waterLeft, calorieTarget, waterTarget });

      const confirmText =
        parsed.type === 'water'
          ? `Logged ${parsed.value}ml of water.`
          : `Logged ~${parsed.value} calories.`;

      setMessages((prev) => [...prev, { id: Date.now().toString() + 'ai', text: confirmText, isUser: false }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + 'err', text: "Couldn't log that, try rephrasing.", isUser: false },
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.ringsRow}>
        <RingProgress label="Calories" current={status.caloriesLeft} target={status.calorieTarget} color="#e63946" unit="kcal" />
        <RingProgress label="Water" current={status.waterLeft} target={status.waterTarget} color="#3a86ff" unit="ml" />
      </View>

      {todayWorkout && (
        <View style={styles.workoutBanner}>
          {todayWorkout.day === 'rest' ? (
            <Text style={styles.restText}>Rest Day — recover up 💤</Text>
          ) : todayWorkout.completedToday ? (
            <Text style={styles.restText}>Today's workout is done. Come back tomorrow 💪</Text>
          ) : (
            <TouchableOpacity style={styles.workoutBtn} onPress={goToWorkout}>
              <Text style={styles.workoutText}>Start {todayWorkout.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble text={item.text} isUser={item.isUser} />}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="I ate / drank..."
          placeholderTextColor="#888"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending}>
          <Text style={styles.sendText}>{sending ? '...' : 'Send'}</Text>
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
              placeholderTextColor="#888"
              value={checkWeight}
              onChangeText={setCheckWeight}
            />
            <TextInput
              style={styles.cardInput}
              keyboardType="numeric"
              placeholder="Height (cm) — optional"
              placeholderTextColor="#888"
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  ringsRow: { flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 20 },
  workoutBanner: { paddingHorizontal: 16, marginTop: 16 },
  workoutBtn: { backgroundColor: '#e63946', padding: 14, borderRadius: 10, alignItems: 'center' },
  workoutText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  restText: { color: '#888', textAlign: 'center', fontSize: 14 },
  chatList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  inputRow: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#1a1a1a' },
  input: { flex: 1, backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 12 },
  sendBtn: { backgroundColor: '#e63946', borderRadius: 10, paddingHorizontal: 18, justifyContent: 'center' },
  sendText: { color: '#fff', fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card: { backgroundColor: '#111', borderRadius: 16, padding: 24, width: '100%' },
  cardTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  cardSubtitle: { color: '#aaa', fontSize: 13, marginBottom: 20 },
  cardInput: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 12 },
  cardBtn: { backgroundColor: '#e63946', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 6 },
  cardBtnText: { color: '#fff', fontWeight: '700' },
});
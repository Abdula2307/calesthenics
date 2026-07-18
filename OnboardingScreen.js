import { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiClient from './apiClient';
import { AuthContext } from './AppNavigator';

export default function OnboardingScreen() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  const { setNeedsOnboarding } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!weight || !height) {
      Alert.alert('Missing info', 'Fill in weight and height.');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/user/onboarding', {
        current_weight: parseInt(weight, 10),
        height: parseInt(height, 10),
      });
      setNeedsOnboarding(false);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's set you up</Text>

      <Text style={styles.label}>Current Weight (kg)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 70"
        placeholderTextColor="#888"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>Height (cm)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 175"
        placeholderTextColor="#888"
        value={height}
        onChangeText={setHeight}
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? '...' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 24, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', marginBottom: 30 },
  label: { color: '#aaa', fontSize: 14, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 14, fontSize: 16 },
  submitBtn: { backgroundColor: '#e63946', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 30 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
import { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      <Text style={styles.brand}>BARBELLION</Text>

      <View style={styles.spacer} />

      <Text style={styles.title}>YOUR PHYSICAL PROFILE</Text>

      <Text style={styles.label}>CURRENT WEIGHT (KG)</Text>
      <View style={styles.inputRow}>
        <Ionicons name="scale-outline" size={18} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="70"
          placeholderTextColor="#666"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <Text style={styles.label}>CURRENT HEIGHT (CM)</Text>
      <View style={styles.inputRow}>
        <Ionicons name="resize-outline" size={18} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="175"
          placeholderTextColor="#666"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? '...' : 'CONTINUE TO GOALS'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const LIME = '#c6ff1a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 24, paddingTop: 60 },
  brand: { color: '#fff', fontSize: 34, fontWeight: '900', textAlign: 'center', letterSpacing: 1 },
  spacer: { height: 100 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5, marginBottom: 30 },
  label: { color: '#999', fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 10, borderWidth: 1, borderColor: '#2a2a2a', paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', paddingVertical: 14, fontSize: 15 },
  submitBtn: { backgroundColor: LIME, borderRadius: 10, padding: 17, alignItems: 'center', marginTop: 32 },
  submitText: { color: '#0a0a0a', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
});

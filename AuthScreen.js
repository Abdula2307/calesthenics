import { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiClient, { setAuthToken } from './apiClient';
import { AuthContext } from './AppNavigator';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUserToken, setNeedsOnboarding } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!username || !password || (isSignUp && !country)) {
      Alert.alert('Missing info', isSignUp ? 'Enter username, password, and country.' : 'Enter a username and password.');
      return;
    }

    if (isSignUp) {
      const hasMinLength = password.length >= 8;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (!hasMinLength || !hasLetter || !hasNumber) {
        Alert.alert('Weak password', 'Password must be at least 8 characters and include both letters and numbers.');
        return;
      }
    }

    setLoading(true);
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login';
      const body = isSignUp ? { username, password, country } : { username, password };
      const res = await apiClient.post(endpoint, body);
      const { token, isNewUser } = res.data;
      setAuthToken(token);
      setNeedsOnboarding(!!isNewUser);
      setUserToken(token);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CALISTHENICS</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setIsSignUp(true)} style={[styles.toggleBtn, isSignUp && styles.toggleActive]}>
          <Text style={styles.toggleText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignUp(false)} style={[styles.toggleBtn, !isSignUp && styles.toggleActive]}>
          <Text style={styles.toggleText}>Log In</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {isSignUp && (
        <TextInput
          style={styles.input}
          placeholder="Country (e.g. Pakistan)"
          placeholderTextColor="#888"
          value={country}
          onChangeText={setCountry}
        />
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>{loading ? '...' : isSignUp ? 'Create Account' : 'Log In'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', padding: 24 },
  title: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 40, letterSpacing: 2 },
  toggleRow: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 10, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  toggleActive: { backgroundColor: '#e63946' },
  toggleText: { color: '#fff', fontWeight: '600' },
  input: { backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 16 },
  submitBtn: { backgroundColor: '#e63946', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
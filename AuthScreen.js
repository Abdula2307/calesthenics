import { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient, { setAuthToken } from './apiClient';
import { AuthContext } from './AppNavigator';

const COUNTRIES = [
  { name: 'United States', flag: '🇺🇸' },
  { name: 'Pakistan', flag: '🇵🇰' },
  { name: 'India', flag: '🇮🇳' },
  { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'Canada', flag: '🇨🇦' },
  { name: 'Australia', flag: '🇦🇺' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', flag: '🇸🇦' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'China', flag: '🇨🇳' },
  { name: 'Japan', flag: '🇯🇵' },
  { name: 'Bangladesh', flag: '🇧🇩' },
  { name: 'Nigeria', flag: '🇳🇬' },
  { name: 'Egypt', flag: '🇪🇬' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Brazil', flag: '🇧🇷' },
  { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Russia', flag: '🇷🇺' },
  { name: 'South Africa', flag: '🇿🇦' },
  { name: 'Malaysia', flag: '🇲🇾' },
  { name: 'Philippines', flag: '🇵🇭' },
];

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUserToken, setNeedsOnboarding } = useContext(AuthContext);

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Missing info', 'Enter a username and password.');
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
      const body = isSignUp ? { username, password, country: country.name } : { username, password };
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

  const handleGoogleSignIn = () => {
    Alert.alert('Coming Soon', 'Google Sign-In will be available in a future update.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>BARBELLION</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          onPress={() => setIsSignUp(true)}
          style={[styles.toggleBtn, isSignUp && styles.toggleActive]}
        >
          <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsSignUp(false)}
          style={[styles.toggleBtn, !isSignUp && styles.toggleActive]}
        >
          <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>Log In</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Username</Text>
      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={18} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={18} color="#888" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {isSignUp && (
        <>
          <Text style={styles.label}>Country</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setCountryModalVisible(true)}>
            <Text style={styles.dropdownFlag}>{country.flag}</Text>
            <Text style={styles.dropdownText}>{country.name}</Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitText}>
          {loading ? '...' : isSignUp ? 'START TRAINING WITH BARBELLION' : 'LOG IN'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.switchLink}>
        <Text style={styles.switchText}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Text style={styles.switchTextBold}>{isSignUp ? 'Log In' : 'Sign Up'}</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignIn}>
        <Text style={styles.googleG}>G</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        By continuing, you agree to Barbellion's Terms of Service and acknowledge our data practices.
      </Text>
      <View style={styles.footerLinks}>
        <Text style={styles.footerLink}>Privacy Policy</Text>
        <Text style={styles.footerLink}>  Privacy Policy</Text>
      </View>

      <Modal visible={countryModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => {
                    setCountry(item);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setCountryModalVisible(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const LIME = '#c6ff1a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 24, paddingTop: 60 },
  brand: { color: '#fff', fontSize: 34, fontWeight: '900', textAlign: 'center', letterSpacing: 1, marginBottom: 30 },
  toggleRow: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 30, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 26, alignItems: 'center' },
  toggleActive: { backgroundColor: '#fff' },
  toggleText: { color: '#888', fontWeight: '700', fontSize: 14 },
  toggleTextActive: { color: '#0a0a0a' },
  label: { color: '#aaa', fontSize: 13, marginBottom: 6, marginTop: 14 },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 10, borderWidth: 1, borderColor: '#2a2a2a', paddingHorizontal: 14 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#fff', paddingVertical: 14, fontSize: 15 },
  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161616', borderRadius: 10, borderWidth: 1, borderColor: '#2a2a2a', paddingHorizontal: 14, paddingVertical: 14 },
  dropdownFlag: { fontSize: 18, marginRight: 10 },
  dropdownText: { flex: 1, color: '#fff', fontSize: 15 },
  submitBtn: { backgroundColor: LIME, borderRadius: 10, padding: 17, alignItems: 'center', marginTop: 28 },
  submitText: { color: '#0a0a0a', fontWeight: '900', fontSize: 14, letterSpacing: 0.5 },
  switchLink: { alignItems: 'center', marginTop: 18 },
  switchText: { color: '#999', fontSize: 13 },
  switchTextBold: { color: LIME, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 26, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2a2a2a' },
  dividerText: { color: '#666', fontSize: 12, marginHorizontal: 12 },
  googleBtn: { alignSelf: 'center', width: 48, height: 48, borderRadius: 24, backgroundColor: '#161616', borderWidth: 1, borderColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center' },
  googleG: { color: '#fff', fontWeight: '800', fontSize: 18 },
  footerText: { color: '#555', fontSize: 10, textAlign: 'center', marginTop: 26, lineHeight: 15, paddingHorizontal: 10 },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  footerLink: { color: '#777', fontSize: 11, textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#111', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  countryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  countryFlag: { fontSize: 20, marginRight: 12 },
  countryName: { color: '#fff', fontSize: 15 },
  modalCloseBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12 },
  modalCloseText: { color: LIME, fontWeight: '700', fontSize: 15 },
});

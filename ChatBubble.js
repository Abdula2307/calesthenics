import { View, Text, StyleSheet } from 'react-native';

export default function ChatBubble({ text, isUser }) {
  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 14, marginVertical: 4 },
  userBubble: { backgroundColor: '#e63946', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#1a1a1a', alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
  text: { color: '#fff', fontSize: 14 },
});
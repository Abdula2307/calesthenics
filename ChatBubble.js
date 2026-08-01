import { View, Text, StyleSheet } from 'react-native';

export default function ChatBubble({ text, isUser }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{isUser ? 'Me: ' : 'AI: '}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 6, flexWrap: 'wrap' },
  label: { color: '#c6ff1a', fontWeight: '800', fontSize: 14 },
  text: { color: '#ddd', fontSize: 14, flexShrink: 1 },
});

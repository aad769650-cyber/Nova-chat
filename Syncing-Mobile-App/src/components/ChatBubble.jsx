// src/components/ChatBubble.jsx
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../context/ThemeContext";

export default function ChatBubble({ message }) {
  const { paperTheme } = useAppTheme();
  const isUser = message.sender === "user";

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAi]}>
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: paperTheme.colors.primary, borderTopRightRadius: 6 }
            : { backgroundColor: paperTheme.colors.surfaceVariant, borderTopLeftRadius: 6 },
        ]}
      >
        <Text style={{ color: isUser ? "#fff" : paperTheme.colors.onSurface, fontSize: 14, lineHeight: 20 }}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.time, { color: paperTheme.colors.onSurfaceVariant }]}>{message.time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { maxWidth: "80%", marginBottom: 14 },
  rowUser: { alignSelf: "flex-end", alignItems: "flex-end" },
  rowAi: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  time: { fontSize: 10, marginTop: 4, marginHorizontal: 4 },
});

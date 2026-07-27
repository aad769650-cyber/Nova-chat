// src/components/ChatListItem.jsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../context/ThemeContext";

export default function ChatListItem({ chat, onPress, onDelete }) {
  const { paperTheme } = useAppTheme();
  const lastMessage = chat.messages[chat.messages.length - 1];

  const renderRightActions = () => (
    <Pressable onPress={() => onDelete(chat.id)} style={styles.deleteAction}>
      <Ionicons name="trash-outline" size={20} color="#fff" />
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
      <Pressable
        onPress={() => onPress(chat.id)}
        style={({ pressed }) => [
          styles.row,
          { backgroundColor: paperTheme.colors.surface, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: paperTheme.colors.primaryContainer }]}>
          <Ionicons name="sparkles" size={16} color={paperTheme.colors.primary} />
        </View>
        <View style={styles.textCol}>
          <Text numberOfLines={1} style={[styles.title, { color: paperTheme.colors.onSurface }]}>
            {chat.title}
          </Text>
          <Text numberOfLines={1} style={[styles.preview, { color: paperTheme.colors.onSurfaceVariant }]}>
            {lastMessage ? lastMessage.text : "No messages yet"}
          </Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  avatar: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  textCol: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600" },
  preview: { fontSize: 12, marginTop: 2 },
  deleteAction: {
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    width: 72,
    borderRadius: 16,
    marginBottom: 8,
  },
});

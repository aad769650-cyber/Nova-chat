// app/privacy.jsx
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../src/context/ThemeContext";

const SECTIONS = [
  {
    title: "What NovaChat stores",
    body: "Your chats, profile details, and preferences are stored only on this device using local storage. Nothing is uploaded to a server in this build.",
  },
  {
    title: "Mock AI responses",
    body: "This MVP uses a local mock AI — no prompt data leaves your device or reaches a third-party AI provider.",
  },
  {
    title: "Your control",
    body: "You can clear any conversation from the chat screen, delete individual chats by swiping them on Home, or log out to reset your session.",
  },
];

export default function Privacy() {
  const { paperTheme } = useAppTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]} edges={["top"]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="chevron-back" size={22} color={paperTheme.colors.onSurface} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: paperTheme.colors.onSurface }]}>Privacy</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={[styles.card, { backgroundColor: paperTheme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: paperTheme.colors.onSurface }]}>{section.title}</Text>
            <Text style={[styles.cardBody, { color: paperTheme.colors.onSurfaceVariant }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 15, fontWeight: "600" },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 12 },
  card: { borderRadius: 16, padding: 16, gap: 6 },
  cardTitle: { fontSize: 13.5, fontWeight: "600" },
  cardBody: { fontSize: 12.5, lineHeight: 19 },
});

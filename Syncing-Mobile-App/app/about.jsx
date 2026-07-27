// app/about.jsx
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../src/components/Logo";
import { useAppTheme } from "../src/context/ThemeContext";

export default function About() {
  const { paperTheme } = useAppTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]} edges={["top"]}>
      <Pressable onPress={() => router.back()} style={styles.back} hitSlop={10}>
        <Ionicons name="chevron-back" size={22} color={paperTheme.colors.onSurface} />
      </Pressable>
      <View style={styles.content}>
        <Logo size={64} />
        <Text style={[styles.title, { color: paperTheme.colors.onSurface }]}>NovaChat</Text>
        <Text style={[styles.version, { color: paperTheme.colors.onSurfaceVariant }]}>Version 1.0.0</Text>
        <Text style={[styles.body, { color: paperTheme.colors.onSurfaceVariant }]}>
          NovaChat is a lightweight AI chat companion built with React Native and Expo. This build
          ships with mock AI responses — connect a real provider to bring it to life.
        </Text>
        <Text style={[styles.credit, { color: paperTheme.colors.onSurfaceVariant }]}>
          Made with ❤ using Expo + React Native
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { paddingHorizontal: 16, paddingTop: 8 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 6 },
  title: { fontSize: 20, fontWeight: "700", marginTop: 16 },
  version: { fontSize: 12.5, marginBottom: 16 },
  body: { fontSize: 13.5, textAlign: "center", lineHeight: 20 },
  credit: { fontSize: 12, marginTop: 24 },
});

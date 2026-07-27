// app/(tabs)/profile.jsx
import { useState, useMemo } from "react";
import { View, Text, TextInput, StyleSheet, Alert, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { useChats } from "../../src/context/ChatContext";
import { useAppTheme } from "../../src/context/ThemeContext";
import GradientButton from "../../src/components/GradientButton";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { chats } = useChats();
  const { paperTheme } = useAppTheme();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);

  const totalMessages = useMemo(() => chats.reduce((sum, c) => sum + c.messages.length, 0), [chats]);
  const initials = (name || "NC")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSave = () => {
    updateProfile({ name: name.trim() || user?.name, email: email.trim() || user?.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]} edges={["top"]}>
      <Text style={[styles.header, { color: paperTheme.colors.onSurface }]}>Profile</Text>

      <View style={styles.avatarRow}>
        <View style={[styles.avatar, { backgroundColor: paperTheme.colors.primary }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            style={[
              styles.input,
              { backgroundColor: paperTheme.colors.surface, color: paperTheme.colors.onSurface, borderColor: paperTheme.colors.outline },
            ]}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[
              styles.input,
              { backgroundColor: paperTheme.colors.surface, color: paperTheme.colors.onSurface, borderColor: paperTheme.colors.outline },
            ]}
          />
        </View>
      </View>

      <GradientButton label={saved ? "Saved ✓" : "Save changes"} onPress={handleSave} style={{ marginTop: 18 }} />

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: paperTheme.colors.surface }]}>
          <Ionicons name="chatbubbles-outline" size={18} color={paperTheme.colors.primary} />
          <Text style={[styles.statValue, { color: paperTheme.colors.onSurface }]}>{chats.length}</Text>
          <Text style={[styles.statLabel, { color: paperTheme.colors.onSurfaceVariant }]}>Chats</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: paperTheme.colors.surface }]}>
          <Ionicons name="mail-outline" size={18} color={paperTheme.colors.primary} />
          <Text style={[styles.statValue, { color: paperTheme.colors.onSurface }]}>{totalMessages}</Text>
          <Text style={[styles.statLabel, { color: paperTheme.colors.onSurfaceVariant }]}>Messages</Text>
        </View>
      </View>

      <Pressable style={[styles.logout, { borderColor: paperTheme.colors.outline }]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#ef4444" />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 20, fontWeight: "700", marginTop: 12, marginBottom: 24 },
  avatarRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  avatar: { width: 64, height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "700" },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 13.5 },
  statsRow: { flexDirection: "row", gap: 12, marginTop: 22 },
  statCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: "flex-start", gap: 6 },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 11.5 },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 13,
    marginTop: 28,
  },
  logoutText: { color: "#ef4444", fontSize: 14, fontWeight: "600" },
});

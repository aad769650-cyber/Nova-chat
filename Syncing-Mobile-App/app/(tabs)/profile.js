import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert, TextInput } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";
import { useChat } from "../../context/ChatContext";
import PrimaryButton from "../../components/PrimaryButton";
import { spacing, fontSizes, radius } from "../../constants/theme";

export default function ProfileScreen() {
  const { colors } = useAppTheme();
  const { user, logout } = useAuth();
  const { chats } = useChat();
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name || "");

  const totalMessages = chats.reduce((sum, c) => sum + c.messages.length, 0);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const stats = [
    { label: "Chats", value: chats.length, icon: "chatbubbles-outline" },
    { label: "Messages", value: totalMessages, icon: "paper-plane-outline" },
    { label: "Days Active", value: user?.stats?.daysActive ?? 0, icon: "flame-outline" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.headerCard}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            {editing ? (
              <TextInput
                value={nameDraft}
                onChangeText={setNameDraft}
                style={styles.nameInput}
                placeholder="Your name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                autoFocus
              />
            ) : (
              <Text style={styles.name}>{user?.name}</Text>
            )}
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.planBadge}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.planText}>{user?.plan}</Text>
            </View>

            <Pressable
              style={styles.editBtn}
              onPress={() => setEditing((e) => !e)}
            >
              <Ionicons name={editing ? "checkmark" : "create-outline"} size={18} color="#fff" />
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon} size={20} color={colors.primary} />
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MenuRow icon="mail-outline" label="Email" value={user?.email} colors={colors} />
            <Divider colors={colors} />
            <MenuRow icon="card-outline" label="Plan" value={user?.plan} colors={colors} />
            <Divider colors={colors} />
            <MenuRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => router.push("/(tabs)/settings")}
              colors={colors}
              chevron
            />
            <Divider colors={colors} />
            <MenuRow
              icon="information-circle-outline"
              label="About App"
              onPress={() => router.push("/about")}
              colors={colors}
              chevron
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={{ marginTop: spacing.xl }}>
          <PrimaryButton title="Log Out" variant="outline" onPress={handleLogout} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuRow({ icon, label, value, onPress, colors, chevron }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.menuRow}
      android_ripple={onPress ? { color: colors.border } : undefined}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: colors.primary + "18" }]}>
        <Ionicons name={icon} size={17} color={colors.primary} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      {value && <Text style={[styles.menuValue, { color: colors.textSecondary }]}>{value}</Text>}
      {chevron && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
    </Pressable>
  );
}

function Divider({ colors }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 34 + spacing.sm }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  headerCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.6)",
    marginBottom: spacing.md,
  },
  name: { fontSize: fontSizes.xl, fontWeight: "800", color: "#fff" },
  nameInput: {
    fontSize: fontSizes.xl,
    fontWeight: "800",
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.6)",
    minWidth: 160,
    textAlign: "center",
    paddingVertical: 2,
  },
  email: { fontSize: fontSizes.sm, color: "rgba(255,255,255,0.85)", marginTop: 2 },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginTop: spacing.sm,
    gap: 4,
  },
  planText: { color: "#fff", fontSize: fontSizes.xs, fontWeight: "600" },
  editBtn: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: fontSizes.lg, fontWeight: "800" },
  statLabel: { fontSize: fontSizes.xs },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: "700", marginBottom: spacing.sm },
  menuCard: {
    borderWidth: 1,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  menuIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: fontSizes.sm, fontWeight: "600" },
  menuValue: { fontSize: fontSizes.sm, marginRight: spacing.xs },
});

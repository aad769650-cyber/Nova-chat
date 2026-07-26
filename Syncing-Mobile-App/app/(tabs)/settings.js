import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert, Modal } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { spacing, fontSizes, radius } from "../../constants/theme";

const LANGUAGES = ["English", "Urdu", "Arabic", "Spanish", "French"];

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={[styles.header, { color: colors.text }]}>Settings</Text>

        <Animated.View entering={FadeInDown.duration(350)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              colors={colors}
              right={<Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: colors.primary }} />}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(350)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>
            NOTIFICATIONS
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingRow
              icon="notifications-outline"
              label="Push Notifications"
              colors={colors}
              right={
                <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: colors.primary }} />
              }
            />
            <Divider colors={colors} />
            <SettingRow
              icon="volume-high-outline"
              label="Sound"
              colors={colors}
              right={<Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ true: colors.primary }} />}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(350)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>GENERAL</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingRow
              icon="language-outline"
              label="Language"
              colors={colors}
              onPress={() => setLanguageModalVisible(true)}
              right={
                <View style={styles.rowValueWrap}>
                  <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{language}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
              }
            />
            <Divider colors={colors} />
            <SettingRow
              icon="shield-checkmark-outline"
              label="Privacy Policy"
              colors={colors}
              onPress={() =>
                Alert.alert(
                  "Privacy Policy",
                  "We respect your privacy. This demo app stores your data only on your device and does not share it with third parties."
                )
              }
              right={<Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
            />
            <Divider colors={colors} />
            <SettingRow
              icon="information-circle-outline"
              label="About App"
              colors={colors}
              onPress={() => router.push("/about")}
              right={<Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(350)}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>ACCOUNT</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingRow
              icon="log-out-outline"
              label="Log Out"
              colors={colors}
              danger
              onPress={handleLogout}
            />
          </View>
        </Animated.View>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>AI Chat • Version 1.0.0</Text>
      </ScrollView>

      <Modal
        visible={languageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLanguageModalVisible(false)}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Language</Text>
            {LANGUAGES.map((lang) => (
              <Pressable
                key={lang}
                style={styles.langRow}
                onPress={() => {
                  setLanguage(lang);
                  setLanguageModalVisible(false);
                }}
              >
                <Text style={[styles.langText, { color: colors.text }]}>{lang}</Text>
                {language === lang && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function SettingRow({ icon, label, right, onPress, colors, danger }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.row}
      android_ripple={onPress ? { color: colors.border } : undefined}
    >
      <View style={[styles.iconWrap, { backgroundColor: (danger ? colors.danger : colors.primary) + "18" }]}>
        <Ionicons name={icon} size={17} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.rowLabel, { color: danger ? colors.danger : colors.text }]}>{label}</Text>
      {right}
    </Pressable>
  );
}

function Divider({ colors }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 34 + spacing.sm }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { fontSize: fontSizes.xxl, fontWeight: "800", marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSizes.xs, fontWeight: "700", letterSpacing: 0.5, marginBottom: spacing.sm },
  card: { borderWidth: 1, borderRadius: radius.md, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: fontSizes.sm, fontWeight: "600" },
  rowValueWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  rowValue: { fontSize: fontSizes.sm },
  versionText: { textAlign: "center", fontSize: fontSizes.xs, marginTop: spacing.xl },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: spacing.xl },
  modalCard: { borderRadius: radius.lg, padding: spacing.lg },
  modalTitle: { fontSize: fontSizes.lg, fontWeight: "700", marginBottom: spacing.md },
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  langText: { fontSize: fontSizes.md },
});

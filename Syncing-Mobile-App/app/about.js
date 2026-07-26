import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, fontSizes, radius } from "../constants/theme";

const LINKS = [
  { id: "l1", icon: "globe-outline", label: "Visit Website", url: "https://example.com" },
  { id: "l2", icon: "logo-twitter", label: "Follow us on Twitter", url: "https://twitter.com" },
  { id: "l3", icon: "mail-outline", label: "Contact Support", url: "mailto:support@example.com" },
  { id: "l4", icon: "star-outline", label: "Rate the App", url: "https://play.google.com" },
];

export default function AboutScreen() {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.logoSection}>
          <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.logoCircle}>
            <Ionicons name="sparkles" size={40} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { color: colors.text }]}>AI Chat</Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            AI Chat is your intelligent mobile companion, designed to help you brainstorm ideas, get quick answers,
            write content, and stay organized — all in one clean, minimal interface.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {LINKS.map((link, index) => (
            <View key={link.id}>
              <Pressable
                style={styles.linkRow}
                onPress={() => Linking.openURL(link.url).catch(() => {})}
                android_ripple={{ color: colors.border }}
              >
                <View style={[styles.linkIconWrap, { backgroundColor: colors.primary + "18" }]}>
                  <Ionicons name={link.icon} size={17} color={colors.primary} />
                </View>
                <Text style={[styles.linkLabel, { color: colors.text }]}>{link.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
              {index < LINKS.length - 1 && (
                <View style={{ height: 1, backgroundColor: colors.border, marginLeft: spacing.md + 34 + spacing.sm }} />
              )}
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>Made with care for a smarter conversation.</Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>© {new Date().getFullYear()} AI Chat. All rights reserved.</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: "700" },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  logoSection: { alignItems: "center", marginBottom: spacing.lg },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  appName: { fontSize: fontSizes.xxl, fontWeight: "800" },
  version: { fontSize: fontSizes.sm, marginTop: 2 },
  description: { fontSize: fontSizes.sm, lineHeight: 22, textAlign: "center", marginBottom: spacing.xl },
  card: { borderWidth: 1, borderRadius: radius.md, overflow: "hidden", marginBottom: spacing.xl },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  linkIconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  linkLabel: { flex: 1, fontSize: fontSizes.sm, fontWeight: "600" },
  footer: { alignItems: "center", gap: 4 },
  footerText: { fontSize: fontSizes.xs, textAlign: "center" },
});

import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";
import { fontSizes, spacing } from "../constants/theme";

export default function SplashScreen() {
  const { isReady, isAuthenticated, hasOnboarded } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      if (!hasOnboarded) {
        router.replace("/onboarding");
      } else if (!isAuthenticated) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/(tabs)/home");
      }
    }, 1400);
    return () => clearTimeout(timer);
  }, [isReady, isAuthenticated, hasOnboarded]);

  return (
    <LinearGradient colors={["#7C6BF2", "#6C5CE7", "#5849C2"]} style={styles.container}>
      <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.iconWrap}>
        <Ionicons name="sparkles" size={56} color="#fff" />
      </Animated.View>
      <Animated.Text entering={FadeIn.delay(300).duration(600)} style={styles.title}>
        AI Chat
      </Animated.Text>
      <Animated.Text entering={FadeIn.delay(500).duration(600)} style={styles.subtitle}>
        Your intelligent companion
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: "rgba(255,255,255,0.85)",
    marginTop: spacing.xs,
  },
});

// app/index.jsx
import { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../src/components/Logo";
import { useAuth } from "../src/context/AuthContext";

export default function SplashRoute() {
  const { hasOnboarded, isLoggedIn, checking } = useAuth();
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(1, { duration: 500 });
  }, []);

  useEffect(() => {
    if (checking) return;
    const timer = setTimeout(() => {
      if (!hasOnboarded) router.replace("/onboarding");
      else if (!isLoggedIn) router.replace("/(auth)/login");
      else router.replace("/(tabs)/home");
    }, 1200);
    return () => clearTimeout(timer);
  }, [checking, hasOnboarded, isLoggedIn]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <LinearGradient colors={["#0a0a0f", "#15111f"]} style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Logo size={88} />
      </Animated.View>
      <Text style={styles.title}>NovaChat</Text>
      <Text style={styles.subtitle}>Your AI, everywhere you are</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginTop: 18 },
  subtitle: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
});

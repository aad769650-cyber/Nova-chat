import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../context/AuthContext";
import { useAppTheme } from "../../context/ThemeContext";
import PrimaryButton from "../../components/PrimaryButton";
import { spacing, fontSizes, radius } from "../../constants/theme";

export default function LoginScreen() {
  const { colors } = useAppTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await login(email.trim(), password);
    setLoading(false);
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View entering={FadeInDown.duration(400)} style={styles.logoWrap}>
            <View style={[styles.logoCircle, { backgroundColor: colors.primary + "22" }]}>
              <Ionicons name="sparkles" size={36} color={colors.primary} />
            </View>
            <Text style={[styles.welcome, { color: colors.text }]}>Welcome back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Log in to continue your conversations
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.form}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={19} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="you@example.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.md }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={19} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={10}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={19} color={colors.textMuted} />
              </Pressable>
            </View>

            {!!error && <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>}

            <Pressable style={styles.forgotWrap}>
              <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot password?</Text>
            </Pressable>

            <PrimaryButton title="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.md }} />

            <View style={styles.footerRow}>
              <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("/(auth)/signup")}>
                <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, padding: spacing.lg, justifyContent: "center" },
  logoWrap: { alignItems: "center", marginBottom: spacing.xl },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  welcome: { fontSize: fontSizes.xxl, fontWeight: "800" },
  subtitle: { fontSize: fontSizes.sm, marginTop: 4, textAlign: "center" },
  form: { width: "100%" },
  label: { fontSize: fontSizes.sm, fontWeight: "600", marginBottom: spacing.xs },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
    gap: 10,
  },
  input: { flex: 1, fontSize: fontSizes.md },
  error: { marginTop: spacing.sm, fontSize: fontSizes.sm },
  forgotWrap: { alignSelf: "flex-end", marginTop: spacing.sm, marginBottom: spacing.xs },
  forgotText: { fontSize: fontSizes.sm, fontWeight: "600" },
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.lg },
  signupLink: { fontWeight: "700" },
});

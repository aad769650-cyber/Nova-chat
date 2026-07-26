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

export default function SignupScreen() {
  const { colors } = useAppTheme();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await signup(name.trim(), email.trim(), password);
    setLoading(false);
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={[styles.welcome, { color: colors.text }]}>Create account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign up to start chatting with your AI assistant
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.form}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={19} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Your full name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={[styles.label, { color: colors.textSecondary, marginTop: spacing.md }]}>Email</Text>
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
                placeholder="Create a password"
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

            <PrimaryButton title="Sign Up" onPress={handleSignup} loading={loading} style={{ marginTop: spacing.lg }} />

            <View style={styles.footerRow}>
              <Text style={{ color: colors.textSecondary }}>Already have an account? </Text>
              <Pressable onPress={() => router.push("/(auth)/login")}>
                <Text style={[styles.signupLink, { color: colors.primary }]}>Log In</Text>
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
  scroll: { flexGrow: 1, padding: spacing.lg },
  backBtn: { marginBottom: spacing.md },
  header: { marginBottom: spacing.xl },
  welcome: { fontSize: fontSizes.xxl, fontWeight: "800" },
  subtitle: { fontSize: fontSizes.sm, marginTop: 4 },
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
  footerRow: { flexDirection: "row", justifyContent: "center", marginTop: spacing.lg },
  signupLink: { fontWeight: "700" },
});

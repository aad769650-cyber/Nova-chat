// app/(auth)/login.jsx
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../src/components/Logo";
import GradientButton from "../../src/components/GradientButton";
import { useAuth } from "../../src/context/AuthContext";
import { useAppTheme } from "../../src/context/ThemeContext";

export default function Login() {
  const { login } = useAuth();
  const { paperTheme } = useAppTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Enter both an email and a password.");
      return;
    }
    setError("");
    setSubmitting(true);
    await login({ email: email.trim(), password });
    setSubmitting(false);
    router.replace("/(tabs)/home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
    >
      <View style={styles.header}>
        <Logo size={56} />
        <Text style={[styles.title, { color: paperTheme.colors.onSurface }]}>Welcome back</Text>
        <Text style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          Log in to pick up where you left off.
        </Text>
      </View>

      <View style={styles.form}>
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
        <View
          style={[
            styles.passwordRow,
            { backgroundColor: paperTheme.colors.surface, borderColor: paperTheme.colors.outline },
          ]}
        >
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            secureTextEntry={!showPassword}
            style={[styles.passwordInput, { color: paperTheme.colors.onSurface }]}
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={paperTheme.colors.onSurfaceVariant}
            />
          </Pressable>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <GradientButton
          label={submitting ? "Logging in…" : "Log In"}
          onPress={handleLogin}
          disabled={submitting}
          style={{ marginTop: 8 }}
        />
      </View>

      <Pressable onPress={() => router.push("/(auth)/signup")} style={styles.footer}>
        <Text style={{ color: paperTheme.colors.onSurfaceVariant, fontSize: 13 }}>
          Don't have an account? <Text style={{ color: paperTheme.colors.primary, fontWeight: "600" }}>Sign up</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 36, gap: 6 },
  title: { fontSize: 22, fontWeight: "700", marginTop: 12 },
  subtitle: { fontSize: 13, textAlign: "center" },
  form: { gap: 12 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 13, fontSize: 14 },
  passwordRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 14, paddingHorizontal: 16 },
  passwordInput: { flex: 1, paddingVertical: 13, fontSize: 14 },
  error: { color: "#ef4444", fontSize: 12.5 },
  footer: { alignItems: "center", marginTop: 28 },
});

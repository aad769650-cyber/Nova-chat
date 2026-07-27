// app/(tabs)/settings.jsx
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Switch } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../src/context/ThemeContext";
import { getJSON, setJSON } from "../../src/utils/storage";
import { STORAGE_KEYS } from "../../src/utils/keys";

const LANGUAGES = ["English", "Spanish", "French", "German"];

export default function Settings() {
  const { mode, toggleTheme, paperTheme } = useAppTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setNotificationsEnabled(await getJSON(STORAGE_KEYS.NOTIFICATIONS_ENABLED, true));
      setLanguage(await getJSON(STORAGE_KEYS.LANGUAGE, "English"));
    })();
  }, []);

  const handleToggleNotifications = () => {
    setNotificationsEnabled((prev) => {
      const next = !prev;
      setJSON(STORAGE_KEYS.NOTIFICATIONS_ENABLED, next);
      return next;
    });
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    setJSON(STORAGE_KEYS.LANGUAGE, lang);
    setLanguageMenuOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]} edges={["top"]}>
      <Text style={[styles.header, { color: paperTheme.colors.onSurface }]}>Settings</Text>

      <View style={[styles.row, { backgroundColor: paperTheme.colors.surface }]}>
        <View style={styles.rowLeft}>
          <Ionicons
            name={mode === "dark" ? "moon-outline" : "sunny-outline"}
            size={18}
            color={paperTheme.colors.onSurfaceVariant}
          />
          <Text style={[styles.rowLabel, { color: paperTheme.colors.onSurface }]}>Dark mode</Text>
        </View>
        <Switch value={mode === "dark"} onValueChange={toggleTheme} color={paperTheme.colors.primary} />
      </View>

      <View style={[styles.row, { backgroundColor: paperTheme.colors.surface }]}>
        <View style={styles.rowLeft}>
          <Ionicons name="notifications-outline" size={18} color={paperTheme.colors.onSurfaceVariant} />
          <Text style={[styles.rowLabel, { color: paperTheme.colors.onSurface }]}>Notifications</Text>
        </View>
        <Switch value={notificationsEnabled} onValueChange={handleToggleNotifications} color={paperTheme.colors.primary} />
      </View>

      <Pressable
        style={[styles.row, { backgroundColor: paperTheme.colors.surface }]}
        onPress={() => setLanguageMenuOpen((v) => !v)}
      >
        <View style={styles.rowLeft}>
          <Ionicons name="globe-outline" size={18} color={paperTheme.colors.onSurfaceVariant} />
          <Text style={[styles.rowLabel, { color: paperTheme.colors.onSurface }]}>Language</Text>
        </View>
        <View style={styles.rowRight}>
          <Text style={{ color: paperTheme.colors.onSurfaceVariant, fontSize: 13 }}>{language}</Text>
          <Ionicons
            name={languageMenuOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={paperTheme.colors.onSurfaceVariant}
          />
        </View>
      </Pressable>

      {languageMenuOpen && (
        <View style={[styles.languageList, { backgroundColor: paperTheme.colors.surface }]}>
          {LANGUAGES.map((lang) => (
            <Pressable key={lang} onPress={() => handleSelectLanguage(lang)} style={styles.languageItem}>
              <Text
                style={{
                  color: lang === language ? paperTheme.colors.primary : paperTheme.colors.onSurface,
                  fontSize: 13.5,
                }}
              >
                {lang}
              </Text>
              {lang === language && <Ionicons name="checkmark" size={16} color={paperTheme.colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      <Pressable style={[styles.row, { backgroundColor: paperTheme.colors.surface }]} onPress={() => router.push("/about")}>
        <View style={styles.rowLeft}>
          <Ionicons name="information-circle-outline" size={18} color={paperTheme.colors.onSurfaceVariant} />
          <Text style={[styles.rowLabel, { color: paperTheme.colors.onSurface }]}>About</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={paperTheme.colors.onSurfaceVariant} />
      </Pressable>

      <Pressable style={[styles.row, { backgroundColor: paperTheme.colors.surface }]} onPress={() => router.push("/privacy")}>
        <View style={styles.rowLeft}>
          <Ionicons name="shield-checkmark-outline" size={18} color={paperTheme.colors.onSurfaceVariant} />
          <Text style={[styles.rowLabel, { color: paperTheme.colors.onSurface }]}>Privacy</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={paperTheme.colors.onSurfaceVariant} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { fontSize: 20, fontWeight: "700", marginTop: 12, marginBottom: 20 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowLabel: { fontSize: 13.5, fontWeight: "500" },
  languageList: { borderRadius: 14, marginTop: -4, marginBottom: 10, paddingVertical: 4 },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});

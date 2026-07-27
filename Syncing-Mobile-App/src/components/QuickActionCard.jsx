// src/components/QuickActionCard.jsx
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";

export default function QuickActionCard({ action, index, onPress }) {
  const { paperTheme } = useAppTheme();
  return (
    <Animated.View entering={FadeInRight.delay(index * 80).duration(400)}>
      <Pressable
        onPress={() => onPress(action)}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: paperTheme.colors.surface, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: paperTheme.colors.primaryContainer }]}>
          <Ionicons name={action.icon} size={18} color={paperTheme.colors.primary} />
        </View>
        <Text style={[styles.label, { color: paperTheme.colors.onSurface }]}>{action.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { width: 108, borderRadius: 16, padding: 12, marginRight: 10, alignItems: "flex-start", gap: 10 },
  iconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 12.5, fontWeight: "600" },
});

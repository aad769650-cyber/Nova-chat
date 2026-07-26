import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius, fontSizes } from "../constants/theme";

export default function PromptSuggestionCard({ item, onPress, index = 0 }) {
  const { colors } = useAppTheme();

  return (
    <Animated.View entering={FadeInRight.delay(index * 60).duration(300)}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.border }}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          pressed && { opacity: 0.85 },
        ]}
      >
        <Ionicons name={item.icon} size={18} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    gap: 8,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "500",
  },
});

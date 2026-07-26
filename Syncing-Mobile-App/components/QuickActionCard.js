import React from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius, fontSizes } from "../constants/theme";

export default function QuickActionCard({ item, onPress, index = 0 }) {
  const { colors } = useAppTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).duration(300)} style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        android_ripple={{ color: colors.border }}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "20" }]}>
          <Ionicons name={item.icon} size={22} color={colors.primary} />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>{item.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "50%",
    padding: spacing.xs,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: "600",
  },
});

import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius, fontSizes } from "../constants/theme";
import { formatRelativeTime } from "../utils/formatTime";

export default function ChatListItem({ chat, onPress, onLongPress, index = 0 }) {
  const { colors } = useAppTheme();

  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(300)}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{ color: colors.border }}
        style={({ pressed }) => [
          styles.container,
          { backgroundColor: colors.card, borderColor: colors.border },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "22" }]}>
          <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
              {chat.title}
            </Text>
            {chat.pinned && <Ionicons name="bookmark" size={13} color={colors.primary} style={{ marginLeft: 6 }} />}
          </View>
          <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>
            {chat.lastMessage || "No messages yet"}
          </Text>
        </View>
        <Text style={[styles.time, { color: colors.textMuted }]}>{formatRelativeTime(chat.updatedAt)}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: fontSizes.md,
    fontWeight: "600",
    flexShrink: 1,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    marginTop: 2,
  },
  time: {
    fontSize: fontSizes.xs,
  },
});

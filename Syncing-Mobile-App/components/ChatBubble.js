import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius, fontSizes } from "../constants/theme";
import { formatMessageTime } from "../utils/formatTime";

export default function ChatBubble({ message }) {
  const { colors } = useAppTheme();
  const isUser = message.role === "user";

  return (
    <Animated.View
      entering={FadeInUp.duration(320).springify().damping(16)}
      style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}
    >
      <View
        style={[
          styles.bubble,
          isUser
            ? { backgroundColor: colors.bubbleUser, borderBottomRightRadius: 4 }
            : { backgroundColor: colors.bubbleAI, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.text, { color: isUser ? colors.bubbleUserText : colors.bubbleAIText }]}>
          {message.text}
        </Text>
      </View>
      <Text style={[styles.timestamp, { color: colors.textMuted }, isUser ? styles.timestampUser : styles.timestampAI]}>
        {formatMessageTime(message.timestamp)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    maxWidth: "82%",
    marginVertical: spacing.xs,
  },
  rowUser: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  rowAI: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.lg,
  },
  text: {
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: fontSizes.xs,
    marginTop: 4,
    marginHorizontal: 6,
  },
  timestampUser: {
    textAlign: "right",
  },
  timestampAI: {
    textAlign: "left",
  },
});

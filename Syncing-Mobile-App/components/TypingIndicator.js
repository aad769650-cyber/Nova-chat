import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
} from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { spacing, radius } from "../constants/theme";

function Dot({ delay, color }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(-5, { duration: 300 }),
          withTiming(0, { duration: 300 })
        )
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

export default function TypingIndicator() {
  const { colors } = useAppTheme();

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.row}>
      <View
        style={[
          styles.bubble,
          { backgroundColor: colors.bubbleAI, borderColor: colors.border },
        ]}
      >
        <Dot delay={0} color={colors.textMuted} />
        <Dot delay={150} color={colors.textMuted} />
        <Dot delay={300} color={colors.textMuted} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignSelf: "flex-start",
    marginVertical: spacing.xs,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginHorizontal: 2,
  },
});

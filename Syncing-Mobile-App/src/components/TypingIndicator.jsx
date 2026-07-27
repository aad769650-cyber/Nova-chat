// src/components/TypingIndicator.jsx
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";

function Dot({ delay, color }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

export default function TypingIndicator() {
  const { paperTheme } = useAppTheme();
  return (
    <View style={[styles.bubble, { backgroundColor: paperTheme.colors.surfaceVariant }]}>
      <Dot delay={0} color={paperTheme.colors.onSurfaceVariant} />
      <Dot delay={150} color={paperTheme.colors.onSurfaceVariant} />
      <Dot delay={300} color={paperTheme.colors.onSurfaceVariant} />
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    gap: 5,
    alignSelf: "flex-start",
    borderRadius: 18,
    borderTopLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 14,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

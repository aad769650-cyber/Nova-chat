// src/components/GradientButton.jsx
import { Pressable, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GradientButton({ label, onPress, disabled, style, icon }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[animatedStyle, style]}
    >
      <LinearGradient
        colors={["#8b5cf6", "#22d3ee"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, disabled && styles.disabled]}
      >
        {icon}
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  label: { color: "#fff", fontSize: 15, fontWeight: "600" },
  disabled: { opacity: 0.5 },
});

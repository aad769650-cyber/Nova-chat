import React from "react";
import { Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useAppTheme } from "../context/ThemeContext";
import { radius, fontSizes, spacing } from "../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function PrimaryButton({ title, onPress, loading, disabled, icon, variant = "filled", style }) {
  const { colors } = useAppTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  if (variant === "outline") {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.outlineButton,
          { borderColor: colors.primary, opacity: disabled ? 0.5 : 1 },
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={[styles.text, { color: colors.primary }]}>{title}</Text>
        )}
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[{ opacity: disabled ? 0.6 : 1 }, animatedStyle, style]}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.filledButton}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textFilled}>{title}</Text>}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  filledButton: {
    paddingVertical: 15,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButton: {
    paddingVertical: 15,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  text: {
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
  textFilled: {
    fontSize: fontSizes.md,
    fontWeight: "700",
    color: "#fff",
  },
});

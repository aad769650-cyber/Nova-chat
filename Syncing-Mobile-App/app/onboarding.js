import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions, Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";
import { useAppTheme } from "../context/ThemeContext";
import { ONBOARDING_SLIDES } from "../constants/mockData";
import PrimaryButton from "../components/PrimaryButton";
import { spacing, fontSizes, radius } from "../constants/theme";

const { width } = Dimensions.get("window");

function Dot({ active }) {
  const { colors } = useAppTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(active ? 24 : 8, { duration: 250 }),
    opacity: withTiming(active ? 1 : 0.4, { duration: 250 }),
  }));
  return <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, animatedStyle]} />;
}

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { completeOnboarding } = useAuth();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const handleNext = () => {
    if (index < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await completeOnboarding();
    router.replace("/(auth)/login");
  };

  const onScrollEnd = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipRow}>
        <Pressable onPress={handleFinish} hitSlop={10}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <LinearGradient colors={[colors.gradientStart, colors.gradientEnd]} style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color="#fff" />
            </LinearGradient>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <Dot key={i} active={i === index} />
          ))}
        </View>
        <PrimaryButton
          title={index === ONBOARDING_SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={{ width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipRow: {
    alignItems: "flex-end",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  skipText: {
    fontSize: fontSizes.md,
    fontWeight: "600",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: radius.xl + 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: fontSizes.md,
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

// app/onboarding.jsx
import { useRef, useState } from "react";
import { View, Text, FlatList, Dimensions, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ONBOARDING_SLIDES } from "../src/data/onboardingSlides";
import { useAuth } from "../src/context/AuthContext";
import { useAppTheme } from "../src/context/ThemeContext";
import GradientButton from "../src/components/GradientButton";

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const { completeOnboarding } = useAuth();
  const { paperTheme } = useAppTheme();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const finish = async () => {
    await completeOnboarding();
    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    if (index < ONBOARDING_SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finish();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Pressable style={styles.skip} onPress={finish} hitSlop={10}>
        <Text style={{ color: paperTheme.colors.onSurfaceVariant, fontSize: 13 }}>Skip</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onMomentumScrollEnd={(e) => {
          const next = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(next);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconCircle, { backgroundColor: paperTheme.colors.primaryContainer }]}>
              <Ionicons name={item.icon} size={40} color={paperTheme.colors.primary} />
            </View>
            <Text style={[styles.title, { color: paperTheme.colors.onSurface }]}>{item.title}</Text>
            <Text style={[styles.description, { color: paperTheme.colors.onSurfaceVariant }]}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {ONBOARDING_SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? paperTheme.colors.primary : paperTheme.colors.outline,
                width: i === index ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <GradientButton
          label={index === ONBOARDING_SLIDES.length - 1 ? "Get Started" : "Next"}
          onPress={handleNext}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skip: { position: "absolute", top: 56, right: 20, zIndex: 10, padding: 8 },
  slide: { alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 10 },
  description: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 20 },
  dot: { height: 6, borderRadius: 3 },
  footer: { flexDirection: "row", paddingHorizontal: 24, paddingBottom: 36 },
});

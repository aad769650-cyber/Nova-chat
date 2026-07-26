import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, TextInput } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useAppTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { QUICK_ACTIONS } from "../../constants/mockData";
import { getGreeting } from "../../utils/formatTime";
import ChatListItem from "../../components/ChatListItem";
import QuickActionCard from "../../components/QuickActionCard";
import { spacing, fontSizes, radius } from "../../constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const { chats, createChat, deleteChat, togglePinChat } = useChat();
  const [search, setSearch] = useState("");
  const fabScale = useSharedValue(1);

  const filteredChats = useMemo(() => {
    if (!search.trim()) return chats;
    const q = search.toLowerCase();
    return chats.filter(
      (c) => c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [chats, search]);

  const handleNewChat = () => {
    const id = createChat();
    router.push(`/chat/${id}`);
  };

  const handleQuickAction = (action) => {
    if (action.id === "q1") {
      handleNewChat();
    } else {
      Alert.alert(action.label, "This feature is coming soon in a future update.");
    }
  };

  const handleLongPressChat = (chat) => {
    Alert.alert(chat.title, "Choose an action", [
      { text: chat.pinned ? "Unpin" : "Pin", onPress: () => togglePinChat(chat.id) },
      { text: "Delete", style: "destructive", onPress: () => deleteChat(chat.id) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const fabStyle = useAnimatedStyle(() => ({ transform: [{ scale: fabScale.value }] }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeIn.duration(400)} style={styles.headerRow}>
              <View>
                <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()},</Text>
                <Text style={[styles.name, { color: colors.text }]}>{user?.name?.split(" ")[0] || "there"} 👋</Text>
              </View>
              <Pressable onPress={() => router.push("/(tabs)/profile")}>
                <View style={[styles.avatarSmall, { backgroundColor: colors.primary + "22" }]}>
                  <Ionicons name="person" size={20} color={colors.primary} />
                </View>
              </Pressable>
            </Animated.View>

            <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search conversations..."
                placeholderTextColor={colors.textMuted}
                style={{ flex: 1, marginLeft: spacing.sm, color: colors.text, fontSize: fontSizes.sm }}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </Pressable>
              )}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((item, i) => (
                <QuickActionCard key={item.id} item={item} index={i} onPress={() => handleQuickAction(item)} />
              ))}
            </View>

            <View style={styles.recentHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Recent Chats</Text>
              <Text style={[styles.countBadge, { color: colors.textMuted }]}>{filteredChats.length}</Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <ChatListItem
            chat={item}
            index={index}
            onPress={() => router.push(`/chat/${item.id}`)}
            onLongPress={() => handleLongPressChat(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No conversations found</Text>
          </View>
        }
      />

      <AnimatedPressable
        onPress={handleNewChat}
        onPressIn={() => (fabScale.value = withSpring(0.9))}
        onPressOut={() => (fabScale.value = withSpring(1))}
        style={[styles.fab, { backgroundColor: colors.primary }, fabStyle]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </AnimatedPressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  greeting: { fontSize: fontSizes.sm },
  name: { fontSize: fontSizes.xxl, fontWeight: "800" },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  recentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  countBadge: { fontSize: fontSizes.sm },
  emptyWrap: { alignItems: "center", paddingVertical: spacing.xxl },
  emptyText: { marginTop: spacing.sm, fontSize: fontSizes.md },
  fab: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
});

// app/(tabs)/home.jsx
import { useState, useMemo } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useChats } from "../../src/context/ChatContext";
import { useAuth } from "../../src/context/AuthContext";
import { useAppTheme } from "../../src/context/ThemeContext";
import { QUICK_ACTIONS } from "../../src/data/quickActions";
import QuickActionCard from "../../src/components/QuickActionCard";
import ChatListItem from "../../src/components/ChatListItem";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const router = useRouter();
  const { chats, createChat, deleteChat } = useChats();
  const { user } = useAuth();
  const { paperTheme } = useAppTheme();
  const [query, setQuery] = useState("");

  const filteredChats = useMemo(
    () => chats.filter((c) => c.title.toLowerCase().includes(query.toLowerCase())),
    [chats, query]
  );

  const handleQuickAction = (action) => {
    const id = createChat();
    router.push({ pathname: "/chat/[id]", params: { id, draft: action.prompt } });
  };

  const handleNewChat = () => {
    const id = createChat();
    router.push({ pathname: "/chat/[id]", params: { id } });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]} edges={["top"]}>
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Animated.View entering={FadeInDown.duration(400)} style={styles.greetingBlock}>
              <Text style={[styles.greeting, { color: paperTheme.colors.onSurface }]}>
                {getGreeting()}
                {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
              </Text>
              <Text style={[styles.subGreeting, { color: paperTheme.colors.onSurfaceVariant }]}>
                What are we working on today?
              </Text>
            </Animated.View>

            <View
              style={[
                styles.searchBar,
                { backgroundColor: paperTheme.colors.surface, borderColor: paperTheme.colors.outline },
              ]}
            >
              <Ionicons name="search" size={16} color={paperTheme.colors.onSurfaceVariant} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search chats…"
                placeholderTextColor={paperTheme.colors.onSurfaceVariant}
                style={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
              />
            </View>

            <Text style={[styles.sectionLabel, { color: paperTheme.colors.onSurfaceVariant }]}>Quick actions</Text>
            <FlatList
              data={QUICK_ACTIONS}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20, marginBottom: 22 }}
              renderItem={({ item, index }) => (
                <QuickActionCard action={item} index={index} onPress={handleQuickAction} />
              )}
            />

            <Text style={[styles.sectionLabel, { color: paperTheme.colors.onSurfaceVariant }]}>Recent chats</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={(id) => router.push({ pathname: "/chat/[id]", params: { id } })}
            onDelete={deleteChat}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: paperTheme.colors.onSurfaceVariant }]}>
            No chats yet — start a new one below.
          </Text>
        }
        contentContainerStyle={styles.listContent}
      />
      <FAB
        icon="plus"
        onPress={handleNewChat}
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        color="#fff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  greetingBlock: { marginTop: 8, marginBottom: 18 },
  greeting: { fontSize: 22, fontWeight: "700" },
  subGreeting: { fontSize: 13, marginTop: 2 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 22,
  },
  searchInput: { flex: 1, fontSize: 13.5 },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  empty: { textAlign: "center", marginTop: 40, fontSize: 13 },
  fab: { position: "absolute", right: 20, bottom: 24 },
});

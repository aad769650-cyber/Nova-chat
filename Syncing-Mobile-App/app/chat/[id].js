import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { useAppTheme } from "../../context/ThemeContext";
import { useChat } from "../../context/ChatContext";
import ChatBubble from "../../components/ChatBubble";
import TypingIndicator from "../../components/TypingIndicator";
import PromptSuggestionCard from "../../components/PromptSuggestionCard";
import { PROMPT_SUGGESTIONS } from "../../constants/mockData";
import { spacing, fontSizes, radius } from "../../constants/theme";

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useAppTheme();
  const { getChat, sendMessage, typingChatId } = useChat();
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  const chat = getChat(id);
  const isTyping = typingChatId === id;

  useEffect(() => {
    if (chat?.messages?.length) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chat?.messages?.length, isTyping]);

  if (!chat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.textMuted} />
        <Text style={{ color: colors.textSecondary, marginTop: spacing.sm }}>Conversation not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: spacing.md }}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const handleSend = (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;
    sendMessage(chat.id, text);
    setInput("");
  };

  const handleAttachment = () => {
    Alert.alert("Attach File", "File attachments are coming soon in a future update.");
  };

  const handleVoice = () => {
    Alert.alert("Voice Input", "Voice input is coming soon in a future update.");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top", "bottom"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.headerAvatar, { backgroundColor: colors.primary + "22" }]}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={[styles.headerTitle, { color: colors.text }]}>
              {chat.title}
            </Text>
            <Text style={[styles.headerSubtitle, { color: isTyping ? colors.primary : colors.textMuted }]}>
              {isTyping ? "Typing..." : "AI Assistant"}
            </Text>
          </View>
        </View>
        <Pressable
          hitSlop={10}
          onPress={() =>
            Alert.alert(chat.title, "Chat options", [
              { text: "Clear Chat", style: "destructive", onPress: () => {} },
              { text: "Cancel", style: "cancel" },
            ])
          }
        >
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {chat.messages.length === 0 ? (
          <EmptyChatState colors={colors} onSelectPrompt={(p) => handleSend(p)} />
        ) : (
          <FlatList
            ref={listRef}
            data={chat.messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          />
        )}

        <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Pressable onPress={handleAttachment} hitSlop={8} style={styles.iconBtn}>
            <Ionicons name="add-circle-outline" size={26} color={colors.textSecondary} />
          </Pressable>
          <View style={[styles.textInputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Message AI Chat..."
              placeholderTextColor={colors.textMuted}
              style={[styles.textInput, { color: colors.text }]}
              multiline
              maxLength={2000}
            />
          </View>
          {input.trim().length > 0 ? (
            <Pressable onPress={() => handleSend()} style={[styles.sendBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          ) : (
            <Pressable onPress={handleVoice} hitSlop={8} style={styles.iconBtn}>
              <Ionicons name="mic-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EmptyChatState({ colors, onSelectPrompt }) {
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.emptyState}>
      <View style={[styles.emptyIconWrap, { backgroundColor: colors.primary + "18" }]}>
        <Ionicons name="sparkles" size={34} color={colors.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Start a conversation</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Ask anything, or try one of these prompts to get going
      </Text>
      <View style={styles.suggestionsWrap}>
        {PROMPT_SUGGESTIONS.map((item, i) => (
          <PromptSuggestionCard
            key={item.id}
            item={item}
            index={i}
            onPress={() => onSelectPrompt(item.prompt)}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  backBtn: { marginRight: spacing.sm },
  headerCenter: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: fontSizes.md, fontWeight: "700" },
  headerSubtitle: { fontSize: fontSizes.xs, marginTop: 1 },
  messagesList: { padding: spacing.md, paddingBottom: spacing.lg },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    gap: 6,
  },
  iconBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  textInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    maxHeight: 120,
    justifyContent: "center",
  },
  textInput: {
    fontSize: fontSizes.md,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIconWrap: {
    width: 76,
    height: 76,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  emptyTitle: { fontSize: fontSizes.xl, fontWeight: "800" },
  emptySubtitle: { fontSize: fontSizes.sm, textAlign: "center", marginTop: spacing.xs, marginBottom: spacing.lg },
  suggestionsWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm },
});

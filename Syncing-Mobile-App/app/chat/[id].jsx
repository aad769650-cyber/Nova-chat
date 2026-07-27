// app/chat/[id].jsx
import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChats } from "../../src/context/ChatContext";
import { useAppTheme } from "../../src/context/ThemeContext";
import ChatBubble from "../../src/components/ChatBubble";
import TypingIndicator from "../../src/components/TypingIndicator";
import { PROMPT_SUGGESTIONS } from "../../src/data/promptSuggestions";

export default function ChatScreen() {
  const { id, draft: draftParam } = useLocalSearchParams();
  const router = useRouter();
  const { getChat, sendMessage, clearChat, typingChatId } = useChats();
  const { paperTheme } = useAppTheme();
  const [draft, setDraft] = useState(typeof draftParam === "string" ? draftParam : "");
  const [isRecording, setIsRecording] = useState(false);
  const listRef = useRef(null);

  const chat = getChat(id);
  const isTyping = typingChatId === id;

  useEffect(() => {
    if (chat?.messages?.length) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [chat?.messages?.length, isTyping]);

  if (!chat) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <Text style={{ color: paperTheme.colors.onSurfaceVariant, textAlign: "center", marginTop: 40 }}>
          This chat no longer exists.
        </Text>
      </SafeAreaView>
    );
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(chat.id, draft);
    setDraft("");
  };

  const handleAttachment = () => {
    Alert.alert("Attachments", "File attachments are coming in a future update.");
  };

  const handleVoice = () => {
    setIsRecording((v) => !v);
    Alert.alert("Voice input", isRecording ? "Stopped listening." : "Voice capture is a UI preview in this MVP.");
  };

  const handleClear = () => {
    Alert.alert("Clear chat", "Remove every message in this conversation?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: () => clearChat(chat.id) },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: paperTheme.colors.background }]} edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: paperTheme.colors.outline }]}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={22} color={paperTheme.colors.onSurface} />
          </Pressable>
          <Text numberOfLines={1} style={[styles.headerTitle, { color: paperTheme.colors.onSurface }]}>
            {chat.title}
          </Text>
          <Pressable onPress={handleClear} hitSlop={10}>
            <Ionicons name="trash-outline" size={19} color={paperTheme.colors.onSurfaceVariant} />
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={chat.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messagesContent}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="sparkles-outline" size={28} color={paperTheme.colors.onSurfaceVariant} />
              <Text style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 8, fontSize: 13 }}>
                Say hello, or try a suggestion below.
              </Text>
              <View style={styles.suggestions}>
                {PROMPT_SUGGESTIONS.map((s) => (
                  <Pressable
                    key={s}
                    onPress={() => setDraft(s)}
                    style={[styles.chip, { backgroundColor: paperTheme.colors.surfaceVariant }]}
                  >
                    <Text style={{ color: paperTheme.colors.onSurface, fontSize: 12.5 }}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          }
        />

        <View
          style={[
            styles.composer,
            { borderTopColor: paperTheme.colors.outline, backgroundColor: paperTheme.colors.background },
          ]}
        >
          <Pressable onPress={handleAttachment} style={styles.iconButton} hitSlop={8}>
            <Ionicons name="attach-outline" size={20} color={paperTheme.colors.onSurfaceVariant} />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message NovaChat…"
            placeholderTextColor={paperTheme.colors.onSurfaceVariant}
            multiline
            style={[styles.input, { color: paperTheme.colors.onSurface, backgroundColor: paperTheme.colors.surface }]}
          />
          <Pressable onPress={handleVoice} style={styles.iconButton} hitSlop={8}>
            <Ionicons
              name={isRecording ? "mic" : "mic-outline"}
              size={20}
              color={isRecording ? paperTheme.colors.primary : paperTheme.colors.onSurfaceVariant}
            />
          </Pressable>
          <Pressable
            onPress={handleSend}
            disabled={!draft.trim()}
            style={[styles.sendButton, { backgroundColor: paperTheme.colors.primary, opacity: draft.trim() ? 1 : 0.4 }]}
          >
            <Ionicons name="send" size={16} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 14.5, fontWeight: "600", marginHorizontal: 12 },
  messagesContent: { padding: 16, flexGrow: 1 },
  emptyState: { alignItems: "center", marginTop: 60, paddingHorizontal: 24 },
  suggestions: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 16 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  iconButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, maxHeight: 100, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 9, fontSize: 13.5 },
  sendButton: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
});

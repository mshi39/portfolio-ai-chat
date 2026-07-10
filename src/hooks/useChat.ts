import { useCallback, useEffect, useRef, useState } from "react";
import { ChatApiError, streamChat } from "../services/chatApi";
import type { ApiChatMessage, ChatMessage } from "../types/chat";
import { collectPageContext } from "../utils/pageContext";

const SESSION_KEY = "melissa-ai-chat-history";
const FALLBACK_ERROR = "I'm having trouble connecting right now. Please try again in a moment.";

function createMessage(role: "user" | "assistant", content: string, status: ChatMessage["status"] = "complete"): ChatMessage {
  return { id: crypto.randomUUID(), role, content, status };
}

function restoreMessages(): ChatMessage[] {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is ChatMessage => Boolean(item && typeof item === "object" && "id" in item && "role" in item && "content" in item));
  } catch { return []; }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(restoreMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamingRef = useRef(false);

  useEffect(() => {
    try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages.filter((message) => message.status !== "streaming"))); } catch { /* Session storage is optional. */ }
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    const clean = content.trim();
    if (!clean || streamingRef.current) return false;

    streamingRef.current = true;
    setIsStreaming(true);
    const userMessage = createMessage("user", clean);
    const assistantMessage = createMessage("assistant", "", "streaming");
    const requestHistory: ApiChatMessage[] = messages
      .filter((message) => message.status !== "error" && message.content.trim())
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }));
    requestHistory.push({ role: "user", content: clean });
    setMessages((current) => [...current, userMessage, assistantMessage]);

    try {
      await streamChat({
        messages: requestHistory,
        pageContext: collectPageContext(),
        onDelta: (delta) => setMessages((current) => current.map((message) =>
          message.id === assistantMessage.id ? { ...message, content: message.content + delta } : message
        )),
      });
      setMessages((current) => current.map((message) =>
        message.id === assistantMessage.id ? { ...message, status: "complete" } : message
      ));
    } catch (error) {
      const message = error instanceof ChatApiError ? error.message : FALLBACK_ERROR;
      setMessages((current) => current.map((item) =>
        item.id === assistantMessage.id ? { ...item, content: message, status: "error" } : item
      ));
    } finally {
      streamingRef.current = false;
      setIsStreaming(false);
    }
    return true;
  }, [messages]);

  return { messages, isStreaming, sendMessage };
}
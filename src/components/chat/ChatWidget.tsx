import { useCallback, useEffect, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";
import { FirstVisitCallout } from "./FirstVisitCallout";

const CALLOUT_STORAGE_KEY = "melissa-chat-callout-seen";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCallout, setShowCallout] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, isStreaming, sendMessage } = useChat();

  const dismissCallout = useCallback(() => {
    setShowCallout(false);
    try { window.localStorage.setItem(CALLOUT_STORAGE_KEY, "true"); } catch { /* Storage is optional. */ }
  }, []);

  useEffect(() => {
    try {
      const isFirstVisit = window.localStorage.getItem(CALLOUT_STORAGE_KEY) !== "true";
      setShowCallout(isFirstVisit);
      if (isFirstVisit) window.localStorage.setItem(CALLOUT_STORAGE_KEY, "true");
    } catch { setShowCallout(true); }
  }, []);

  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setIsOpen(false); }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  function submit(content: string) {
    if (!content.trim() || isStreaming) return;
    setDraft("");
    void sendMessage(content);
  }

  function toggleChat() {
    if (!isOpen) dismissCallout();
    setIsOpen((current) => !current);
  }

  return <aside className="fixed bottom-4 right-4 z-[2147483000] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" aria-label="Melissa's portfolio assistant">
    {isOpen && <ChatPanel messages={messages} draft={draft} isStreaming={isStreaming} onDraftChange={setDraft} onSend={() => submit(draft)} onSuggestionSelect={submit} onClose={() => setIsOpen(false)} />}
    {!isOpen && showCallout && <FirstVisitCallout onOpenChat={toggleChat} onDismiss={dismissCallout} />}
    <ChatLauncher isOpen={isOpen} onToggle={toggleChat} />
  </aside>;
}

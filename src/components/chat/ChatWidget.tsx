import { useEffect, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { ChatLauncher } from "./ChatLauncher";
import { ChatPanel } from "./ChatPanel";
import { FirstVisitCallout } from "./FirstVisitCallout";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const { messages, isStreaming, sendMessage } = useChat();

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  function submit(content: string) {
    if (!content.trim() || isStreaming) return;
    setDraft("");
    void sendMessage(content);
  }

  function toggleChat() {
    setIsOpen((current) => !current);
  }

  return (
    <aside className="pointer-events-auto fixed bottom-4 right-4 z-[2147483000] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" aria-label="Melissa's portfolio assistant">
      {isOpen && <ChatPanel messages={messages} draft={draft} isStreaming={isStreaming} onDraftChange={setDraft} onSend={() => submit(draft)} onSuggestionSelect={submit} onClose={() => setIsOpen(false)} />}
      {!isOpen && <FirstVisitCallout onOpenChat={toggleChat} />}
      <ChatLauncher isOpen={isOpen} onToggle={toggleChat} />
    </aside>
  );
}

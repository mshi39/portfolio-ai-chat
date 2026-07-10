import type { ChatMessage } from "../../types/chat";
import { useEffect, useMemo, useRef } from "react";
import { AiAvatar } from "./AiAvatar";
import { ChatComposer } from "./ChatComposer";
import { MessageBubble } from "./MessageBubble";
import { SuggestionChips } from "./SuggestionChips";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
interface Props { messages: ChatMessage[]; draft: string; isStreaming: boolean; onDraftChange: (value: string) => void; onSend: () => void; onSuggestionSelect: (question: string) => void; onClose: () => void; }
export function ChatPanel({ messages, draft, isStreaming, onDraftChange, onSend, onSuggestionSelect, onClose }: Props) {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const latestAssistantMessageRef = useRef<HTMLDivElement>(null);
  const started = messages.some((message) => message.role === "user");
  const showTyping = isStreaming && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content;
  const latestAssistantMessageId = useMemo(() => [...messages].reverse().find((message) => message.role === "assistant" && message.content.trim())?.id, [messages]);

  useEffect(() => {
    const viewport = scrollViewportRef.current;
    const message = latestAssistantMessageRef.current;
    if (!viewport || !message) return;

    const viewportRect = viewport.getBoundingClientRect();
    const messageRect = message.getBoundingClientRect();
    const relativeTop = messageRect.top - viewportRect.top;

    if (messageRect.height >= viewport.clientHeight) {
      viewport.scrollTo({ top: viewport.scrollTop + relativeTop, behavior: "smooth" });
      return;
    }

    const isTopVisible = messageRect.top >= viewportRect.top;
    const isBottomVisible = messageRect.bottom <= viewportRect.bottom;
    if (!isTopVisible || !isBottomVisible) {
      message.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages, latestAssistantMessageId]);

  return <section id="melissa-chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-panel-title" className="flex h-[min(680px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-2rem))] origin-bottom-right animate-panel-in flex-col overflow-hidden rounded-[28px] border-2 border-brand/10 bg-white shadow-panel">
    <header className="flex items-center justify-between border-b border-brand/10 bg-brand-wash px-5 py-4"><div className="flex items-center gap-3"><AiAvatar size="medium" /><div><h2 id="chat-panel-title" className="text-sm font-bold text-ink">Ask Melissa&apos;s AI</h2><p className="mt-0.5 text-xs font-semibold text-brand">Portfolio guide</p></div></div><button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-xs font-bold text-brand transition hover:bg-brand-soft sm:hidden">Close</button></header>
    <div ref={scrollViewportRef} className="chat-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-5" aria-live="polite"><div><WelcomeMessage />{!started && <SuggestionChips onSelect={onSuggestionSelect} />}</div>{messages.map((message) => message.status === "streaming" && !message.content ? null : <div key={message.id} ref={message.id === latestAssistantMessageId ? latestAssistantMessageRef : undefined}><MessageBubble message={message} /></div>)}{showTyping && <TypingIndicator />}</div>
    <ChatComposer value={draft} onChange={onDraftChange} onSubmit={onSend} isDisabled={isStreaming} />
  </section>;
}

import type { ChatMessage } from "../../types/chat";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { AiAvatar } from "./AiAvatar";
import { ChatComposer } from "./ChatComposer";
import { MessageBubble } from "./MessageBubble";
import { SuggestionChips } from "./SuggestionChips";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
interface Props { messages: ChatMessage[]; draft: string; isStreaming: boolean; onDraftChange: (value: string) => void; onSend: () => void; onSuggestionSelect: (question: string) => void; onClose: () => void; }
export function ChatPanel({ messages, draft, isStreaming, onDraftChange, onSend, onSuggestionSelect, onClose }: Props) {
  const end = useAutoScroll(messages);
  const started = messages.some((message) => message.role === "user");
  const showTyping = isStreaming && messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content;
  return <section id="melissa-chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-panel-title" className="flex h-[min(680px,calc(100dvh-7rem))] w-[min(400px,calc(100vw-2rem))] origin-bottom-right animate-panel-in flex-col overflow-hidden rounded-[28px] border-2 border-brand/10 bg-white shadow-panel">
    <header className="flex items-center justify-between border-b border-brand/10 bg-brand-wash px-5 py-4"><div className="flex items-center gap-3"><AiAvatar size="medium" /><div><h2 id="chat-panel-title" className="text-sm font-bold text-ink">Ask Melissa&apos;s AI</h2><p className="mt-0.5 text-xs font-semibold text-brand">Portfolio guide</p></div></div><button type="button" onClick={onClose} className="rounded-full px-3 py-1.5 text-xs font-bold text-brand transition hover:bg-brand-soft sm:hidden">Close</button></header>
    <div className="chat-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-5" aria-live="polite"><div><WelcomeMessage />{!started && <SuggestionChips onSelect={onSuggestionSelect} />}</div>{messages.map((message) => message.status === "streaming" && !message.content ? null : <MessageBubble key={message.id} message={message} />)}{showTyping && <TypingIndicator />}<div ref={end} /></div>
    <ChatComposer value={draft} onChange={onDraftChange} onSubmit={onSend} isDisabled={isStreaming} />
  </section>;
}

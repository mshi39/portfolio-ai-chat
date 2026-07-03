import type { ChatMessage } from "../../types/chat";
import { AiAvatar } from "./AiAvatar";
import { MarkdownMessage } from "./MarkdownMessage";

export function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") return <div className="flex min-w-0 justify-end"><p className="max-w-[85%] break-words rounded-2xl rounded-br-md bg-brand px-4 py-3 text-sm leading-5 text-white [overflow-wrap:anywhere] shadow-sm">{message.content}</p></div>;
  return <div className="flex min-w-0 gap-3"><AiAvatar /><div className={"min-w-0 max-w-[calc(100%-2.75rem)] overflow-hidden rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-6 [overflow-wrap:anywhere] " + (message.status === "error" ? "bg-red-50 text-red-700" : "bg-brand-wash text-slate")}><MarkdownMessage content={message.content} /></div></div>;
}

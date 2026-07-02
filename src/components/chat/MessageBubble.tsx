import type { ChatMessage } from "../../types/chat";
import { AiAvatar } from "./AiAvatar";
import { MarkdownMessage } from "./MarkdownMessage";

export function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") return <div className="flex justify-end"><p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand px-4 py-3 text-sm leading-5 text-white shadow-sm">{message.content}</p></div>;
  return <div className="flex gap-3"><AiAvatar /><div className={"max-w-[calc(100%-2.75rem)] rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-6 " + (message.status === "error" ? "bg-red-50 text-red-700" : "bg-brand-wash text-slate")}><MarkdownMessage content={message.content} /></div></div>;
}

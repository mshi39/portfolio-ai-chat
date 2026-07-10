import { getChatApiUrl } from "../config/widgetRuntime";
import type { ApiChatMessage, ChatErrorCode, PageContext, StreamEvent } from "../types/chat";

export class ChatApiError extends Error {
  constructor(public readonly code: ChatErrorCode, message: string) { super(message); this.name = "ChatApiError"; }
}

interface StreamChatOptions { messages: ApiChatMessage[]; pageContext?: PageContext; onDelta: (delta: string) => void; }

const FALLBACK_MESSAGE = "I'm having trouble connecting right now. Please try again in a moment.";

function parseEvent(line: string): StreamEvent | null {
  if (!line.trim()) return null;
  try { return JSON.parse(line) as StreamEvent; } catch { throw new ChatApiError("upstream_error", FALLBACK_MESSAGE); }
}

export async function streamChat({ messages, pageContext, onDelta }: StreamChatOptions): Promise<void> {
  let response: Response;
  try {
    response = await fetch(getChatApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
      body: JSON.stringify({ messages, pageContext }),
    });
  } catch {
    throw new ChatApiError("upstream_error", FALLBACK_MESSAGE);
  }

  if (!response.ok) {
    try {
      const payload = await response.json() as { error?: { code?: ChatErrorCode; message?: string } };
      throw new ChatApiError(payload.error?.code ?? "upstream_error", payload.error?.message ?? FALLBACK_MESSAGE);
    } catch (error) {
      if (error instanceof ChatApiError) throw error;
      throw new ChatApiError("upstream_error", FALLBACK_MESSAGE);
    }
  }
  if (!response.body) throw new ChatApiError("empty_response", "I couldn't generate a response. Please try again.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completed = false;

  let reading = true;
  while (reading) {
    const { done, value } = await reader.read();
    buffer += decoder.decode(value, { stream: !done });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const event = parseEvent(line);
      if (!event) continue;
      if (event.type === "delta") onDelta(event.delta);
      if (event.type === "done") completed = true;
      if (event.type === "error") throw new ChatApiError(event.error.code, event.error.message);
    }
    if (done) { reading = false; break; }
  }

  if (buffer.trim()) {
    const event = parseEvent(buffer);
    if (event?.type === "delta") onDelta(event.delta);
    if (event?.type === "done") completed = true;
    if (event?.type === "error") throw new ChatApiError(event.error.code, event.error.message);
  }
  if (!completed) throw new ChatApiError("empty_response", "I couldn't generate a response. Please try again.");
}
import { openAIConfig } from "../config/openai.js";
import type { ApiChatMessage, StreamEvent } from "../src/types/chat.js";
import { buildModelInput } from "./lib/buildModelInput.js";
import { publicError, type ApiErrorCode } from "./lib/errors.js";
import { learnMoreMarkdown } from "./rag/attribution.js";
import { UNKNOWN_ANSWER } from "./rag/fallback.js";

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}
interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  write(chunk: string): void;
  end(): void;
}
interface OpenAIStreamEvent {
  type?: string;
  delta?: string;
  error?: { code?: string; message?: string };
  response?: {
    error?: { code?: string; message?: string };
    incomplete_details?: { reason?: string };
  };
}


const ALLOWED_ORIGINS = new Set([
  "https://melissashi.com",
  "https://www.melissashi.com",
]);

function requestOrigin(request: ApiRequest): string | undefined {
  const value = request.headers?.origin ?? request.headers?.Origin;
  return Array.isArray(value) ? value[0] : value;
}

function applyCors(request: ApiRequest, response: ApiResponse): boolean {
  const origin = requestOrigin(request);
  if (!origin) return true;
  if (!ALLOWED_ORIGINS.has(origin)) {
    console.warn("[chat-api] Blocked request from disallowed origin:", origin);
    response.status(403).json(publicError("bad_request"));
    return false;
  }
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  response.setHeader("Vary", "Origin");
  return true;
}

const MAX_HISTORY_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 4_000;

function parseMessages(body: unknown): ApiChatMessage[] | null {
  let parsed = body;
  if (typeof body === "string") {
    try { parsed = JSON.parse(body); } catch { return null; }
  }
  if (!parsed || typeof parsed !== "object" || !("messages" in parsed)) return null;
  const messages = (parsed as { messages?: unknown }).messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_HISTORY_MESSAGES) return null;
  const valid = messages.every((message) => {
    if (!message || typeof message !== "object") return false;
    const item = message as Record<string, unknown>;
    return (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" && item.content.trim().length > 0 &&
      item.content.length <= MAX_MESSAGE_LENGTH;
  });
  if (!valid) return null;
  return messages.map((message) => {
    const item = message as { role: "user" | "assistant"; content: string };
    return { role: item.role, content: item.content.trim() };
  });
}

function upstreamErrorCode(status: number): ApiErrorCode {
  if (status === 401 || status === 403) return "configuration_error";
  if (status === 429) return "rate_limit";
  if (status === 408 || status === 504) return "timeout";
  return "upstream_error";
}

function streamErrorCode(code?: string): ApiErrorCode {
  if (code === "insufficient_quota" || code === "rate_limit_exceeded") return "rate_limit";
  if (code === "invalid_api_key") return "configuration_error";
  return "upstream_error";
}

function sendEvent(response: ApiResponse, event: StreamEvent) {
  response.write(JSON.stringify(event) + "\n");
}

function startStream(response: ApiResponse) {
  response.status(200);
  response.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  response.setHeader("Cache-Control", "no-cache, no-transform");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (!applyCors(request, response)) return;
  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST, OPTIONS");
    return response.status(405).json(publicError("bad_request"));
  }
  if (!process.env.OPENAI_API_KEY) {
    console.error("[chat-api] OPENAI_API_KEY is missing from the server environment.");
    return response.status(500).json(publicError("configuration_error"));
  }
  const messages = parseMessages(request.body);
  if (!messages) return response.status(400).json(publicError("bad_request"));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), openAIConfig.timeoutMs);
  let streamStarted = false;

  try {
    const modelInput = await buildModelInput(messages);
    if (!modelInput.hasContext) {
      startStream(response);
      streamStarted = true;
      sendEvent(response, { type: "delta", delta: UNKNOWN_ANSWER });
      sendEvent(response, { type: "done" });
      response.end();
      return;
    }

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: openAIConfig.model,
        instructions: modelInput.instructions,
        input: modelInput.input,
        temperature: openAIConfig.temperature,
        reasoning: openAIConfig.reasoningEffort
          ? { effort: openAIConfig.reasoningEffort }
          : undefined,
        max_output_tokens: openAIConfig.maxOutputTokens,
        stream: openAIConfig.streaming,
      }),
      signal: controller.signal,
    });

    const requestId = openAIResponse.headers.get("x-request-id") ?? "unavailable";
    if (!openAIResponse.ok || !openAIResponse.body) {
      const code = upstreamErrorCode(openAIResponse.status);
      const details = await openAIResponse.text().catch(() => "Unable to read OpenAI error response.");
      console.error("[chat-api] OpenAI request failed", {
        status: openAIResponse.status,
        code,
        requestId,
        details: details.slice(0, 1_000),
      });
      return response.status(openAIResponse.status >= 500 ? 502 : openAIResponse.status).json(publicError(code));
    }

    startStream(response);
    streamStarted = true;

    const reader = openAIResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let receivedText = false;
    let terminalError = false;
    let reading = true;

    while (reading) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const event = JSON.parse(data) as OpenAIStreamEvent;
          if (event.type === "response.output_text.delta" && event.delta) {
            receivedText = true;
            sendEvent(response, { type: "delta", delta: event.delta });
          } else if (event.type === "response.incomplete") {
            terminalError = true;
            console.error("[chat-api] OpenAI response incomplete", {
              reason: event.response?.incomplete_details?.reason ?? "unknown",
              requestId,
            });
            sendEvent(response, {
              type: "error",
              error: publicError("empty_response").error,
            });
          } else if (event.type === "response.failed" || event.type === "error") {
            const providerError = event.response?.error ?? event.error;
            const code = streamErrorCode(providerError?.code);
            terminalError = true;
            console.error("[chat-api] OpenAI stream failed", {
              code,
              providerCode: providerError?.code ?? "unknown",
              requestId,
              details: providerError?.message ?? "No provider error message.",
            });
            sendEvent(response, { type: "error", error: publicError(code).error });
          }
        } catch {
          // Ignore non-JSON keepalive lines from the upstream stream.
        }
      }
      if (done) { reading = false; break; }
    }

    if (!terminalError) {
      if (!receivedText) {
        sendEvent(response, { type: "error", error: publicError("empty_response").error });
      } else {
        const attribution = learnMoreMarkdown(modelInput.sources);
        if (attribution) sendEvent(response, { type: "delta", delta: attribution });
        sendEvent(response, { type: "done" });
      }
    }
    response.end();
  } catch (error) {
    const code = error instanceof Error && error.name === "AbortError" ? "timeout" : "upstream_error";
    console.error("[chat-api] Request processing failed", {
      code,
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unknown server error",
    });
    if (streamStarted) {
      sendEvent(response, { type: "error", error: publicError(code).error });
      return response.end();
    }
    if (code === "timeout") return response.status(504).json(publicError(code));
    return response.status(502).json(publicError(code));
  } finally {
    clearTimeout(timeout);
  }
}

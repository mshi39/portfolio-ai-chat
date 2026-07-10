export type MessageRole = "assistant" | "user";
export type MessageStatus = "streaming" | "complete" | "error";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  status?: MessageStatus;
}

export interface ApiChatMessage {
  role: MessageRole;
  content: string;
}

export interface PageContext {
  currentUrl: string;
  pageTitle: string;
  pageType: string;
  projectOrCaseStudyName: string;
  pageSlug: string;
}

export type ChatErrorCode =
  | "bad_request"
  | "configuration_error"
  | "rate_limit"
  | "timeout"
  | "upstream_error"
  | "empty_response";

export type StreamEvent =
  | { type: "delta"; delta: string }
  | { type: "done" }
  | { type: "error"; error: { code: ChatErrorCode; message: string } };
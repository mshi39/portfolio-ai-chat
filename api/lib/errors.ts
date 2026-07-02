export type ApiErrorCode =
  | "bad_request"
  | "configuration_error"
  | "rate_limit"
  | "timeout"
  | "upstream_error"
  | "empty_response";

export interface PublicApiError {
  error: { code: ApiErrorCode; message: string };
}

export function publicError(code: ApiErrorCode): PublicApiError {
  const messages: Record<ApiErrorCode, string> = {
    bad_request: "That message could not be sent. Please try again.",
    configuration_error: "The chat is not configured yet. Please try again later.",
    rate_limit: "I'm receiving a lot of questions right now. Please try again in a moment.",
    timeout: "That response took too long. Please try again.",
    upstream_error: "I'm having trouble connecting right now. Please try again in a moment.",
    empty_response: "I couldn't generate a response. Please try asking in a different way.",
  };
  return { error: { code, message: messages[code] } };
}

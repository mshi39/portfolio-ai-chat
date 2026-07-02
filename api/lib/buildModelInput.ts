import { SYSTEM_PROMPT } from "../../prompts/systemPrompt";
import type { ApiChatMessage } from "../../src/types/chat";
import type { SourceLink } from "../../src/types/rag";
import { deduplicateSources } from "../rag/attribution";
import { retrieveKnowledge } from "../rag/retrieve";

export interface ModelInput {
  instructions: string;
  input: Array<{ role: "user" | "assistant"; content: string }>;
  hasContext: boolean;
  sources: SourceLink[];
}

export async function buildModelInput(messages: ApiChatMessage[]): Promise<ModelInput> {
  const matches = await retrieveKnowledge(messages);
  const context = matches.map((chunk, index) => [
    "[SOURCE " + (index + 1) + "]",
    "Title: " + chunk.pageTitle,
    "Source type: " + chunk.sourceType,
    "Source URL: " + chunk.sourceUrl,
    chunk.projectName ? "Project: " + chunk.projectName : "",
    "Content:",
    chunk.content,
    "[/SOURCE " + (index + 1) + "]",
  ].filter(Boolean).join("\n")).join("\n\n");

  return {
    instructions: SYSTEM_PROMPT + "\n\nRetrieved approved context:\n" + context,
    input: messages.map(({ role, content }) => ({ role, content })),
    hasContext: matches.length > 0,
    sources: deduplicateSources(matches),
  };
}

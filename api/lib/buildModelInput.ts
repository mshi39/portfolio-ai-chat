import { SYSTEM_PROMPT } from "../../prompts/systemPrompt.js";
import type { ApiChatMessage, PageContext } from "../../src/types/chat.js";
import type { SourceLink } from "../../src/types/rag.js";
import { contextResolutionInstructions, resolveChatContext, retrievalSubjectQuery, type ContextResolution } from "./contextResolver.js";
import { deduplicateSources } from "../rag/attribution.js";
import { retrieveKnowledge } from "../rag/retrieve.js";

export interface ModelInput {
  instructions: string;
  input: Array<{ role: "user" | "assistant"; content: string }>;
  hasContext: boolean;
  sources: SourceLink[];
  contextResolution: ContextResolution;
}

export async function buildModelInput(messages: ApiChatMessage[], pageContext?: PageContext | null): Promise<ModelInput> {
  const contextResolution = resolveChatContext(messages, pageContext);
  const matches = contextResolution.shouldAskClarifyingQuestion
    ? []
    : await retrieveKnowledge(messages, { subjectQuery: retrievalSubjectQuery(contextResolution) });
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
    instructions: SYSTEM_PROMPT + "\n\n" + contextResolutionInstructions(contextResolution, pageContext) + "\n\nRetrieved approved context:\n" + context,
    input: messages.map(({ role, content }) => ({ role, content })),
    hasContext: matches.length > 0,
    sources: deduplicateSources(matches),
    contextResolution,
  };
}
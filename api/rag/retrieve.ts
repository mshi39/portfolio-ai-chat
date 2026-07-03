import { ragConfig } from "../../config/rag.js";
import type { ApiChatMessage } from "../../src/types/chat.js";
import type { KnowledgeChunk, RetrievedChunk } from "../../src/types/rag.js";
import { getKnowledgeBase } from "./knowledgeBase.js";
import { embedQuery } from "./openaiEmbeddings.js";

export function cosineSimilarity(left: number[], right: number[]): number {
  if (!left.length || left.length !== right.length) return -1;
  let dot = 0, leftMagnitude = 0, rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index]; leftMagnitude += left[index] ** 2; rightMagnitude += right[index] ** 2;
  }
  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return denominator ? dot / denominator : -1;
}

function retrievalQuery(messages: ApiChatMessage[]): string {
  const userMessages = messages.filter((message) => message.role === "user");
  const latest = userMessages.at(-1)?.content ?? "";
  if (latest.length >= 45 || userMessages.length < 2) return latest;
  return userMessages.slice(-2).map((message) => message.content).join("\nFollow-up: ");
}

export async function retrieveKnowledge(messages: ApiChatMessage[]): Promise<RetrievedChunk[]> {
  const knowledgeBase = await getKnowledgeBase();
  if (!knowledgeBase.chunks.length) { console.warn("[rag] Knowledge base is empty. Run npm run ingest."); return []; }
  if (knowledgeBase.embeddingModel !== ragConfig.embeddingModel) {
    console.error("[rag] Embedding model mismatch", { stored: knowledgeBase.embeddingModel, configured: ragConfig.embeddingModel });
    throw new Error("Knowledge base must be rebuilt for the configured embedding model.");
  }
  const queryEmbedding = await embedQuery(retrievalQuery(messages));
  return knowledgeBase.chunks.map((chunk: KnowledgeChunk) => ({ ...chunk, similarity: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .filter((chunk) => chunk.similarity >= ragConfig.minSimilarity)
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, ragConfig.topK);
}

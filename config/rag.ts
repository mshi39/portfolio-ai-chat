function optionalNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const ragConfig = {
  embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small",
  topK: Math.max(1, Math.floor(optionalNumber(process.env.RAG_TOP_K, 5))),
  minSimilarity: Math.min(1, Math.max(-1, optionalNumber(process.env.RAG_MIN_SIMILARITY, 0.35))),
  knowledgeBasePath: process.env.RAG_KNOWLEDGE_BASE_PATH ?? "data/knowledge/chunks.json",
} as const;

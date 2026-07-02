export type KnowledgeSourceType = "portfolio" | "resume" | "linkedin" | "medium" | "manual";

export interface KnowledgeChunk {
  id: string;
  title: string;
  content: string;
  sourceType: KnowledgeSourceType;
  sourceUrl: string;
  pageTitle: string;
  projectName?: string;
  tags: string[];
  lastUpdated?: string;
  embedding: number[];
}

export interface KnowledgeBase {
  version: 1;
  embeddingModel: string;
  generatedAt: string | null;
  chunks: KnowledgeChunk[];
}

export interface RetrievedChunk extends KnowledgeChunk {
  similarity: number;
}

export interface SourceLink {
  label: string;
  url: string;
  sourceType: KnowledgeSourceType;
}

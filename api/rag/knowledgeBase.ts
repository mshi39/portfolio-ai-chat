import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ragConfig } from "../../config/rag.js";
import type { KnowledgeBase } from "../../src/types/rag.js";

let cachedKnowledgeBase: Promise<KnowledgeBase> | null = null;

function validateKnowledgeBase(value: unknown): KnowledgeBase {
  if (!value || typeof value !== "object") throw new Error("Knowledge base is invalid.");
  const candidate = value as Partial<KnowledgeBase>;
  if (candidate.version !== 1 || typeof candidate.embeddingModel !== "string" || !Array.isArray(candidate.chunks)) throw new Error("Knowledge base schema is invalid.");
  return candidate as KnowledgeBase;
}

export function getKnowledgeBase(): Promise<KnowledgeBase> {
  if (!cachedKnowledgeBase) {
    const absolutePath = resolve(process.cwd(), ragConfig.knowledgeBasePath);
    cachedKnowledgeBase = readFile(absolutePath, "utf8").then((text) => validateKnowledgeBase(JSON.parse(text))).catch((error) => {
      cachedKnowledgeBase = null;
      throw error;
    });
  }
  return cachedKnowledgeBase;
}

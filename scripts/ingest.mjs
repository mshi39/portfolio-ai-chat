import { rename, writeFile } from "node:fs/promises";
import { chunkDocument } from "./lib/text.mjs";
import { embedChunks } from "./lib/embeddings.mjs";
import { loadLocalEnv } from "./lib/env.mjs";
import { loadMarkdownKnowledge } from "./lib/markdown-sources.mjs";
await loadLocalEnv();
const embeddingModel = process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
const outputPath = process.env.RAG_KNOWLEDGE_BASE_PATH ?? "data/knowledge/chunks.json";
try {
  console.log("Loading canonical Markdown knowledge base...");
  const documents = await loadMarkdownKnowledge();
  if (!documents.length) throw new Error("No Markdown knowledge files were found in data/knowledge/manual.");
  console.log("Loaded " + documents.length + " canonical Markdown documents.");
  const chunks = documents.flatMap((document) => chunkDocument(document)).filter((chunk) => chunk.content.length >= 80);
  if (!chunks.length) throw new Error("Markdown content did not produce any meaningful chunks.");
  console.log("Created " + chunks.length + " meaningful chunks.");
  const embeddedChunks = await embedChunks(chunks, { apiKey: process.env.OPENAI_API_KEY, model: embeddingModel });
  const knowledgeBase = { version: 1, embeddingModel, generatedAt: new Date().toISOString(), chunks: embeddedChunks };
  const temporaryPath = outputPath + ".tmp";
  await writeFile(temporaryPath, JSON.stringify(knowledgeBase, null, 2) + "\n", "utf8");
  await rename(temporaryPath, outputPath);
  console.log("Generated embeddings successfully.");
  console.log("Saved knowledge base to " + outputPath + ".");
} catch (error) {
  console.error("Ingestion stopped: " + (error instanceof Error ? error.message : "Unknown error"));
  console.error("The previous knowledge base was not changed.");
  process.exitCode = 1;
}

import { readFile } from "node:fs/promises";
import { createEmbeddings } from "./lib/embeddings.mjs";
import { loadLocalEnv } from "./lib/env.mjs";
function cosineSimilarity(left, right) {
  if (left.length !== right.length || !left.length) return -1;
  let dot = 0, leftMagnitude = 0, rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) { dot += left[index] * right[index]; leftMagnitude += left[index] ** 2; rightMagnitude += right[index] ** 2; }
  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return denominator ? dot / denominator : -1;
}
await loadLocalEnv();
const query = process.argv.slice(2).join(" ").trim();
if (!query) { console.error("Usage: npm run rag:test -- \"Tell me about Melissa's enterprise UX experience\""); process.exitCode = 1; }
else {
  try {
    const path = process.env.RAG_KNOWLEDGE_BASE_PATH ?? "data/knowledge/chunks.json";
    const knowledgeBase = JSON.parse(await readFile(path, "utf8"));
    if (!knowledgeBase.chunks.length) throw new Error("Knowledge base is empty. Run npm run ingest first.");
    const model = process.env.OPENAI_EMBEDDING_MODEL ?? knowledgeBase.embeddingModel;
    if (model !== knowledgeBase.embeddingModel) throw new Error("Embedding model differs from the stored knowledge base. Run npm run ingest again.");
    const [queryEmbedding] = await createEmbeddings([query], { apiKey: process.env.OPENAI_API_KEY, model });
    const topK = Math.max(1, Number.parseInt(process.env.RAG_TOP_K ?? "5", 10));
    const matches = knowledgeBase.chunks.map((chunk) => ({ ...chunk, similarity: cosineSimilarity(queryEmbedding, chunk.embedding) })).sort((a, b) => b.similarity - a.similarity).slice(0, topK);
    console.log("Query: " + query); console.log("Top " + matches.length + " retrieved chunks:");
    for (const [index, match] of matches.entries()) { console.log("\n" + (index + 1) + ". " + match.title); console.log("   Similarity: " + match.similarity.toFixed(4)); console.log("   Source: " + match.sourceUrl); }
  } catch (error) { console.error("Retrieval test failed: " + (error instanceof Error ? error.message : "Unknown error")); process.exitCode = 1; }
}

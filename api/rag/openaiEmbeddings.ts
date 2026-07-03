import { ragConfig } from "../../config/rag.js";

interface EmbeddingResponse { data: Array<{ index: number; embedding: number[] }>; }

export async function embedQuery(input: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing.");
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: ragConfig.embeddingModel, input, encoding_format: "float" }),
  });
  if (!response.ok) {
    const requestId = response.headers.get("x-request-id") ?? "unavailable";
    const detail = await response.text();
    console.error("[rag] Query embedding failed", { status: response.status, requestId, detail: detail.slice(0, 500) });
    throw new Error("Unable to create query embedding.");
  }
  const payload = await response.json() as EmbeddingResponse;
  const embedding = payload.data[0]?.embedding;
  if (!embedding?.length) throw new Error("Embedding response was empty.");
  return embedding;
}

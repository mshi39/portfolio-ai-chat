const EMBEDDINGS_URL = "https://api.openai.com/v1/embeddings";
export async function createEmbeddings(inputs, { apiKey, model }) {
  if (!apiKey) throw new Error("OPENAI_API_KEY is missing. Add it to .env.local before ingesting.");
  const response = await fetch(EMBEDDINGS_URL, { method: "POST", headers: { Authorization: "Bearer " + apiKey, "Content-Type": "application/json" }, body: JSON.stringify({ model, input: inputs, encoding_format: "float" }) });
  if (!response.ok) {
    const requestId = response.headers.get("x-request-id") ?? "unavailable";
    const detail = await response.text();
    throw new Error("OpenAI embeddings failed (" + response.status + ", request " + requestId + "): " + detail.slice(0, 500));
  }
  const payload = await response.json();
  const ordered = [...payload.data].sort((a, b) => a.index - b.index).map((item) => item.embedding);
  if (ordered.length !== inputs.length) throw new Error("OpenAI returned an unexpected number of embeddings.");
  return ordered;
}
export async function embedChunks(chunks, options) {
  const batchSize = 50;
  const embedded = [];
  for (let start = 0; start < chunks.length; start += batchSize) {
    const batch = chunks.slice(start, start + batchSize);
    const inputs = batch.map((chunk) => chunk.pageTitle + "\n" + (chunk.projectName ?? "") + "\n" + chunk.content);
    const vectors = await createEmbeddings(inputs, options);
    embedded.push(...batch.map((chunk, index) => ({ ...chunk, embedding: vectors[index] })));
    console.log("Embedded " + Math.min(start + batch.length, chunks.length) + " of " + chunks.length + " chunks.");
  }
  return embedded;
}

import { ragConfig } from "../../config/rag.js";
import type { ApiChatMessage } from "../../src/types/chat.js";
import type { KnowledgeChunk, RetrievedChunk } from "../../src/types/rag.js";
import { getKnowledgeBase } from "./knowledgeBase.js";
import { embedQuery } from "./openaiEmbeddings.js";

interface RetrieveKnowledgeOptions { subjectQuery?: string; }

const IMPACT_QUERY_PATTERN = /\b(impact|impacts|outcome|outcomes|result|results|achievement|achievements|accomplish|accomplished|made|metric|metrics|value)\b/i;
const IMPACT_EVIDENCE_PATTERN = /\b(impact|outcome|result|reduced|reduce|increased|increase|saved|save|slashed|decreased|decrease|boosted|improved|adopted|launched|centralized|consolidated|streamlined|training time|conversion|capture|efficiency|overhead|wait time|hours|program creation|completion rate|reduction|growth|mvp|roadmap)\b|\b\d+(?:\.\d+)?\s*(?:%|x|hours?|systems?|applications?|programs?)\b|\$\d+/i;

export function cosineSimilarity(left: number[], right: number[]): number {
  if (!left.length || left.length !== right.length) return -1;
  let dot = 0, leftMagnitude = 0, rightMagnitude = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index]; leftMagnitude += left[index] ** 2; rightMagnitude += right[index] ** 2;
  }
  const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
  return denominator ? dot / denominator : -1;
}

function latestUserMessage(messages: ApiChatMessage[]): string {
  return messages.filter((message) => message.role === "user").at(-1)?.content ?? "";
}

function isImpactQuestion(messages: ApiChatMessage[]): boolean {
  return IMPACT_QUERY_PATTERN.test(latestUserMessage(messages));
}

function retrievalQuery(messages: ApiChatMessage[], options: RetrieveKnowledgeOptions = {}): string {
  const userMessages = messages.filter((message) => message.role === "user");
  const latest = userMessages.at(-1)?.content ?? "";
  const baseQuery = latest.length >= 45 || userMessages.length < 2 ? latest : userMessages.slice(-2).map((message) => message.content).join("\nFollow-up: ");
  const queryParts = options.subjectQuery ? [options.subjectQuery, baseQuery] : [baseQuery];

  if (isImpactQuestion(messages)) {
    queryParts.push(
      "Melissa Shi portfolio resume measurable impact outcomes results achievements metrics.",
      "Look for evidence of business impact, user impact, product impact, research impact, adoption, roadmap influence, efficiency gains, reduced wait time, reduced overhead, increased conversion, increased feedback capture, saved hours, training time reduction, systems consolidated, programs created, completion rates, and launched or adopted product improvements.",
    );
  }

  return queryParts.join("\n");
}

function hasImpactEvidence(chunk: KnowledgeChunk): boolean {
  const searchableText = [chunk.title, chunk.pageTitle, chunk.projectName, chunk.content].filter(Boolean).join("\n");
  return IMPACT_EVIDENCE_PATTERN.test(searchableText);
}

function impactRankingBoost(chunk: KnowledgeChunk, shouldBoost: boolean): number {
  if (!shouldBoost) return 0;
  let boost = 0;
  if (hasImpactEvidence(chunk)) boost += 0.08;
  if (chunk.sourceType === "portfolio") boost += 0.03;
  if (chunk.sourceType === "resume") boost += 0.02;
  return boost;
}

type RankedChunk = KnowledgeChunk & { similarity: number; rankingScore: number };

function selectImpactMatches(candidates: RankedChunk[], topK: number): RankedChunk[] {
  const selected: RankedChunk[] = [];
  const add = (chunk: RankedChunk | undefined) => {
    if (chunk && !selected.some((selectedChunk) => selectedChunk.id === chunk.id)) selected.push(chunk);
  };

  add(candidates.find((chunk) => chunk.sourceType === "resume"));
  for (const chunk of candidates.filter((candidate) => candidate.sourceType === "portfolio" && hasImpactEvidence(candidate)).slice(0, 2)) add(chunk);
  for (const chunk of candidates) {
    if (selected.length >= topK) break;
    add(chunk);
  }

  return selected.slice(0, topK);
}

export async function retrieveKnowledge(messages: ApiChatMessage[], options: RetrieveKnowledgeOptions = {}): Promise<RetrievedChunk[]> {
  const knowledgeBase = await getKnowledgeBase();
  if (!knowledgeBase.chunks.length) { console.warn("[rag] Knowledge base is empty. Run npm run ingest."); return []; }
  if (knowledgeBase.embeddingModel !== ragConfig.embeddingModel) {
    console.error("[rag] Embedding model mismatch", { stored: knowledgeBase.embeddingModel, configured: ragConfig.embeddingModel });
    throw new Error("Knowledge base must be rebuilt for the configured embedding model.");
  }
  const shouldBoostImpact = isImpactQuestion(messages);
  const queryEmbedding = await embedQuery(retrievalQuery(messages, options));
  const candidates = knowledgeBase.chunks.map((chunk: KnowledgeChunk) => {
    const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
    return { ...chunk, similarity, rankingScore: similarity + impactRankingBoost(chunk, shouldBoostImpact) };
  })
    .filter((chunk) => chunk.similarity >= ragConfig.minSimilarity)
    .sort((left, right) => right.rankingScore - left.rankingScore);

  const matches = shouldBoostImpact ? selectImpactMatches(candidates, ragConfig.topK) : candidates.slice(0, ragConfig.topK);
  return matches.map(({ rankingScore: _rankingScore, ...chunk }) => chunk);
}
import type { RetrievedChunk, SourceLink } from "../../src/types/rag.js";

function sourceLabel(chunk: RetrievedChunk): string {
  if (chunk.sourceType === "resume") return "View my resume";
  if (chunk.sourceType === "linkedin") return "View my LinkedIn";
  if (chunk.sourceType === "medium") return "Read the full article";
  if (chunk.projectName) return "View the " + chunk.projectName + " case study";
  return "Explore my portfolio";
}

export function deduplicateSources(chunks: RetrievedChunk[]): SourceLink[] {
  const seen = new Set<string>();
  const sources: SourceLink[] = [];
  for (const chunk of chunks) {
    if (!chunk.sourceUrl || seen.has(chunk.sourceUrl)) continue;
    seen.add(chunk.sourceUrl);
    sources.push({ label: sourceLabel(chunk), url: chunk.sourceUrl, sourceType: chunk.sourceType });
  }
  return sources;
}

export function learnMoreMarkdown(sources: SourceLink[]): string {
  if (!sources.length) return "";
  return "\n\n**Learn more**\n" + sources.map((source) => "- [" + source.label + "](" + source.url + ")").join("\n");
}

import type { RetrievedChunk, SourceLink } from "../../src/types/rag.js";

function sourceLabel(chunk: RetrievedChunk): string {
  if (chunk.chapterLabel) return "View " + chunk.chapterLabel;
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
    const url = chunk.chapterId ? chunk.sourceUrl.split("#")[0] + "#" + chunk.chapterId : chunk.sourceUrl;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    sources.push({ label: sourceLabel(chunk), url, sourceType: chunk.sourceType, chapterId: chunk.chapterId, chapterLabel: chunk.chapterLabel });
  }
  return sources;
}

export function learnMoreMarkdown(sources: SourceLink[]): string {
  if (!sources.length) return "";
  return "\n\n**Learn more**\n" + sources.map((source) => "- [" + source.label + "](" + source.url + ")").join("\n");
}

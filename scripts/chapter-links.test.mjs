import assert from "node:assert/strict";
import test from "node:test";
import { deduplicateSources, learnMoreMarkdown } from "../api/rag/attribution.ts";
import { loadMarkdownKnowledge } from "./lib/markdown-sources.mjs";
import { chunkDocument } from "./lib/text.mjs";

test("retrieved case-study sections link Learn more to their mapped chapters", () => {
  const chunks = chunkDocument({
    title: "Example case study",
    content: "# Overview\n\nOverview content long enough to become a useful searchable knowledge chunk.\n\n# Results\n\nResults content long enough to become a useful searchable knowledge chunk.",
    sourceType: "portfolio",
    sourceUrl: "https://www.melissashi.com/work/example",
    pageTitle: "Example case study",
    projectName: "Example case study",
    tags: [],
    chapterMappings: [
      { id: "overview", label: "Overview", knowledgeHeadings: ["Overview"] },
      { id: "results", label: "Results", knowledgeHeadings: ["Results"] },
    ],
  }, { targetSize: 40, maxSize: 120 });

  const results = chunks.find((chunk) => chunk.chapterId === "results");
  assert.ok(results, "Results content should retain its chapter mapping");
  assert.equal(
    learnMoreMarkdown(deduplicateSources([results])),
    "\n\n**Learn more**\n- [View Results](https://www.melissashi.com/work/example#results)",
  );
});

test("the canonical project loader applies the live chapter mapping", async () => {
  const documents = await loadMarkdownKnowledge();
  const project = documents.find((document) => document.canonicalFile === "Projects/voc-revamp.md");
  assert.ok(project);
  const chunks = chunkDocument(project);
  assert.ok(chunks.some((chunk) => chunk.chapterId === "architecture"));
});

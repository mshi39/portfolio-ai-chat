import { createHash } from "node:crypto";
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
export function decodeHtml(value) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const hex = entity[1]?.toLowerCase() === "x";
      const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}
export function htmlToText(html) {
  return decodeHtml(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<\/(p|div|section|article|header|footer|main|h[1-6]|li|ul|ol)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
}
export function cleanText(value) {
  return value.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/ *\n */g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
export function extractHtmlTitle(html, fallback) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return cleanText(match ? htmlToText(match[1]) : fallback);
}
export function extractLinks(html, baseUrl) {
  const links = new Set();
  for (const match of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    try { links.add(new URL(match[1], baseUrl).href); } catch { /* Ignore malformed links. */ }
  }
  return [...links];
}
export function chunkDocument(document, options = {}) {
  const targetSize = options.targetSize ?? 1200;
  const maxSize = options.maxSize ?? 1700;
  const paragraphs = cleanText(document.content).split(/\n{2,}|(?<=[.!?])\n/).map(cleanText).filter(Boolean);
  const chaptersByHeading = new Map((document.chapterMappings ?? []).flatMap((chapter) =>
    chapter.knowledgeHeadings.map((heading) => [heading.toLowerCase(), chapter])
  ));
  const groups = [];
  let current = [];
  let currentChapter;
  let length = 0;
  const flush = () => {
    if (current.length) groups.push({ paragraphs: current, chapter: currentChapter });
  };
  for (const paragraph of paragraphs) {
    const heading = paragraph.match(/^#{1,6}\s+(.+)$/)?.[1]?.trim().toLowerCase();
    const nextChapter = heading ? chaptersByHeading.get(heading) : undefined;
    if (nextChapter && nextChapter.id !== currentChapter?.id) {
      flush();
      current = [];
      length = 0;
      currentChapter = nextChapter;
    }
    if (current.length && (length + paragraph.length > maxSize || length >= targetSize)) {
      flush();
      const overlap = current.at(-1);
      current = overlap && overlap.length < 350 ? [overlap] : [];
      length = current.reduce((sum, item) => sum + item.length + 2, 0);
    }
    current.push(paragraph);
    length += paragraph.length + 2;
  }
  flush();
  return groups.map((group, index) => ({
    id: createHash("sha256").update(document.sourceUrl + "|" + index + "|" + group.paragraphs.join("\n\n")).digest("hex").slice(0, 20),
    title: groups.length > 1 ? document.title + " — Part " + (index + 1) : document.title,
    content: group.paragraphs.join("\n\n"), sourceType: document.sourceType, sourceUrl: document.sourceUrl,
    pageTitle: document.pageTitle || document.title,
    ...(document.projectName ? { projectName: document.projectName } : {}),
    ...(group.chapter ? { chapterId: group.chapter.id, chapterLabel: group.chapter.label } : {}),
    tags: document.tags ?? [], ...(document.lastUpdated ? { lastUpdated: document.lastUpdated } : {}),
  }));
}

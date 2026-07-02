import { readdir, readFile } from "node:fs/promises";
import { basename, join, relative } from "node:path";
import { cleanText } from "./text.mjs";
const MANUAL_ROOT = "data/knowledge/manual";
const DEFAULTS = {
  "resume.md": { title: "Melissa Shi Resume", sourceType: "resume", sourceUrl: "https://docs.google.com/document/d/1Fqb5aADwMucxJWs6w3dG7t9gxN_xnQDD/edit?usp=sharing", tags: ["resume", "experience", "skills"] },
  "linkedin.md": { title: "Melissa Shi LinkedIn", sourceType: "linkedin", sourceUrl: "https://www.linkedin.com/in/melissaxshi", tags: ["linkedin", "experience", "career"] },
  "medium.md": { title: "How to Build Trust with Clients and Showcase UX Value in a Short Time", sourceType: "medium", sourceUrl: "https://medium.com/design-at-exxonmobil/how-to-build-trust-with-clients-and-showcase-ux-value-in-a-short-time-50c1c7858211", tags: ["medium", "ux value", "client trust", "exxonmobil"] },
};
async function markdownPaths(directory = MANUAL_ROOT) {
  const paths = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) paths.push(...await markdownPaths(path));
    else if (entry.name.toLowerCase().endsWith(".md") && entry.name.toLowerCase() !== "readme.md") paths.push(path);
  }
  return paths.sort();
}
function frontmatter(text) {
  const match = text.match(/^\s*---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { metadata: {}, body: text };
  const metadata = {};
  let currentList = null;
  for (const line of match[1].split(/\r?\n/)) {
    const pair = line.match(/^([A-Za-z][\w ]*):\s*(.*)$/);
    if (pair) { const key = pair[1].trim().toLowerCase().replace(/\s+/g, ""); metadata[key] = pair[2].trim(); currentList = key; }
    else if (currentList && /^\s*-\s+/.test(line)) { const existing = Array.isArray(metadata[currentList]) ? metadata[currentList] : []; metadata[currentList] = [...existing, line.replace(/^\s*-\s+/, "").trim()]; }
  }
  return { metadata, body: text.slice(match[0].length) };
}
function headerMetadata(text) {
  const separator = text.indexOf("\n---");
  const header = separator >= 0 ? text.slice(0, separator) : text.slice(0, 1500);
  const value = (label) => header.match(new RegExp("^" + label + "\\s*:\\s*(.+)$", "im"))?.[1]?.trim();
  const tags = [];
  const headerLines = header.split(/\r?\n/);
  const tagsIndex = headerLines.findIndex((line) => /^Tags\s*:/i.test(line));
  if (tagsIndex >= 0) {
    for (const line of headerLines.slice(tagsIndex + 1)) {
      if (!/^\s*-\s+/.test(line)) break;
      tags.push(line.replace(/^\s*-\s+/, "").trim());
    }
  }
  return { projectName: value("Project Name"), sourceUrl: value("Source URL"), sourceType: value("Source Type"), access: value("Access"), lastUpdated: value("Last updated"), tags, body: value("Project Name") && separator >= 0 ? text.slice(separator + 4) : text };
}
function headingValue(text, heading) { return text.match(new RegExp("^#{1,3}\\s+" + heading + "\\s*\\n+([^\\n]+)", "im"))?.[1]?.trim(); }
function firstTitle(text, fallback) {
  const headings = [...text.matchAll(/^#\s+(.+)$/gm)].map((match) => match[1].trim()).filter((title) => title.toLowerCase() !== "title");
  return headingValue(text, "Title") ?? headings[0] ?? fallback;
}
function normalizeSourceType(value, path) {
  const normalized = value?.trim().toLowerCase();
  if (["portfolio", "resume", "linkedin", "medium", "manual"].includes(normalized)) return normalized;
  return path.toLowerCase().includes("projects") ? "portfolio" : "manual";
}
function redactSecrets(text) {
  return text
    .replace(/\s*\*?\(\s*Password\s*:\s*\x60[^\x60]*\x60\s*\)\*?/gi, "")
    .replace(/^.*\b(?:password|passcode)\s*[:=].*$/gim, "")
    .replace(/<!--\s*MANUAL_FALLBACK_TEMPLATE\s*-->/gi, "");
}
export async function loadMarkdownKnowledge() {
  const documents = [];
  for (const path of await markdownPaths()) {
    const raw = await readFile(path, "utf8");
    const parsed = frontmatter(raw);
    const header = headerMetadata(parsed.body);
    const defaults = DEFAULTS[basename(path).toLowerCase()] ?? {};
    const body = cleanText(redactSecrets(header.body));
    if (/(?:password|passcode)\s*[:=]/i.test(body)) throw new Error("Sensitive credential field remains in " + path + ". Remove it before ingestion.");
    if (body.length < 80) { console.warn("Skipped empty Markdown source: " + path); continue; }
    const projectName = parsed.metadata.projectname || header.projectName;
    const sourceUrl = parsed.metadata.sourceurl || header.sourceUrl || headingValue(raw, "Source URL") || defaults.sourceUrl || "";
    const title = parsed.metadata.title || projectName || firstTitle(body, basename(path, ".md"));
    const tags = Array.isArray(parsed.metadata.tags) ? parsed.metadata.tags : header.tags.length ? header.tags : defaults.tags ?? [];
    documents.push({ title, content: body, sourceType: normalizeSourceType(parsed.metadata.sourcetype || header.sourceType || defaults.sourceType, path), sourceUrl, pageTitle: title, ...(projectName ? { projectName } : {}), tags: [...new Set([...tags, "canonical-markdown"])], lastUpdated: parsed.metadata.lastupdated || header.lastUpdated, canonicalFile: relative(MANUAL_ROOT, path).replaceAll("\\", "/") });
  }
  return documents;
}

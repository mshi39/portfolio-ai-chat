import type { PageContext } from "../types/chat";

function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pageTypeFromPath(pathname: string): string {
  const normalized = pathname.toLowerCase();
  if (normalized === "/" || normalized === "") return "home";
  if (normalized.includes("/work/")) return "project";
  if (normalized.includes("case")) return "case-study";
  if (normalized.includes("about")) return "about";
  if (normalized.includes("resume")) return "resume";
  return "page";
}

function documentTitleFallback(): string {
  const title = cleanText(document.title);
  return title.split(/[|–—]/)[0]?.trim() ?? title;
}

function visiblePageHeading(): string {
  const heading = document.querySelector("h1");
  return cleanText(heading?.textContent);
}

export function collectPageContext(): PageContext {
  const url = new URL(window.location.href);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const pageSlug = pathParts[pathParts.length - 1] ?? "home";
  const pageType = pageTypeFromPath(url.pathname);
  const heading = visiblePageHeading();
  const title = documentTitleFallback();
  const fallbackName = titleFromSlug(pageSlug);
  const projectOrCaseStudyName = pageType === "project" || pageType === "case-study"
    ? heading || title || fallbackName
    : "";

  return {
    currentUrl: url.href,
    pageTitle: title || heading || fallbackName,
    pageType,
    projectOrCaseStudyName,
    pageSlug,
  };
}
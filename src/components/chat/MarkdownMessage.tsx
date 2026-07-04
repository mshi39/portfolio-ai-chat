import type { ReactNode } from "react";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)]+\))/g;
const LINK_PATTERN = /^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)]+)\)$/;

function isPortfolioLink(href: string): boolean {
  if (!href.startsWith("http")) return false;
  try {
    const hostname = new URL(href).hostname.toLowerCase().replace(/^www\./, "");
    return hostname === "melissashi.com";
  } catch {
    return false;
  }
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_PATTERN).filter(Boolean).map((part, index) => {
    const link = part.match(LINK_PATTERN);
    if (link) {
      const opensNewTab = !isPortfolioLink(link[2]);
      return <a key={index} href={link[2]} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noreferrer" : undefined} className="break-words font-semibold text-brand [overflow-wrap:anywhere] underline decoration-brand/30 underline-offset-2 hover:decoration-brand">{link[1]}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index} className="font-bold text-ink">{part.slice(2, -2)}</strong>;
    return part;
  });
}

export function MarkdownMessage({ content }: { content: string }) {
  return <div className="min-w-0 max-w-full space-y-2 break-words [overflow-wrap:anywhere]">{content.split("\n").map((line, index) => {
    if (!line.trim()) return <div key={index} className="h-1" aria-hidden="true" />;
    if (line.startsWith("- ")) return <div key={index} className="flex min-w-0 gap-2"><span aria-hidden="true">•</span><span className="min-w-0">{renderInline(line.slice(2))}</span></div>;
    return <p key={index}>{renderInline(line)}</p>;
  })}</div>;
}

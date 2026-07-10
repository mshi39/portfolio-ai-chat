import type { ApiChatMessage, PageContext } from "../../src/types/chat.js";

export type SubjectSource = "explicit" | "conversation" | "page" | "none";

export interface ContextResolution {
  explicitSubject: string | null;
  conversationSubject: string | null;
  pageSubject: string | null;
  resolvedSubject: string | null;
  subjectSource: SubjectSource;
  isAmbiguousQuestion: boolean;
  shouldAskClarifyingQuestion: boolean;
}

const SUBJECT_PATTERNS: Array<{ subject: string; pattern: RegExp }> = [
  { subject: "AI Powered Feedback Intelligence Platform", pattern: /\b(ai[-\s]?powered feedback|feedback intelligence|customer feedback intelligence|voc intelligence)\b/i },
  { subject: "Voice of the Customer Admin Portal Revamp", pattern: /\b(voc revamp|voice of the customer|admin portal|private program workflow)\b/i },
  { subject: "Sales Assessment Platform AI Integration", pattern: /\b(sales assessment|svp|business value advisor|sales platform)\b/i },
  { subject: "Operations Information Hub at ExxonMobil", pattern: /\b(exxonmobil|operations information hub|operations hub|field operator|oil production)\b/i },
  { subject: "Evaluative Research on Cost Analysis Tool", pattern: /\b(cost analysis|cost analysis tool|evaluative research)\b/i },
  { subject: "Enterprise Search Research in the Age of Generative AI", pattern: /\b(enterprise search|concierge|cisco ai assistant|generative ai search)\b/i },
  { subject: "Nemacolin Woodlands Resort Trip Planner", pattern: /\b(nemacolin|trip planner|resort trip|hospitality)\b/i },
  { subject: "Bold product design work", pattern: /\b(bold|resume builder|resume review|document management)\b/i },
  { subject: "Melissa's resume", pattern: /\b(resume|cv)\b/i },
  { subject: "Melissa's LinkedIn background", pattern: /\b(linkedin)\b/i },
];

const AMBIGUOUS_REFERENCE_PATTERN = /\b(this|that|it|here|current|case study|project|role|experience|work|impact|impacts|challenge|challenges|outcome|outcomes|result|results)\b/i;
const BROAD_PROFILE_PATTERN = /\b(you|your|melissa|background|experience|skills|specialt|resume|portfolio)\b/i;

function cleanText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function subjectFromText(text: string): string | null {
  const clean = cleanText(text);
  if (!clean) return null;
  return SUBJECT_PATTERNS.find(({ pattern }) => pattern.test(clean))?.subject ?? null;
}

function subjectFromHistory(messages: ApiChatMessage[]): string | null {
  const priorMessages = messages.slice(0, -1).reverse();
  for (const message of priorMessages) {
    const subject = subjectFromText(message.content);
    if (subject) return subject;
  }
  return null;
}

function pageSubject(pageContext?: PageContext | null): string | null {
  if (!pageContext) return null;
  const candidate = cleanText(pageContext.projectOrCaseStudyName) || cleanText(pageContext.pageTitle);
  if (!candidate || candidate.toLowerCase() === "home") return null;
  if (!["project", "case-study"].includes(pageContext.pageType) && !pageContext.currentUrl.includes("/work/")) return null;
  return candidate;
}

function isAmbiguousQuestion(latestMessage: string): boolean {
  const clean = cleanText(latestMessage);
  if (!clean) return false;
  if (!AMBIGUOUS_REFERENCE_PATTERN.test(clean)) return false;
  return !BROAD_PROFILE_PATTERN.test(clean) || /\b(this|that|it|here|current|case study|project|role|work you did here)\b/i.test(clean);
}

export function resolveChatContext(messages: ApiChatMessage[], pageContext?: PageContext | null): ContextResolution {
  const latestMessage = messages.at(-1)?.content ?? "";
  const explicitSubject = subjectFromText(latestMessage);
  const conversationSubject = explicitSubject ? null : subjectFromHistory(messages);
  const page = pageSubject(pageContext);
  const ambiguous = isAmbiguousQuestion(latestMessage);

  let resolvedSubject: string | null = null;
  let subjectSource: SubjectSource = "none";

  if (explicitSubject) {
    resolvedSubject = explicitSubject;
    subjectSource = "explicit";
  } else if (conversationSubject) {
    resolvedSubject = conversationSubject;
    subjectSource = "conversation";
  } else if (ambiguous && page) {
    resolvedSubject = page;
    subjectSource = "page";
  }

  const shouldAskClarifyingQuestion = ambiguous && !resolvedSubject;
  const resolution = { explicitSubject, conversationSubject, pageSubject: page, resolvedSubject, subjectSource, isAmbiguousQuestion: ambiguous, shouldAskClarifyingQuestion };

  if (process.env.NODE_ENV !== "production") {
    console.debug("[chat-context] Subject resolution", resolution);
  }

  return resolution;
}

export function contextResolutionInstructions(resolution: ContextResolution, pageContext?: PageContext | null): string {
  const lines = [
    "Context resolution:",
    "- Final resolved subject: " + (resolution.resolvedSubject ?? "none"),
    "- Subject source: " + resolution.subjectSource,
    "- Current page URL: " + (pageContext?.currentUrl ?? "unknown"),
    "- Current page title: " + (pageContext?.pageTitle ?? "unknown"),
    "- Current page type: " + (pageContext?.pageType ?? "unknown"),
    "- Current page project/case study name: " + (pageContext?.projectOrCaseStudyName || "unknown"),
    "- Current page slug: " + (pageContext?.pageSlug ?? "unknown"),
  ];

  if (resolution.shouldAskClarifyingQuestion) {
    lines.push("- The user's question is ambiguous and no explicit, conversation, or page subject is available. Ask one concise clarifying question instead of answering from unrelated context.");
  } else if (resolution.resolvedSubject) {
    lines.push("- Answer about the final resolved subject unless the latest user message explicitly asks for something else.");
    lines.push("- Begin by clearly naming or identifying that subject. Do not start with vague phrasing like 'I improved...' or 'It was...'.");
    if (resolution.subjectSource === "page") lines.push("- You may say this is the project the visitor is viewing now.");
  } else {
    lines.push("- No specific subject was resolved. Answer only if the retrieved context directly supports a general response; otherwise ask a concise clarifying question.");
  }

  return lines.join("\n");
}

export function retrievalSubjectQuery(resolution: ContextResolution): string | undefined {
  if (!resolution.resolvedSubject) return undefined;
  return "Resolved subject: " + resolution.resolvedSubject + "\nSubject source: " + resolution.subjectSource;
}
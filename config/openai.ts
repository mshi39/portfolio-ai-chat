function optionalNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const model = process.env.OPENAI_MODEL ?? "gpt-5.4-mini";

function defaultReasoningEffort(modelName: string): string | undefined {
  if (modelName === "gpt-5") return "minimal";
  if (modelName.startsWith("gpt-5.")) return "none";
  return undefined;
}

export const openAIConfig = {
  model,
  temperature: optionalNumber(process.env.OPENAI_TEMPERATURE),
  reasoningEffort: process.env.OPENAI_REASONING_EFFORT ?? defaultReasoningEffort(model),
  maxOutputTokens: optionalNumber(process.env.OPENAI_MAX_OUTPUT_TOKENS) ?? 1_600,
  streaming: true,
  timeoutMs: 60_000,
} as const;

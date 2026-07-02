import type { Plugin } from "vite";

interface LocalApiResponse {
  status(code: number): LocalApiResponse;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  write(chunk: string): void;
  end(): void;
}

interface LocalRequest extends AsyncIterable<{ toString(): string }> { method?: string; }

type ChatHandler = (
  request: { method?: string; body?: unknown },
  response: LocalApiResponse,
) => Promise<void>;

export function localChatApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: "local-chat-api",
    apply: "serve",
    configureServer(server) {
      if (env.OPENAI_API_KEY) process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
      if (env.OPENAI_MODEL) process.env.OPENAI_MODEL = env.OPENAI_MODEL;

      server.middlewares.use("/api/chat", async (request, response) => {
        const localRequest = request as unknown as LocalRequest;
        let rawBody = "";
        for await (const chunk of localRequest) rawBody += chunk.toString();

        const localResponse: LocalApiResponse = {
          status(code) { response.statusCode = code; return localResponse; },
          json(body) {
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify(body));
          },
          setHeader(name, value) { response.setHeader(name, value); },
          write(chunk) { response.write(chunk); },
          end() { response.end(); },
        };

        try {
          const module = await server.ssrLoadModule("/api/chat.ts");
          const handler = module.default as ChatHandler;
          await handler({ method: localRequest.method, body: rawBody }, localResponse);
        } catch (error) {
          console.error("[chat-api:local] Route execution failed", error);
          if (!response.headersSent) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "application/json; charset=utf-8");
            response.end(JSON.stringify({ error: { code: "upstream_error", message: "I'm having trouble connecting right now. Please try again in a moment." } }));
          } else if (!response.writableEnded) {
            response.end();
          }
        }
      });
    },
  };
}

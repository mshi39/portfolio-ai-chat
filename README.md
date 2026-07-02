# Melissa Portfolio AI Chat Widget

Milestone 3 adds a local JSON Retrieval-Augmented Generation (RAG) knowledge base to the existing streamed chat. Answers are grounded in approved portfolio, resume, LinkedIn, and Medium content. Page awareness and deeper voice refinement remain out of scope.

## Runtime architecture

```text
React chat → /api/chat → embed question → cosine retrieval
                                      ↓
                         data/knowledge/chunks.json
                                      ↓
                  grounded Responses API stream
                                      ↓
                  verified Learn more links
```

The browser never receives an API key, embeddings, or the full knowledge base. If no chunk meets the configured relevance threshold, the API streams a deterministic no-guess response without calling the chat model.

## Environment setup

Copy `.env.example` to `.env.local` and add a server-side OpenAI API key. Never use a `VITE_` prefix.

```dotenv
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-5.4-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
RAG_TOP_K=5
RAG_MIN_SIMILARITY=0.35
RAG_KNOWLEDGE_BASE_PATH=data/knowledge/chunks.json
```

The key needs Responses API and Embeddings API access plus available API quota.

## Build or rebuild the knowledge base

```bash
npm run ingest
```

The command:

1. Recursively loads every Markdown file under `data/knowledge/manual/`, excluding `README.md`.
2. Reads project metadata and source URLs from each file.
3. Removes credential fields defensively before chunking.
4. Cleans and chunks the canonical Markdown while preserving source metadata.
5. Creates OpenAI embeddings in batches.
6. Atomically replaces `data/knowledge/chunks.json` only after every step succeeds.

External websites, the Google Doc resume, LinkedIn, and Medium are reference materials only. The ingestion command never downloads or scrapes them. A failed run leaves the previous working knowledge base untouched.

## Canonical Markdown workflow

Knowledge files live in `data/knowledge/manual/`. Edit or add Markdown there, preserve meaningful headings and source metadata, then run `npm run ingest`. One file per case study is recommended.

Do not add private, unapproved, or credential information. Password fields are excluded defensively, but credentials should never be stored in source knowledge.

## Test retrieval without the UI

```bash
npm run rag:test -- "Tell me about Melissa's enterprise UX experience"
```

The command prints the query, top chunk titles, cosine similarity scores, and source URLs. Tune `RAG_MIN_SIMILARITY` after testing representative supported and unsupported questions, then rerun ingestion only if the embedding model changes.

## Run locally

```bash
npm install
npm run dev
```

Vite registers a development-only adapter for the production `api/chat.ts` handler, so `POST /api/chat` works at `http://localhost:5173`.

## Deploy to Vercel

1. Run `npm run ingest` and commit the generated `data/knowledge/chunks.json`.
2. Import the repository into Vercel.
3. Configure `OPENAI_API_KEY` and any optional model/RAG overrides.
4. Deploy. The statically imported JSON knowledge base is bundled with the API function.

## Main modules

- `scripts/ingest.mjs`: safe ingestion orchestrator.
- `scripts/rag-test.mjs`: standalone retrieval debugger.
- `scripts/lib/`: source loading, cleaning, chunking, and embedding utilities.
- `config/rag.ts`: embedding model, top-K, threshold, and knowledge path.
- `api/rag/`: runtime embeddings, cosine retrieval, attribution, and fallback.
- `api/lib/buildModelInput.ts`: bounded context construction.
- `prompts/systemPrompt.ts`: grounding rules.
- `src/components/chat/MarkdownMessage.tsx`: safe source-link rendering.

## Updating knowledge later

Edit or add a canonical Markdown file under `data/knowledge/manual/`, run `npm run ingest`, inspect representative queries with `npm run rag:test`, then commit the regenerated chunks file. Never edit embedding arrays by hand.

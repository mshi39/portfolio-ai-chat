# Canonical Markdown knowledge base

Every Markdown file in this directory and its subdirectories—except `README.md`—is a primary source of truth for the assistant.

- Keep one file per case study under `Projects/`.
- Include `Project Name`, `Source URL`, `Source Type`, tags, and last-updated metadata.
- Run `npm run ingest` after any content change.
- External websites, the Google Doc resume, LinkedIn, and Medium are reference materials only; ingestion never downloads them.
- Never include passwords, passcodes, API keys, or other credentials. The loader also removes password fields defensively before embedding.

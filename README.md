<p align="center">
  <h1 align="center">ClearDesk</h1>
  <p align="center"><strong>AI-powered accounts receivable processing for multilingual operations teams.</strong></p>
  <p align="center">
    <a href="https://clear-desk-ten.vercel.app">Live Demo</a> · <a href="#features">Features</a> · <a href="#setup">Setup</a> · <a href="#architecture">Architecture</a>
  </p>
</p>

---

ClearDesk sits between your raw documents and your team — processing invoices, collections notices, and AR paperwork through Claude AI, extracting structured data, scoring priority, and generating summaries in English and Spanish that your entire team can act on immediately.

Upload a document. Get a prioritized, structured, multilingual summary in seconds. Ask the AI assistant to draft a follow-up email. Hand it to your team. That's the workflow.

---

## The Problem

RPA bots execute defined workflows flawlessly and fail silently on anything unexpected — a misformatted invoice, a missing field, an ambiguous collections dispute. The result is a human bottleneck at exactly the point where speed matters most.

ClearDesk handles the messy middle. It processes the documents your bots would choke on, structures the output your bots can consume cleanly, and surfaces the judgment calls your team actually needs to make.

---

## Features

### 📄 Document Processing
Upload any AR document — PDF, image, Word, Excel, CSV, email, or plain text. Claude AI analyzes each one and returns:

- **Document classification** — invoice, statement, payment confirmation, dispute, credit note
- **Entity extraction** — customer name, invoice number, amounts, dates, payment terms, account numbers
- **Priority scoring** — Critical / High / Medium / Low based on configurable dollar thresholds
- **Action deadline** — the single most important date from the document
- **Confidence score** — how certain the AI is about its extraction
- **Escalation flags** — specific reasons with severity levels (blocking, warning, informational)

### 🌐 Multilingual Summaries
Every document generates a 3-sentence summary in both **English and Spanish** simultaneously. No extra steps, no separate translation feature — it's automatic.

Open any document and toggle between **EN / ES** to see the summary in either language. Names, amounts, and dates are preserved exactly. Only the language changes.

Built for teams operating across the US, Mexico, Colombia, and Latin America.

### 💬 AI Chat Assistant
A conversational AI assistant (Claude Haiku) that knows your entire document queue. Click the green chat button to:

- Ask what needs attention today
- Get a summary of all escalated items
- Find out who's most overdue
- Draft collections follow-up emails ready to send
- Get operational recommendations

**Smart context injection** — the assistant only receives documents relevant to your question, not your entire queue. Ask about escalated items and it only sees escalated documents. Mention a customer name and it only sees that customer's files. Fast, focused, cheap.

### 📊 Team Dashboard
Every processed document surfaces as a card with priority, status, and key data visible at a glance. Filter by:

- Status (Pending → Processing → In Review → Completed → Escalated)
- Priority (Critical / High / Medium / Low)
- Document type
- Assignee
- Free-text search across all fields

### ⚡ Configurable Escalation Logic
Set your own rules for what gets flagged:

- All disputes automatically escalated
- AI confidence below 80% triggers review
- Amounts exceeding your critical threshold
- Due dates within 7 days

Each escalation includes the specific reason, the field that triggered it, and a severity level — not a generic alert.

### 📤 Export
Generate summary reports of your current filtered view for standups, manager reviews, or downstream systems.

### 🔄 Cross-Device Sync
Share a sync code to access your documents on any device — no account required. Powered by Cloudflare KV. Falls back gracefully to local storage if not configured.

### 🎨 Theming
Dark, Light, and System theme modes. The dark theme uses a premium aesthetic: `#0A0A0F` background, `#00FF94` accent, Syne headings, DM Sans body, JetBrains Mono for numbers.

---

## Supported File Formats

| Format | Engine |
|---|---|
| PDF | pdfjs-dist |
| PNG, JPG, WEBP | tesseract.js (OCR) |
| DOCX | mammoth |
| XLSX, CSV | xlsx |
| EML | Native parser |
| TXT, JSON, MD | Direct read |

---

## Setup

```bash
git clone https://github.com/Senpai-Sama7/ClearDesk.git
cd ClearDesk
npm install
```

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key — server-side only, never exposed to client | Yes |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Optional — enables cross-device sync |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV namespace ID | Optional — enables cross-device sync |
| `CLOUDFLARE_API_TOKEN` | API token with Workers KV Storage: Edit permission | Optional — enables cross-device sync |

If the Cloudflare variables are not set, the app works normally with localStorage only — no errors, no broken features.

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Browser    │────▶│ Vercel Edge  │────▶│  Claude Sonnet   │
│  React SPA   │◀────│  Functions   │◀────│  (analysis)      │
│              │     │              │     │  Claude Haiku    │
│              │     │  /api/analyze│     │  (chat)          │
│              │     │  /api/chat   │     └─────────────────┘
│              │     │  /api/docs   │────▶┌─────────────────┐
│              │     │              │◀────│  Cloudflare KV   │
└─────────────┘     └──────────────┘     │  (sync)          │
                                          └─────────────────┘
```

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Document Analysis:** Claude claude-sonnet-4-20250514 with structured JSON schema, prompt caching, 50k char guard
- **Chat Assistant:** Claude Haiku with smart context injection — only relevant documents per query
- **Sync:** Cloudflare KV via REST API, UUID-based, no auth required
- **Deployment:** Vercel with serverless functions — API keys never leave the server

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/analyze` | POST | Document analysis via Claude Sonnet — returns structured JSON with dual-language summaries |
| `/api/chat` | POST | Conversational AI via Claude Haiku — receives chat history + smart context |
| `/api/documents` | GET/PUT | Cross-device sync via Cloudflare KV |

### Security

- API keys are server-side only via Vercel environment variables
- UUID v4 validation on all sync endpoints
- Content length guards (50k char max) prevent abuse
- No user data stored server-side except optional KV sync
- Prompt caching reduces API costs up to 90% on repeated system prompts

---

## What's Next

- **RPA Integration Endpoint** — `/api/process` for UiPath or any automation platform to call directly
- **Webhook support** — push escalation flags to Slack, Teams, or email in real time
- **Batch processing** — queue and process high document volumes asynchronously
- **Portuguese summaries** — third language for Brazilian AR operations
- **Role-based views** — different dashboard layouts for managers vs. processors

---

## Why This Exists

Built to demonstrate a specific architecture: Claude as the judgment layer inside an accounting automation stack. Not a mockup, not a concept — a working tool you can test against a real collections document on day one.

If something breaks, that's useful information. File an issue or reach out directly.

---

## Contact

Douglas Mitchell
[DouglasMitchell.info](https://douglasmitchell.info) · [GitHub](https://github.com/Senpai-Sama7) · DouglasMitchell@ReliantAI.org

---

## License

Proprietary. See [LICENSE.txt](LICENSE.txt).

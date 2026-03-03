# ClearDesk

**AI-powered document processing and team visibility layer for accounting automation workflows.**

ClearDesk sits between your raw documents and your team — processing invoices, collections notices, and AR paperwork through Claude AI, extracting structured data, scoring priority, and generating plain-English summaries your entire team can act on immediately.

---

## The Problem It Solves

RPA bots are powerful but brittle. They execute defined workflows flawlessly and fail silently on anything unexpected — a misformatted invoice, a missing field, an ambiguous collections dispute. The result is a human bottleneck at exactly the point where speed matters most.

ClearDesk handles the messy middle. It processes the documents your bots would choke on, structures the output your bots can consume cleanly, and surfaces the judgment calls your team actually needs to make.

---

## What It Does

**Document Intake**
Upload any invoice, AR document, collections notice, or email thread — PDF, image, or plain text. Claude analyzes each document and returns:

- Document type classification
- Key entity extraction (amounts, dates, account names, deadlines)
- Priority score from 1–5 based on urgency signals in the document
- Recommended next action
- Plain English summary written for immediate clarity across language backgrounds

**Escalation Logic**
ClearDesk distinguishes between documents that are routine and documents that require human judgment. Each escalation flag includes the specific reason and the field that triggered it — not a generic alert, a precise one.

**Team Dashboard**
Every processed document surfaces as a card in a live pipeline dashboard: Incoming → In Review → Action Taken → Resolved. Filter by priority, document type, status, or assignee. One view, full visibility.

**Daily Export**
Export a clean summary report formatted for a team standup or manager review.

---

## Stack

- **Frontend:** React + Tailwind CSS
- **AI Layer:** Anthropic Claude API (`claude-sonnet-4-20250514`)
- **Document Processing:** Structured JSON extraction via Claude with typed response schema
- **Deployment:** Vercel (API key server-side via environment variables — never exposed to client)

---

## Setup

```bash
git clone https://github.com/yourusername/cleardesk
cd cleardesk
npm install
```

Create a `.env.local` file:

```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Environment Variables

| Variable | Description | Required? |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key. Never exposed client-side. | Yes |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID (Dashboard → Overview) | Optional — enables cross-device sync |
| `CLOUDFLARE_KV_NAMESPACE_ID` | KV namespace ID (Workers & Pages → KV) | Optional — enables cross-device sync |
| `CLOUDFLARE_API_TOKEN` | API token with Workers KV Storage: Edit permission | Optional — enables cross-device sync |

If the Cloudflare variables are not set, the app works normally with localStorage only — no errors, no broken features.

---

## How The AI Layer Works

Every uploaded document is sent to Claude with a structured system prompt that enforces a typed JSON response schema. The response schema includes:

```json
{
  "documentType": "string",
  "priority": 1-5,
  "entities": {
    "amount": "string",
    "dueDate": "string",
    "accountName": "string",
    "actionRequired": "string"
  },
  "summary": "string",
  "recommendedAction": "string",
  "requiresHumanReview": true/false,
  "escalationReasons": [
    {
      "type": "string",
      "description": "string",
      "triggeringField": "string"
    }
  ]
}
```

The summary field is generated with explicit plain-English instructions — no jargon, no assumed context, immediately actionable for any team member regardless of native language.

---

## What's Next

- **RPA Integration Endpoint** — expose a `/api/process` endpoint that UiPath or any RPA platform can call directly to receive structured document data
- **Locale-aware summaries** — multilingual output based on assignee settings
- **Webhook support** — push escalation flags to Slack, Teams, or email in real time
- **Batch processing** — queue and process high document volumes asynchronously

---

## Why This Exists

Built to demonstrate a specific architecture: Claude as the judgment layer inside an accounting automation stack. The goal was a working proof, not a concept — something you could actually test against a real collections document on day one.

If something breaks, that's useful information. File an issue or reach out directly.

---

## Contact

Douglas Mitchell
[DouglasMitchell.info](https://douglasmitchell.info)  
[GitHub](https://github.com/Senpai-Sama7)  
DouglasMitchell@ReliantAI.org

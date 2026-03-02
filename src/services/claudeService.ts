import type { DocumentType, DocumentPriority, ClaudeAnalysisResponse, EscalationReason } from '../types/document';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeRequest {
  model: string;
  max_tokens: number;
  messages: ClaudeMessage[];
  system?: string;
}

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
  id: string;
  model: string;
  role: string;
}

const SYSTEM_PROMPT = `You are an expert AI assistant for accounts receivable and collections document processing. 
Your task is to analyze financial documents and extract key information.

Analyze the provided document content and return a JSON response with the following structure:
{
  "documentType": "invoice" | "statement" | "payment_confirmation" | "dispute" | "credit_note" | "other",
  "priority": "critical" | "high" | "medium" | "low",
  "extractedData": {
    "customerName": string or null,
    "customerId": string or null,
    "invoiceNumber": string or null,
    "invoiceDate": string (YYYY-MM-DD) or null,
    "dueDate": string (YYYY-MM-DD) or null,
    "amount": number or null,
    "currency": string (default "USD") or null,
    "accountNumber": string or null,
    "paymentTerms": string or null,
    "notes": string or null,
    "confidence": number (0-1)
  },
  "escalationReasons": [
    {
      "type": "low_confidence" | "missing_data" | "ambiguous" | "high_value" | "manual_review",
      "description": string,
      "field": string (optional)
    }
  ],
  "requiresHumanReview": boolean,
  "confidence": number (0-1),
  "summary": string (brief description of the document)
}

PRIORITY RULES:
- Critical: Disputes, amounts > $50,000, overdue > 90 days, legal notices
- High: Amounts > $10,000, overdue > 30 days, payment confirmations
- Medium: Regular invoices, statements, amounts $1,000-$10,000
- Low: Credit notes, small amounts < $1,000, informational documents

ESCALATION RULES (add escalation reasons when):
- Low confidence in extracted data (< 0.8)
- Missing critical fields (customer name, amount, invoice number)
- Ambiguous document type or content
- High value transactions (>$40,000)
- Payment disputes or credit notes
- Handwritten or unclear content

Return ONLY the JSON response, no additional text.`;

export class ClaudeService {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey || import.meta.env.VITE_CLAUDE_API_KEY || '';
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeDocument(documentContent: string, filename: string): Promise<ClaudeAnalysisResponse> {
    if (!this.apiKey) {
      console.warn('Claude API key not set, using mock analysis');
      return this.mockAnalyze(documentContent, filename);
    }

    try {
      const request: ClaudeRequest = {
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `Analyze the following document:\n\nFilename: ${filename}\n\nContent:\n${documentContent}\n\nPlease extract all relevant information and return the analysis as JSON.`,
          },
        ],
        system: SYSTEM_PROMPT,
      };

      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${errorText}`);
      }

      const data: ClaudeResponse = await response.json();
      const content = data.content[0]?.text;

      if (!content) {
        throw new Error('Empty response from Claude API');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not parse JSON from Claude response');
      }

      const analysis: ClaudeAnalysisResponse = JSON.parse(jsonMatch[0]);
      return analysis;
    } catch (error) {
      console.error('Claude analysis error:', error);
      // Fallback to mock analysis on error
      return this.mockAnalyze(documentContent, filename);
    }
  }

  private mockAnalyze(content: string, filename: string): ClaudeAnalysisResponse {
    const lowerContent = content.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    // Simple keyword-based classification for demo
    let documentType: DocumentType = 'other';
    let priority: DocumentPriority = 'medium';
    let amount: number | null = null;
    let customerName: string | null = null;
    let invoiceNumber: string | null = null;
    const escalationReasons: EscalationReason[] = [];

    // Determine document type
    if (lowerFilename.includes('invoice') || lowerContent.includes('invoice')) {
      documentType = 'invoice';
    } else if (lowerFilename.includes('payment') || lowerContent.includes('payment confirmation')) {
      documentType = 'payment_confirmation';
    } else if (lowerFilename.includes('dispute') || lowerContent.includes('dispute')) {
      documentType = 'dispute';
      priority = 'critical';
      escalationReasons.push({
        type: 'manual_review',
        description: 'Dispute requires manual review',
      });
    } else if (lowerFilename.includes('statement') || lowerContent.includes('statement')) {
      documentType = 'statement';
    } else if (lowerFilename.includes('credit') || lowerContent.includes('credit note')) {
      documentType = 'credit_note';
    }

    // Extract amount
    const amountMatch = content.match(/\$[\d,]+\.?\d*|\b\d+\.\d{2}\b/g);
    if (amountMatch) {
      amount = parseFloat(amountMatch[0].replace(/[$,]/g, ''));
    }

    // Determine priority based on amount
    if (amount) {
      if (amount > 50000) {
        priority = 'critical';
        escalationReasons.push({
          type: 'high_value',
          description: `High value transaction: $${amount.toLocaleString()}`,
        });
      } else if (amount > 10000) {
        priority = 'high';
      } else if (amount < 1000) {
        priority = 'low';
      }
    }

    // Extract customer name (simple heuristic)
    const customerMatch = content.match(/(?:customer|client|bill to|sold to)[:\s]+([A-Z][A-Za-z\s&]+)/i);
    if (customerMatch) {
      customerName = customerMatch[1].trim();
    }

    // Extract invoice number
    const invoiceMatch = content.match(/(?:invoice\s*(?:#|no|number)?[:\s]+)([A-Z0-9-]+)/i);
    if (invoiceMatch) {
      invoiceNumber = invoiceMatch[1];
    }

    const confidence = amount && customerName ? 0.85 : 0.65;

    if (confidence < 0.8) {
      escalationReasons.push({
        type: 'low_confidence',
        description: `Low confidence in extracted data (${Math.round(confidence * 100)}%)`,
      });
    }

    return {
      documentType,
      priority,
      extractedData: {
        customerName,
        customerId: null,
        invoiceNumber,
        invoiceDate: null,
        dueDate: null,
        amount,
        currency: 'USD',
        accountNumber: null,
        paymentTerms: null,
        notes: `Auto-analyzed from ${filename}`,
        confidence,
      },
      escalationReasons,
      requiresHumanReview: escalationReasons.length > 0,
      confidence,
      summary: `${documentType.charAt(0).toUpperCase() + documentType.slice(1)}${customerName ? ` for ${customerName}` : ''}${amount ? ` - $${amount.toLocaleString()}` : ''}`,
    };
  }
}

export const claudeService = new ClaudeService();

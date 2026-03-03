import { useState, useRef } from 'react';
import { Layout } from './Layout';
import { StatsOverview } from './StatsOverview';

import { FilterPanel } from './FilterPanel';
import { DocumentCard } from './DocumentCard';
import { DocumentDetail } from './DocumentDetail';
import { ExportPanel } from './ExportPanel';
import { FileUpload } from '../upload/FileUpload';
import { SampleDocuments } from './SampleDocuments';
import { SettingsPanel } from './SettingsPanel';
import { HelpPanel } from './HelpPanel';
import { AboutPanel } from './AboutPanel';
import { ChatPanel } from './ChatPanel';
import { useDocuments } from '../../contexts/DocumentContext';
import { Button } from '../ui/Button';
import { Plus, Upload } from 'lucide-react';

export function Dashboard() {
  const { filteredDocuments, selectDocument } = useDocuments();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [showUpload, setShowUpload] = useState(false);
  const handleFilesRef = useRef<((files: File[]) => void) | null>(null);

  const handleCardClick = (id: string) => {
    selectDocument(id);
    setIsDetailOpen(true);
  };

  const handleNavigate = (view: string) => {
    if (view === 'upload') {
      setActiveView('documents');
      setShowUpload(true);
    } else {
      setActiveView(view);
      setShowUpload(false);
    }
  };

  return (
    <Layout onNavigate={handleNavigate} activeView={activeView}>
      {activeView === 'settings' ? (
        <SettingsPanel />
      ) : activeView === 'help' ? (
        <HelpPanel />
      ) : activeView === 'about' ? (
        <AboutPanel />
      ) : activeView === 'documents' ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary">Documents</h1>
              <p className="text-sm text-text-secondary mt-1">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button variant="primary" size="md" onClick={() => setShowUpload(!showUpload)} leftIcon={<Plus className="w-4 h-4" />}>
              Upload
            </Button>
          </div>

          <div className="mb-8 bg-surface border border-border rounded-lg p-6">
            {showUpload && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-text-primary">Upload Documents</h2>
                  <button onClick={() => setShowUpload(false)} className="text-text-secondary hover:text-text-primary text-sm">Close</button>
                </div>
                <FileUpload onHandleFiles={(h) => { handleFilesRef.current = h; }} />
              </>
            )}
            <SampleDocuments onProcessFile={(file) => handleFilesRef.current?.([file])} />
          </div>

          <FilterPanel onExport={() => setIsExportOpen(true)} />

          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((doc, i) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onClick={() => handleCardClick(doc.id)}
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <Upload className="w-8 h-8 text-text-secondary mb-4" />
              <p className="text-text-secondary text-sm">No documents yet</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowUpload(true)}>
                Upload your first document
              </Button>
            </div>
          )}
        </div>
      ) : (
        <DashboardHome onNavigate={handleNavigate} />
      )}

      <DocumentDetail isOpen={isDetailOpen} onClose={() => { setIsDetailOpen(false); selectDocument(null); }} />
      <ExportPanel isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <ChatPanel />
    </Layout>
  );
}

const faqs = [
  { q: 'What file formats are supported?', a: 'PDF, PNG, JPG, WEBP, DOCX, XLSX, CSV, EML, TXT, JSON, and Markdown.' },
  { q: 'How does priority scoring work?', a: 'Claude AI scores each document as Critical, High, Medium, or Low based on dollar thresholds, due dates, and escalation triggers you configure in Settings.' },
  { q: 'What languages are summaries generated in?', a: 'Every document gets a 3-sentence summary in both English and Spanish automatically.' },
  { q: 'Is my data stored on a server?', a: 'Documents live in your browser\'s localStorage by default. Cross-device sync via Cloudflare KV is optional and UUID-based — no account required.' },
  { q: 'What AI models are used?', a: 'Claude Sonnet 4 for document analysis and Claude Haiku 4.5 for the chat assistant. API keys stay server-side.' },
];

const capabilities: { icon: string; title: string; desc: string; nav?: string }[] = [
  { icon: '🔍', title: 'Insights', desc: 'Entity extraction, priority scoring, and confidence analysis on every document.', nav: 'documents' },
  { icon: '📝', title: 'Summaries', desc: 'Dual-language EN/ES summaries generated automatically — no extra steps.', nav: 'documents' },
  { icon: '🚨', title: 'Escalations', desc: 'Configurable rules flag disputes, low-confidence extractions, and overdue amounts.', nav: 'documents' },
  { icon: '💬', title: 'AI Chat', desc: 'Ask questions about your AR queue — get answers, draft emails, surface what needs attention.' },
  { icon: '📊', title: 'Classification', desc: 'Invoices, statements, payment confirmations, disputes, and credit notes — sorted automatically.' },
  { icon: '📤', title: 'Export', desc: 'Generate filtered summary reports for standups, reviews, or downstream systems.' },
];

function DashboardHome({ onNavigate }: { onNavigate: (v: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useState(() => { requestAnimationFrame(() => setVisible(true)); });

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Animated header */}
      <div className="text-center mb-12">
        <h1
          className="font-heading text-5xl md:text-6xl font-bold text-text-primary transition-all duration-700"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          Clear<span className="text-accent">Desk</span>
        </h1>
        <p
          className="mt-4 text-lg text-text-secondary max-w-xl mx-auto transition-all duration-700 delay-200"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
        >
          AI-powered accounts receivable processing — upload any document, get structured intelligence in seconds.
        </p>
        <div
          className="mt-6 flex items-center justify-center gap-2 transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[11px] text-accent tracking-widest uppercase">Powered by Claude</span>
        </div>
      </div>

      {/* Stats dashboard */}
      <div
        className="mb-12 transition-all duration-700 delay-300"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
      >
        <StatsOverview />
      </div>

      {/* Capability cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
        {capabilities.map((c, i) => {
          const Tag = c.nav ? 'button' as const : 'div' as const;
          return (
            <Tag
              key={c.title}
              {...(c.nav ? { onClick: () => onNavigate(c.nav!) } : {})}
              className={`bg-surface border border-border rounded-lg p-5 text-left transition-all duration-300 ${
                c.nav ? 'hover:border-accent/40 hover:bg-accent/5 cursor-pointer group' : 'hover:border-accent/30'
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: `${400 + i * 80}ms`,
                transitionDuration: '600ms',
              }}
            >
              <span className="text-2xl">{c.icon}</span>
              <h3 className="mt-3 text-sm font-medium text-text-primary flex items-center gap-2">
                {c.title}
                {c.nav && <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity text-xs">→</span>}
              </h3>
              <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">{c.desc}</p>
            </Tag>
          );
        })}
      </div>

      {/* FAQ */}
      <div
        className="transition-all duration-700"
        style={{ opacity: visible ? 1 : 0, transitionDelay: '900ms' }}
      >
        <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">FAQ</h2>
        <div className="space-y-1">
          {faqs.map((f, i) => (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-surface/50 transition-colors"
              >
                <span className="text-sm text-text-primary">{f.q}</span>
                <span className="text-text-secondary text-xs ml-4 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-3">
                  <p className="text-[13px] text-text-secondary leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
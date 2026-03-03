import { useState } from 'react';
import { FileText, Play, Eye, X } from 'lucide-react';
import { Button } from '../ui/Button';

const formats = ['All', 'PDF', 'DOCX', 'CSV', 'JSON', 'TXT'] as const;

const samples = [
  { name: 'Swift Haul Invoice', file: 'Swift Haul Invoice.pdf', fmt: 'PDF', mime: 'application/pdf', desc: 'Freight invoice — $12,450 net-30' },
  { name: 'Swift Haul Invoice', file: 'Swift Haul Invoice.docx', fmt: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', desc: 'Freight invoice — Word' },
  { name: 'Invoice (Swift Haul → Lone Star)', file: 'Invoice_SwiftHaul_LoneStarDist.csv', fmt: 'CSV', mime: 'text/csv', desc: 'Freight invoice — CSV' },
  { name: 'Invoice (Swift Haul → Lone Star)', file: 'Invoice_SwiftHaul_LoneStarDist.json', fmt: 'JSON', mime: 'application/json', desc: 'Freight invoice — JSON' },
  { name: 'Invoice (Swift Haul → Lone Star)', file: 'Invoice_SwiftHaul_LoneStarDist.txt', fmt: 'TXT', mime: 'text/plain', desc: 'Freight invoice — TXT' },
  { name: 'AR Statement Swift Haul', file: 'AR Statement Swift Haul.pdf', fmt: 'PDF', mime: 'application/pdf', desc: 'Receivable statement with aging buckets' },
  { name: 'AR Statement Swift Haul', file: 'AR Statement Swift Haul.docx', fmt: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', desc: 'AR statement — Word' },
  { name: 'AR Statement (Swift Haul / Lone Star)', file: 'AR_SwiftHaul_LoneStarDist.csv', fmt: 'CSV', mime: 'text/csv', desc: 'AR statement — CSV' },
  { name: 'AR Statement (Swift Haul / Lone Star)', file: 'AR_SwiftHaul_LoneStarDist.json', fmt: 'JSON', mime: 'application/json', desc: 'AR statement — JSON' },
  { name: 'AR Statement (Swift Haul / Lone Star)', file: 'AR_SwiftHaul_LoneStarDist.txt', fmt: 'TXT', mime: 'text/plain', desc: 'AR statement — TXT' },
  { name: 'Collections Notice', file: 'Collections Notice.pdf', fmt: 'PDF', mime: 'application/pdf', desc: 'Final notice — triggers escalation' },
  { name: 'Collections Notice', file: 'Collections Notice.docx', fmt: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', desc: 'Collections notice — Word' },
  { name: 'Collections (Ironclads → Panhandle)', file: 'Collections_IroncladsRG_PanhandleFreight.csv', fmt: 'CSV', mime: 'text/csv', desc: 'Collections notice — CSV' },
  { name: 'Collections (Ironclads → Panhandle)', file: 'Collections_IroncladsRG_PanhandleFreight.json', fmt: 'JSON', mime: 'application/json', desc: 'Collections notice — JSON' },
  { name: 'Collections (Ironclads → Panhandle)', file: 'Collections_IroncladsRG_PanhandleFreight.txt', fmt: 'TXT', mime: 'text/plain', desc: 'Collections notice — TXT' },
];

interface Props { onProcessFile: (file: File) => void; }

export function SampleDocuments({ onProcessFile }: Props) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [fmt, setFmt] = useState<string>('All');

  const filtered = fmt === 'All' ? samples : samples.filter(s => s.fmt === fmt);

  const processNow = async (s: typeof samples[0]) => {
    setLoading(s.file);
    try {
      const r = await fetch(`/samples/${s.file}`);
      const blob = await r.blob();
      onProcessFile(new File([blob], s.file, { type: s.mime }));
      setOpen(false);
      setPreview(null);
    } finally { setLoading(null); }
  };

  const canPreview = (f: string) => f.endsWith('.pdf') || f.endsWith('.txt') || f.endsWith('.json') || f.endsWith('.csv');

  if (!open) {
    return (
      <div className="mt-4 pt-4 border-t border-border">
        <button onClick={() => setOpen(true)}
          className="text-xs text-accent hover:text-accent/80 transition-colors cursor-pointer">
          No documents handy? Try one of 15 sample documents →
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-border space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-secondary">15 samples across 5 formats — click Process to analyze directly.</p>
        <button onClick={() => { setOpen(false); setPreview(null); }} className="text-text-secondary hover:text-text-primary">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {formats.map(f => (
          <button key={f} onClick={() => setFmt(f)}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${fmt === f ? 'bg-accent/15 text-accent-text' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-1.5 max-h-72 overflow-y-auto">
        {filtered.map(s => (
          <div key={s.file} className={`flex items-center gap-3 bg-bg border rounded-lg px-3 py-2 transition-colors ${preview === s.file ? 'border-accent' : 'border-border hover:border-border-hover'}`}>
            <FileText className="w-3.5 h-3.5 text-text-secondary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{s.name}</p>
              <p className="text-[11px] text-text-secondary">{s.desc} · <span className="font-mono">{s.fmt}</span></p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              {canPreview(s.file) && (
                <button onClick={() => setPreview(preview === s.file ? null : s.file)}
                  className="p-1.5 rounded text-text-secondary hover:text-text-primary hover:bg-surface transition-colors" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              <Button variant="primary" size="sm" onClick={() => processNow(s)} disabled={loading === s.file}
                leftIcon={<Play className="w-3 h-3" />}>
                {loading === s.file ? 'Loading…' : 'Process'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <div className="border border-border rounded-lg overflow-hidden bg-bg">
          <iframe src={`/samples/${preview}`} className="w-full h-96" title="Sample preview" />
        </div>
      )}
    </div>
  );
}

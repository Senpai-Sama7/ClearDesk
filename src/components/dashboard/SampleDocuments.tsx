import { FileDown } from 'lucide-react';

const samples = [
  { name: 'Swift Haul Invoice', file: 'Swift Haul Invoice.pdf', desc: 'Freight invoice — $12k range' },
  { name: 'AR Statement', file: 'AR Statement Swift Haul.pdf', desc: 'Multi-line receivable statement' },
  { name: 'Collections Notice', file: 'Collections Notice.pdf', desc: 'Final notice — should trigger escalation' },
];

export function SampleDocuments() {
  return (
    <div className="mt-6 pt-6 border-t border-border">
      <p className="text-xs text-text-secondary mb-3">No documents handy? Try these samples — download, then upload to see AI analysis:</p>
      <div className="grid gap-2">
        {samples.map(s => (
          <a key={s.file} href={`/samples/${s.file}`} download
            className="flex items-center gap-3 bg-bg border border-border rounded-lg px-4 py-2.5 hover:border-border-hover transition-colors">
            <FileDown className="w-4 h-4 text-text-secondary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm text-text-primary">{s.name}</p>
              <p className="text-[11px] text-text-secondary">{s.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

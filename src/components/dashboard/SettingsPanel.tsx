import { useState } from 'react';
import { useDocuments } from '../../contexts/DocumentContext';
import { Button } from '../ui/Button';
import { Trash2, RotateCcw, X } from 'lucide-react';
import { classNames } from '../../utils/formatters';
import { getThresholds, getEscalationRules, getTeamMembers, saveThresholds, saveEscalationRules, saveTeamMembers } from '../../utils/settings';
import type { Thresholds, EscalationRules } from '../../utils/settings';

interface SettingsPanelProps { onStartTour: () => void; }

export function SettingsPanel({ onStartTour }: SettingsPanelProps) {
  const { state, dispatch } = useDocuments();
  const [thresholds, setThresholds] = useState(getThresholds);
  const [rules, setRules] = useState(getEscalationRules);
  const [team, setTeam] = useState(getTeamMembers);
  const [newMember, setNewMember] = useState('');

  const saveT = (t: Thresholds) => { setThresholds(t); saveThresholds(t); };
  const saveR = (r: EscalationRules) => { setRules(r); saveEscalationRules(r); };

  const addMember = () => {
    const name = newMember.trim();
    if (!name || team.includes(name)) return;
    const next = [...team, name];
    setTeam(next); saveTeamMembers(next); setNewMember('');
  };
  const removeMember = (i: number) => {
    const next = team.filter((_, idx) => idx !== i);
    setTeam(next); saveTeamMembers(next);
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-sm font-medium text-text-primary">{title}</h2>
      {children}
    </div>
  );

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-xs text-text-secondary">{label}</span>
      <button type="button" onClick={() => onChange(!checked)}
        className={classNames('relative w-9 h-5 rounded-full transition-colors', checked ? 'bg-accent' : 'bg-border')}>
        <span className={classNames('absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform', checked ? 'left-[18px]' : 'left-0.5')} />
      </button>
    </label>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage data, preferences, and processing rules</p>
      </div>

      <Section title="Priority Thresholds">
        {(['critical', 'high', 'medium'] as const).map(k => (
          <div key={k} className="flex items-center justify-between gap-4">
            <label className="text-xs text-text-secondary capitalize w-20">{k}</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-text-secondary">$</span>
              <input type="number" value={thresholds[k]}
                onChange={e => saveT({ ...thresholds, [k]: Math.max(0, Number(e.target.value)) })}
                className="w-28 bg-bg border border-border rounded px-2 py-1 text-sm font-mono text-text-primary focus:border-border-hover focus:outline-none" />
            </div>
          </div>
        ))}
        <p className="text-[11px] text-text-secondary">Documents below ${thresholds.medium.toLocaleString()} are classified as Low priority</p>
      </Section>

      <Section title="Escalation Rules">
        <Toggle label="Escalate all dispute documents" checked={rules.disputes} onChange={v => saveR({ ...rules, disputes: v })} />
        <Toggle label="Escalate if AI confidence below 80%" checked={rules.lowConfidence} onChange={v => saveR({ ...rules, lowConfidence: v })} />
        <Toggle label="Escalate if amount exceeds critical threshold" checked={rules.exceedsCritical} onChange={v => saveR({ ...rules, exceedsCritical: v })} />
        <Toggle label="Escalate if due date within 7 days" checked={rules.dueSoon} onChange={v => saveR({ ...rules, dueSoon: v })} />
      </Section>

      <Section title="Team Members">
        <div className="flex gap-2">
          <input value={newMember} onChange={e => setNewMember(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMember()}
            placeholder="Add team member..."
            className="flex-1 bg-bg border border-border rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-border-hover focus:outline-none" />
          <Button variant="secondary" size="sm" onClick={addMember} disabled={!newMember.trim()}>Add</Button>
        </div>
        {team.length > 0 && (
          <div className="space-y-1">
            {team.map((name, i) => (
              <div key={i} className="flex items-center justify-between bg-bg border border-border rounded px-3 py-1.5">
                <span className="text-xs text-text-primary">{name}</span>
                <button onClick={() => removeMember(i)} className="text-text-secondary hover:text-danger"><X className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-text-secondary">Team members populate the assignee dropdown on document cards</p>
      </Section>

      <Section title="Help">
        <p className="text-xs text-text-secondary">Take a guided tour of ClearDesk to learn how everything works.</p>
        <Button variant="secondary" size="sm" onClick={() => { localStorage.removeItem('cleardesk_tour_completed'); onStartTour(); }}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Replay Tour</Button>
      </Section>

      <Section title="Data Management">
        <p className="text-xs text-text-secondary">{state.documents.length} document{state.documents.length !== 1 ? 's' : ''} stored in this browser</p>
        <Button variant="danger" size="sm" onClick={() => { if (confirm('Delete all documents? This cannot be undone.')) dispatch({ type: 'SET_DOCUMENTS', payload: [] }); }}
          leftIcon={<Trash2 className="w-3.5 h-3.5" />} disabled={state.documents.length === 0}>Clear All Documents</Button>
      </Section>
    </div>
  );
}

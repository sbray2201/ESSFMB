export type Session = { status: 'completed' | 'skipped'; seconds: number; activities: number[]; confidence: number };
export type Word = { id: string; word: string; meaning: string; example: string; status: 'new' | 'learning' | 'known'; favourite: boolean; due: string };
export type Data = { version: 1; sessions: Record<string, Session>; journals: Record<string, string>; words: Word[] };
export const storageKey = 'essfmb-learning-v1';
export function validData(value: unknown): value is Data {
  if (!value || typeof value !== 'object') return false;
  const d = value as Data;
  const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  const date = (v: string) => /^2026-(10|11|12)-\d{2}$/.test(v) && v >= '2026-10-25' && v <= '2026-12-31' && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
  return d.version === 1 && record(d.sessions) && Object.entries(d.sessions).every(([k, s]) => date(k) && record(s) && ['completed','skipped'].includes(String(s.status)) && typeof s.seconds === 'number' && Number.isFinite(s.seconds) && s.seconds >= 0 && Array.isArray(s.activities) && s.activities.every(a => Number.isInteger(a) && a >= 0 && a < 4) && Number.isInteger(s.confidence) && s.confidence >= 1 && s.confidence <= 5)
    && record(d.journals) && Object.entries(d.journals).every(([k,v]) => date(k) && typeof v === 'string')
    && Array.isArray(d.words) && d.words.every(w => record(w) && (['id','word','meaning','example','due'] as const).every(k => typeof w[k] === 'string') && ['new','learning','known'].includes(String(w.status)) && typeof w.favourite === 'boolean' && /^\d{4}-\d{2}-\d{2}$/.test(String(w.due)));
}
export function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

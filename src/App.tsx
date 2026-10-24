import { useEffect, useRef, useState } from 'react';
import { BookOpen, CalendarDays, Check, ChevronLeft, ChevronRight, Download, Heart, Headphones, Mic, Pause, Play, Settings, Sparkles, Star, Volume2 } from 'lucide-react';
import { emptyProgress, isProgress, lessons, todayRiga, vocabulary } from './data';
import type { Progress, Session, Word } from './data';

type Recognition = { lang: string; interimResults: boolean; start(): void; stop(): void; onresult: ((event: { results: { transcript: string }[][] }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };
const tabs = ['Daily practice', 'My journey', 'Word notebook', 'Settings & backup'];
const activities = ['Warm up · introduce the topic', 'Listen · notice the rhythm', 'Speak · tell your own story', 'Reflect · write a little'];
const dateLabel = (date: string) => new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function App() {
  const [tab, setTab] = useState(tabs[0]);
  const [index, setIndex] = useState(() => Math.max(0, Math.min(67, lessons.findIndex(l => l.date >= todayRiga()) < 0 ? 67 : lessons.findIndex(l => l.date >= todayRiga()))));
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [checks, setChecks] = useState<number[]>([]);
  const [journal, setJournal] = useState('');
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(3);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState('');
  const recognition = useRef<Recognition | null>(null);
  const lesson = lessons[index];
  const completed = Object.values(progress.sessions).filter(s => s.status === 'completed').length;
  const minutes = Math.floor(Object.values(progress.sessions).reduce((sum, s) => sum + s.seconds, 0) / 60);
  const known = Object.values(progress.words).filter(w => w.status === 'known').length;
  const load = async () => {
    setLoading(true); setError('');
    try { const res = await fetch('/api/progress'); if (!res.ok) throw Error(); const data: unknown = await res.json(); if (!isProgress(data)) throw Error(); setProgress(data); setHasLoaded(true); }
    catch { setError('Your saved progress is unavailable. Retry before making changes.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); return () => { recognition.current?.stop(); window.speechSynthesis?.cancel(); }; }, []);
  useEffect(() => {
    const session = progress.sessions[lesson.date];
    setSeconds(session?.seconds || 0); setChecks(session?.activities || []); setJournal(session?.journal || ''); setTranscript(session?.transcript || ''); setConfidence(session?.confidence || 3); setRunning(false); setDirty(false);
  }, [lesson.date, loading]);
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => { setSeconds(s => s + 1); setDirty(true); }, 1000); return () => clearInterval(timer); }, [running]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty || saving) event.preventDefault(); };
    window.addEventListener('beforeunload', beforeUnload); return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty, saving]);
  const save = async (next: Progress, clearDraft = false) => {
    setSaving(true); setError('');
    try {
      const res = await fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(next) });
      if (!res.ok) throw Error(); setProgress(next); if (clearDraft) setDirty(false); setNotice('Your progress is saved.'); return true;
    } catch { setError('Could not save. Your current practice is still here; please try saving again.'); return false; }
    finally { setSaving(false); }
  };
  const saveSession = async (status: Session['status']) => {
    setRunning(false);
    await save({ ...progress, sessions: { ...progress.sessions, [lesson.date]: { status, seconds, activities: checks, journal, confidence, transcript } } }, true);
  };
  const changeLesson = (next: number) => {
    if (dirty && !window.confirm('Leave this lesson without saving your current changes?')) return;
    recognition.current?.stop(); setIndex(next); setNotice(''); setTab(tabs[0]);
  };
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) { setNotice('Audio is unavailable in this browser. Read the example aloud instead.'); return; }
    speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(text); speech.lang = 'en-GB'; speech.rate = 0.85; speechSynthesis.speak(speech);
  };
  const record = () => {
    if (listening) { recognition.current?.stop(); return; }
    const ctor = (window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition });
    const SpeechRecognition = ctor.SpeechRecognition || ctor.webkitSpeechRecognition;
    if (!SpeechRecognition) { setNotice('Speech recognition is unavailable here. You can type your response below.'); return; }
    const rec = new SpeechRecognition(); recognition.current = rec; rec.lang = 'en-GB'; rec.interimResults = false;
    rec.onresult = event => { setTranscript(t => (t + ' ' + event.results[0][0].transcript).trim()); setDirty(true); };
    rec.onerror = () => { setListening(false); setNotice('Microphone access failed. Check permission or type your response.'); };
    rec.onend = () => setListening(false);
    try { rec.start(); setListening(true); } catch { setNotice('Could not start the microphone. Please type your response.'); }
  };
  const updateWord = (word: string, change: Partial<Word>) => {
    const old = progress.words[word] || { status: 'new', favourite: false, due: todayRiga() };
    void save({ ...progress, words: { ...progress.words, [word]: { ...old, ...change } } });
  };
  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      if (file.size > 500000) throw Error(); const data: unknown = JSON.parse(await file.text());
      if (!isProgress(data)) throw Error();
      if (window.confirm('Replace all current saved records with this backup?')) { if (await save(data, true)) { setLoading(true); setTimeout(() => setLoading(false), 0); } }
    } catch { setError('That file is not a valid ESSFMB backup (maximum 500 KB).'); }
  };
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); setTab(tabs[0]); }}><span className="brand-mark"><BookOpen size={24}/></span><span>ESSFMB<small>A little practice. A little braver.</small></span></a>
      <div className="sidebar-caption">YOUR ENGLISH CORNER</div>
      <nav aria-label="Main navigation">{tabs.map((name, i) => { const Icon = [Sparkles, CalendarDays, BookOpen, Settings][i]; return <button key={name} className={tab === name ? 'nav active' : 'nav'} onClick={() => setTab(name)}><Icon size={19}/>{name}{i === 0 && <span className="nav-dot"/>}</button>; })}</nav>
      <div className="sidebar-note"><Heart size={22}/><p>For my BuBu,</p><strong>Your voice deserves<br/>to be heard.</strong><p>One day, one conversation,<br/>one small step at a time.</p><span>Made with love.</span></div>
      <div className="program-label">25 OCT — 31 DEC 2026<br/><span>68 days of showing up for yourself</span></div>
    </aside>
    <main>
      <header className="topbar"><span>YOUR SMALL DAILY RITUAL</span><span className="date-pill"><CalendarDays size={15}/> {dateLabel(todayRiga())}, {todayRiga().slice(0, 4)}</span></header>
      {loading ? <div className="loading" role="status"><div className="skeleton"/><h2>Opening your English corner…</h2></div> : !hasLoaded ? <div className="alert" role="alert">{error}<button onClick={() => void load()}>Retry loading</button></div> : <>
      {error && <div className="alert" role="alert">{error} {!Object.keys(progress.sessions).length && !dirty && <button onClick={() => void load()}>Retry loading</button>}</div>}
      {notice && <div className="notice" role="status">{notice}<button aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}
      <div className="page-heading"><div><p className="eyebrow">{tab === tabs[0] ? 'HELLO, BUBU' : 'MAKE ROOM FOR YOUR VOICE'}</p><h1>{tab === tabs[0] ? <>A little braver,<br/><em>every day.</em></> : tab === tabs[1] ? <>Look how far <em>you’ve come.</em></> : tab === tabs[2] ? <>Words to <em>make your own.</em></> : <>Keep your journey <em>safe.</em></>}</h1><p className="subtitle">{tab === tabs[0] ? 'You don’t have to speak perfectly. You just have to begin.' : tab === tabs[1] ? 'Every small effort is part of your story.' : tab === tabs[2] ? 'Collect, practise, and revisit the words that open conversations.' : 'Your practice, your pace. Take a copy of your progress with you.'}</p></div><div className="flower" aria-hidden="true"><span>✳</span><small>GROW AT<br/>YOUR OWN PACE</small></div></div>
      <section className="stats" aria-label="Your progress"><div><span className="stat-icon"><Check size={18}/></span><strong>{completed}<small> / 68</small></strong><span>days completed</span></div><div><span className="stat-icon"><Headphones size={18}/></span><strong>{minutes}<small> min</small></strong><span>time for yourself</span></div><div><span className="stat-icon"><BookOpen size={18}/></span><strong>{known}</strong><span>words made your own</span></div></section>
      {tab === tabs[0] && <div className="practice-grid"><div>
        <section className="lesson-card"><div className="lesson-top"><span className="eyebrow">DAY {String(lesson.number).padStart(2, '0')} <span className="separator">/</span> {dateLabel(lesson.date).toUpperCase()}</span><div className="arrows"><button aria-label="Previous lesson" disabled={index === 0} onClick={() => changeLesson(index - 1)}><ChevronLeft size={18}/></button><button aria-label="Next lesson" disabled={index === 67} onClick={() => changeLesson(index + 1)}><ChevronRight size={18}/></button></div></div><span className="tag">{lesson.checkpoint ? 'Weekly checkpoint' : lesson.theme}</span><h2>{lesson.topic}</h2><p>Find a quiet moment. Take a breath.<br/>Today’s topic: {lesson.topic.toLowerCase()}.</p><div className="prompt"><span>YOUR CONVERSATION STARTER</span><p>{lesson.prompt}</p></div><div className="timer-row"><button className="primary" onClick={() => { setRunning(!running); setDirty(true); }} disabled={saving}><span>{running ? <Pause size={17}/> : <Play size={17}/>}</span>{running ? 'Pause practice' : seconds ? 'Resume practice' : 'Begin today’s practice'}</button><span className="timer" aria-label="Practice time">{Math.floor(seconds / 60).toString().padStart(2, '0')}:{(seconds % 60).toString().padStart(2, '0')}<small> / 20 MIN</small></span></div></section>
        <section className="paper"><div className="section-title"><h3>Your practice, step by step</h3><span>20 MIN, JUST FOR YOU</span></div>{activities.map((activity, i) => <label className="check-row" key={activity}><input type="checkbox" checked={checks.includes(i)} onChange={() => { setChecks(c => c.includes(i) ? c.filter(n => n !== i) : [...c, i]); setDirty(true); }}/><span>{activity}</span><small>{[3, 5, 8, 4][i]} min</small></label>)}</section>
        <section className="paper"><div className="section-title"><h3>Listen, then make it yours</h3><button className="text-button" onClick={() => speak(lesson.example)}><Volume2 size={17}/> Listen</button></div><p className="example">“{lesson.example}”</p><p className="muted">Try your own version. Add a detail, a feeling, and a question.</p><button className="secondary" onClick={record}><Mic size={16}/>{listening ? 'Stop listening' : 'Speak your response'}</button><label className="field-label" htmlFor="transcript">Your words (you can type here, too)</label><textarea id="transcript" maxLength={20000} value={transcript} onChange={e => { setTranscript(e.target.value); setDirty(true); }} placeholder="I’d like to tell you about…"/><p className="fine-print">Speech recognition depends on browser support and microphone permission. A transcript is not a pronunciation score.</p></section>
        <section className="paper"><h3>{lesson.checkpoint ? 'Your checkpoint reflection' : 'A small reflection'}</h3><p className="muted">{lesson.checkpoint ? 'Speak for two minutes without notes. What feels easier than last week? What would you like to practise next?' : 'What came easily today? Which words would you like to use again?'}</p><label className="field-label" htmlFor="journal">Your journal</label><textarea id="journal" maxLength={20000} value={journal} onChange={e => { setJournal(e.target.value); setDirty(true); }} placeholder="Today, I noticed…"/><label className="field-label" htmlFor="confidence">How confident do you feel? {confidence} / 5</label><input id="confidence" type="range" min="1" max="5" value={confidence} onChange={e => { setConfidence(Number(e.target.value)); setDirty(true); }}/><div className="range-labels"><span>Finding my feet</span><span>Ready to talk</span></div><div className="save-row"><button className="primary" disabled={saving} onClick={() => void saveSession('completed')}><Check size={17}/>{saving ? 'Saving…' : 'Complete & save practice'}</button><button className="text-button" disabled={saving} onClick={() => { if (window.confirm('Mark this day as skipped and save your notes?')) void saveSession('skipped'); }}>Skip this day</button></div>{progress.sessions[lesson.date] && <p className="fine-print">Saved as {progress.sessions[lesson.date].status}. You can revisit and update this lesson anytime.</p>}</section>
      </div><aside className="practice-aside"><section className="encouragement"><span className="eyebrow">A GENTLE REMINDER</span><span className="quote-mark">“</span><blockquote>Progress sounds<br/>like trying<br/><em>one more time.</em></blockquote><div className="tiny-line"/><p>Your accent tells a story.<br/>Your mistakes mean you’re learning.<br/>Keep going, BuBu.</p></section><section className="word-day"><span className="eyebrow">A WORD TO TAKE WITH YOU</span><h3>{vocabulary[index % vocabulary.length][0]}</h3><p>{vocabulary[index % vocabulary.length][1]}</p><button className="text-button" onClick={() => speak(vocabulary[index % vocabulary.length][2])}><Volume2 size={16}/> Hear it in a sentence</button><hr/><p className="example">“{vocabulary[index % vocabulary.length][2]}”</p><button className="text-button" onClick={() => setTab(tabs[2])}>Open your notebook <ChevronRight size={15}/></button></section><section className="journey-mini"><div className="section-title"><h3>Your little journey</h3><span>{Math.round(completed / 68 * 100)}%</span></div><progress value={completed} max={68}/><p>{68 - completed} more opportunities to grow.</p><button className="text-button" onClick={() => setTab(tabs[1])}>See all 68 days <ChevronRight size={15}/></button></section></aside></div>}
      {tab === tabs[1] && <section className="paper"><div className="section-title"><h3>October — December 2026</h3><span>SELECT ANY DAY TO REVISIT</span></div><p className="muted">Filled days are completed. Outlined days are waiting for your voice. Stars mark assessment days.</p><div className="calendar-grid">{lessons.map((l, i) => <button key={l.date} className={`calendar-day ${progress.sessions[l.date]?.status || ''} ${l.date === todayRiga() ? 'today' : ''}`} onClick={() => changeLesson(i)} title={l.topic}><small>{dateLabel(l.date)}</small><strong>{String(l.number).padStart(2, '0')}</strong><span>{l.checkpoint ? <Star size={13}/> : null}{progress.sessions[l.date]?.status || 'Practice'}</span></button>)}</div><h3 className="journal-heading">Your saved reflections</h3>{Object.entries(progress.sessions).filter(([, s]) => s.journal).length === 0 ? <p className="muted">Your reflections appear here after you save a practice session.</p> : Object.entries(progress.sessions).filter(([, s]) => s.journal).sort(([a], [b]) => b.localeCompare(a)).map(([date, s]) => <article className="journal-entry" key={date}><span className="eyebrow">{dateLabel(date)} · CONFIDENCE {s.confidence}/5</span><p>{s.journal}</p></article>)}</section>}
      {tab === tabs[2] && <section className="paper"><div className="notebook-tools"><input aria-label="Search vocabulary" placeholder="Find a word…" value={search} onChange={e => setSearch(e.target.value)}/><select aria-label="Filter vocabulary" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All words</option><option value="favourite">Favourites</option><option value="due">Due for review</option><option value="new">New</option><option value="learning">Learning</option><option value="known">Known</option></select></div><div className="word-grid">{vocabulary.filter(([word, meaning]) => (word + meaning).toLowerCase().includes(search.toLowerCase()) && (filter === 'all' || filter === 'favourite' && progress.words[word]?.favourite || filter === 'due' && (!progress.words[word]?.due || progress.words[word].due <= todayRiga()) || (progress.words[word]?.status || 'new') === filter)).map(([word, meaning, example]) => <article className="vocab-card" key={word}><div className="section-title"><h3>{word}</h3><button aria-label={`Favourite ${word}`} aria-pressed={progress.words[word]?.favourite || false} disabled={saving} onClick={() => updateWord(word, { favourite: !progress.words[word]?.favourite })}><Heart size={18} fill={progress.words[word]?.favourite ? 'currentColor' : 'none'}/></button></div><p>{meaning}</p><p className="example">“{example}”</p><button className="text-button" onClick={() => speak(example)}><Volume2 size={16}/> Listen</button><label className="field-label">My familiarity<select disabled={saving} value={progress.words[word]?.status || 'new'} onChange={e => { const due = new Date(); due.setDate(due.getDate() + (e.target.value === 'known' ? 7 : 1)); updateWord(word, { status: e.target.value as Word['status'], due: due.toISOString().slice(0, 10) }); }}><option value="new">New to me</option><option value="learning">Still learning</option><option value="known">Made it my own</option></select></label><small className="muted">Review: {progress.words[word]?.due || 'today'}</small></article>)}</div><p className="fine-print">Change a word’s familiarity to schedule its next review. No matches? Try another search or filter.</p></section>}
      {tab === tabs[3] && <section className="paper settings"><h3>Your progress belongs to you</h3><p>Progress is saved in Netlify Database and linked to this browser using a private cookie. Keep a backup to transfer it to another device or recover it after clearing cookies.</p><h3>Download a backup</h3><p className="muted">Includes your saved sessions, reflections, vocabulary and confidence ratings. Save current practice before exporting.</p><div className="save-row"><button className="primary" onClick={() => download('essfmb-backup.json', JSON.stringify(progress, null, 2), 'application/json')}><Download size={17}/> Full JSON backup</button><button className="secondary" onClick={() => { const quote = (s: unknown) => `"${String(s).replace(/^[=+@\-\t\r]/, "'$&").replaceAll('"', '""')}"`; download('essfmb-sessions.csv', 'date,status,seconds,confidence,journal,transcript\r\n' + Object.entries(progress.sessions).map(([date, s]) => [date, s.status, s.seconds, s.confidence, s.journal, s.transcript].map(quote).join(',')).join('\r\n'), 'text/csv'); }}><Download size={17}/> Session CSV</button></div><h3>Restore a backup</h3><p className="muted">Restoring replaces your current saved progress after confirmation.</p><input type="file" accept="application/json,.json" disabled={saving} aria-label="Import JSON backup" onChange={e => { void importBackup(e.target.files?.[0]); e.target.value = ''; }}/><hr/><h3>On your iPad</h3><p>Open this site in Safari, then use Share → Add to Home Screen. Previously visited app pages can open offline; loading and saving progress require an internet connection.</p><h3>Speaking and privacy</h3><p>Listening uses your browser’s English voice. Speech recognition may use your browser provider’s processing service; it starts only when you tap the microphone. This app saves text transcripts, not audio recordings. You can always type instead.</p><h3>Your programme</h3><p>25 October–31 December 2026. Daily dates follow Europe/Riga time. Every lesson stays available after the programme ends.</p></section>}
      <footer>Made with love, for every version of your voice.<Heart size={13}/></footer>
      </>}
    </main>
  </div>;
}

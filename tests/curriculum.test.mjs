import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons, emptyProgress, isProgress } from '../src/data.ts';

test('curriculum covers every day and all ten assessment dates', () => {
  assert.equal(lessons.length, 68);
  assert.equal(new Set(lessons.map(l => l.date)).size, 68);
  assert.equal(lessons[0].date, '2026-10-25');
  assert.equal(lessons.at(-1).date, '2026-12-31');
  assert.ok(lessons.every(l => l.prompt?.endsWith('?') && l.example?.length > 50));
  lessons.forEach((l, i) => assert.equal(l.date, new Date(Date.UTC(2026, 9, 25 + i)).toISOString().slice(0, 10)));
  assert.deepEqual(lessons.filter(l => l.checkpoint).map(l => l.date), ['2026-10-31','2026-11-07','2026-11-14','2026-11-21','2026-11-28','2026-12-05','2026-12-12','2026-12-19','2026-12-26','2026-12-31']);
});

test('backup validation accepts round trips and rejects malformed imported data', () => {
  assert.ok(isProgress(emptyProgress()));
  const progress = emptyProgress();
  const session = { status:'completed', seconds:125, activities:[0,1], journal:'A good start', confidence:3, transcript:'Hello' };
  progress.sessions['2026-10-25'] = session;
  progress.words.confident = { status:'learning', favourite:true, due:'2026-10-26' };
  assert.ok(isProgress(JSON.parse(JSON.stringify(progress))));
  for (const invalid of [null, {}, {version:2,sessions:{},words:{}}, {version:1,sessions:[],words:{}}, {...progress,sessions:{'2030-01-01':session}}, {...progress,sessions:{'2026-10-25':{...session,seconds:-1}}}, {...progress,sessions:{'2026-10-25':{...session,activities:[9]}}}, {...progress,sessions:{'2026-10-25':{...session,journal:42}}}, {...progress,words:{unknown:{status:'known',favourite:true,due:'2026-10-26'}}}]) assert.equal(isProgress(invalid), false);
});

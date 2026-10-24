import assert from 'node:assert/strict';
import { test } from 'node:test';
import { lessons, todayInRiga } from '../src/curriculum.ts';
import { validData } from '../src/store.ts';

test('curriculum covers each of the 68 consecutive dates with all ten checkpoints', () => {
  assert.equal(lessons.length, 68);
  lessons.forEach((lesson, index) => {
    assert.equal(lesson.day, index + 1);
    assert.equal(lesson.date, new Date(Date.UTC(2026, 9, 25 + index)).toISOString().slice(0, 10));
    assert.ok(lesson.title.trim());
  });
  assert.equal(lessons.at(-1).date, '2026-12-31');
  assert.deepEqual(lessons.filter(l => l.checkpoint).map(l => l.date), ['2026-10-31', '2026-11-07', '2026-11-14', '2026-11-21', '2026-11-28', '2026-12-05', '2026-12-12', '2026-12-19', '2026-12-26', '2026-12-31']);
  assert.match(todayInRiga(), /^\d{4}-\d{2}-\d{2}$/);
});
const backup = {
  version: 1,
  sessions: { '2026-10-25': { status: 'completed', seconds: 180, activities: [0, 1, 2, 3], confidence: 4 } },
  journals: { '2026-10-25': 'A little practice.' },
  words: [{ id: 'one', word: 'hello', meaning: 'greeting', example: 'Hello!', status: 'new', favourite: false, due: '2026-10-25' }],
};
test('a full notebook survives a JSON backup round trip', () => {
  assert.equal(validData(JSON.parse(JSON.stringify(backup))), true);
  assert.equal(validData({ version: 1, sessions: {}, journals: {}, words: [] }), true);
});
test('invalid imports are rejected before replacing a notebook', () => {
  const session = backup.sessions['2026-10-25'];
  for (const invalid of [
    null, [], {}, { ...backup, version: 2 },
    { ...backup, sessions: { '2026-11-31': session } },
    { ...backup, sessions: { '2027-01-01': session } },
    ...[{ seconds: -1 }, { seconds: Infinity }, { confidence: 7 }, { activities: [4] }, { status: 'invalid' }].map(change => ({ ...backup, sessions: { '2026-10-25': { ...session, ...change } } })),
    { ...backup, words: [{ ...backup.words[0], status: 'invalid' }] },
    { ...backup, journals: { '2026-10-25': 42 } },
  ]) assert.equal(validData(invalid), false);
});

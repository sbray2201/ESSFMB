export const topics = [
  'A little introduction', 'My daily routine', 'The people I love', 'A place called home', 'My favourite meal', 'A walk through my neighbourhood', 'My first week in English',
  'Making a new friend', 'At the café', 'Shopping for groceries', 'My favourite season', 'Talking about my work', 'A perfect weekend', 'Week two: a conversation',
  'Asking for directions', 'Taking the bus', 'Planning a trip', 'Checking into a hotel', 'A memorable holiday', 'Packing my suitcase', 'Week three: travel stories',
  'How I feel today', 'At the doctor', 'Healthy little habits', 'Moving my body', 'A recipe I love', 'Making an appointment', 'Week four: everyday confidence',
  'A childhood memory', 'My school days', 'Someone who inspires me', 'A funny thing that happened', 'An important celebration', 'What I learned this month', 'November reflection',
  'My plans for December', 'A skill I want to learn', 'My dream job', 'A place I want to visit', 'Making a polite request', 'Week six: looking ahead',
  'Giving my opinion', 'Agreeing and disagreeing', 'Comparing two places', 'Explaining a problem', 'Offering a solution', 'A book or film I love', 'Week seven: sharing ideas',
  'Telling a story', 'Describing a photograph', 'An unexpected adventure', 'A difficult decision', 'Giving friendly advice', 'A person I admire', 'Week eight: longer conversations',
  'Inviting someone over', 'Planning a celebration', 'Writing a kind message', 'Traditions in my family', 'A meaningful gift', 'A festive conversation', 'Week nine: celebrating progress',
  'What makes me happy', 'How my English has changed', 'My favourite practice moment', 'Goals for the new year', 'A letter to my future self', 'My English story: final reflection'
];
export const lessons = topics.map((title, index) => {
  const date = new Date(Date.UTC(2026, 9, 25 + index)).toISOString().slice(0, 10);
  return { date, title, day: index + 1, checkpoint: ['2026-10-31','2026-11-07','2026-11-14','2026-11-21','2026-11-28','2026-12-05','2026-12-12','2026-12-19','2026-12-26','2026-12-31'].includes(date) };
});
export type Lesson = typeof lessons[number];
export const activities = ['Warm up · introduce today’s topic', 'Listen · hear and repeat the example', 'Speak · talk for two minutes', 'Reflect · write a few lines'];
export const starterWords = [
  { id: 'confident', word: 'confident', meaning: 'Feeling sure about yourself and your abilities.', example: 'I feel more confident when I practise a little every day.' },
  { id: 'usually', word: 'usually', meaning: 'What happens most of the time.', example: 'I usually start my morning with a cup of tea.' },
  { id: 'curious', word: 'curious', meaning: 'Wanting to know or learn something.', example: 'I am curious about life in other countries.' },
  { id: 'memorable', word: 'memorable', meaning: 'Special enough to be remembered.', example: 'Our trip together was a memorable experience.' },
  { id: 'prefer', word: 'prefer', meaning: 'To like one thing more than another.', example: 'I prefer walking to taking the bus.' },
  { id: 'grateful', word: 'grateful', meaning: 'Feeling thankful for something.', example: 'I am grateful for the people who encourage me.' },
  { id: 'although', word: 'although', meaning: 'Used to introduce a contrasting idea.', example: 'Although I make mistakes, I keep speaking.' },
  { id: 'improve', word: 'improve', meaning: 'To become better at something.', example: 'My speaking improves with regular practice.' },
];
export function todayInRiga() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Riga', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return ['year','month','day'].map(type => parts.find(p => p.type === type)?.value).join('-');
}
export function dateLabel(date: string) { return new Date(date + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }); }
export function exampleFor(lesson: Lesson) {
  return `Today I am talking about ${lesson.title.toLowerCase()}. This is meaningful to me because it is part of my life. For example, I enjoy sharing small moments with the people I love. In the future, I would like to try something new. Every time I practise, it becomes a little easier to express myself.`;
}

export const themes = [
  ['Getting comfortable', 'Introduce yourself|Your family|Your home|Your daily routine|Things you enjoy|Your favourite place|Your first story'],
  ['Everyday conversations', 'At the café|Buying groceries|Asking for directions|Making plans|Talking about the weather|A phone conversation|Your week in review'],
  ['Stories from your life', 'A childhood memory|A memorable trip|Someone you admire|Your happiest day|A challenge you overcame|A funny moment|Tell your story'],
  ['Finding your words', 'Describing a person|Comparing two places|Explaining a recipe|Giving advice|Expressing an opinion|Agreeing and disagreeing|Make your case'],
  ['Out in the world', 'At the airport|Checking into a hotel|Ordering a meal|Visiting the doctor|Solving a problem|Meeting someone new|A travel conversation'],
  ['Work and possibilities', 'Your skills|Your ideal job|Introducing a project|Asking for help|Giving feedback|Explaining a process|A practice interview'],
  ['Ideas that matter', 'A book you love|Technology in your life|Healthy habits|Protecting nature|Learning something new|A change you would make|Present an idea'],
  ['Speaking with confidence', 'Starting a conversation|Asking follow-up questions|Sharing good news|Explaining a mistake|Making a suggestion|Telling a longer story|A five-minute conversation'],
  ['Looking ahead', 'Your goals|A place to visit|Something to learn|Your dream day|A letter to your future self|What confidence means|Your progress story'],
  ['Your next chapter', 'Your favourite discovery|A conversation to remember|Advice for a new learner|Your English journey|Celebrate and look ahead'],
];
const questions = [
  'How would you introduce yourself to someone new?', 'Who is in your family, and what do you enjoy doing together?', 'What makes your home feel like your own?', 'What does a typical day look like for you?', 'What do you enjoy doing in your free time?', 'Where do you feel most at peace, and why?', 'What have you learned about yourself this week?',
  'How would you order a drink and ask about the menu?', 'What do you need for your next meal, and where would you find it?', 'How would you ask someone for directions to the station?', 'How would you invite a friend to spend an afternoon together?', 'What is the weather like today, and how does it affect your plans?', 'How would you start and end a friendly phone call?', 'What happened this week that you would like to share?',
  'What childhood memory can you describe in detail?', 'Where did you go on a memorable trip, and what happened?', 'Who do you admire, and what have you learned from them?', 'What made one particular day especially happy?', 'What challenge did you face, and how did you handle it?', 'Can you tell a story about something that made you laugh?', 'Can you tell a story with a beginning, a middle, and an ending?',
  'How would you describe someone without saying their name?', 'How are two places you know similar and different?', 'Can you explain how to make a favourite meal, step by step?', 'What advice would you give to someone learning English?', 'What is your opinion about a topic you care about, and why?', 'How can you disagree with someone politely?', 'Can you support an opinion with two reasons and an example?',
  'What would you say if you needed help finding your flight?', 'How would you check into a hotel and ask about breakfast?', 'How would you order a meal and explain a dietary preference?', 'How would you describe a symptom and ask for advice?', 'How would you explain a problem and suggest a solution?', 'What would you ask someone you have just met?', 'Can you practise an entire conversation from a trip?',
  'What are you good at, and how did you learn it?', 'What would your ideal job involve?', 'How would you introduce a project in three sentences?', 'How would you ask for help with a task you do not understand?', 'How can you offer useful, kind feedback?', 'Can you explain how to do something you know well?', 'How would you answer: tell me about yourself and your strengths?',
  'What book would you recommend, and why?', 'How does technology help you in everyday life?', 'Which healthy habit would you like to build?', 'What is one small way people can protect nature?', 'What would you like to learn, and how would you begin?', 'What change would make your community better?', 'Can you explain an idea and answer a possible question about it?',
  'How would you start a friendly conversation with a neighbour?', 'What follow-up questions could help you learn more about someone?', 'What good news would you like to share?', 'How would you explain a mistake and what you learned?', 'How would you suggest a different way to do something?', 'Can you tell a story with details about people, places, and feelings?', 'Can you keep a conversation going for five minutes?',
  'What is a goal you would like to work toward?', 'Where would you like to travel, and what would you do there?', 'What new skill would you enjoy learning?', 'What would your dream day look like from morning to evening?', 'What would you tell your future self?', 'What does feeling confident mean to you?', 'What can you say now that felt difficult when you started?',
  'What is your favourite thing you discovered during this programme?', 'Which conversation would you like to remember?', 'What advice would you give to someone on their first day?', 'How has your relationship with speaking English changed?', 'What are you proud of, and how will you keep practising?',
];
const examples = [
  'Hello! I am learning English because I want to feel more comfortable in conversations. I enjoy quiet walks and spending time with people I love. What do you like doing in your free time?',
  'Excuse me, could you help me, please? I am looking for a quiet café near here. I would like to sit down and have a cup of tea. Is there one you would recommend?',
  'I remember a trip I took with someone close to me. At first, we were unsure where to go. Then we found a lovely little place by the water. I still remember how peaceful it felt.',
  'In my opinion, small habits can make a big difference. For example, practising a little every day helps me remember more. Although it takes time, I can see myself improving.',
  'Hello, I have a reservation for two nights. Could you tell me what time breakfast starts? Also, is there a good place to eat nearby? Thank you for your help.',
  'I enjoy learning new skills and working with other people. Recently, I solved a problem by breaking it into smaller steps. I would like an opportunity to keep learning and contribute to a team.',
  'One idea I would like to share is making more time for reading. It helps me discover different perspectives. Perhaps we could start with a short book and discuss it together.',
  'That sounds interesting. How did you first get involved? I had a similar experience last year, although mine was a little different. What would you like to try next?',
  'One of my goals is to feel comfortable speaking with new people. I plan to practise a little each day. I know I will make mistakes, but I am curious to see how much I can improve.',
  'When I started, I often worried about finding the perfect words. Now I know that sharing an idea matters more than getting every sentence right. I am proud that I kept trying.',
];
export const lessons = themes.flatMap(([theme, topics]) => topics.split('|').map(topic => ({ theme, topic }))).map((lesson, index) => {
  const date = new Date(Date.UTC(2026, 9, 25 + index)).toISOString().slice(0, 10);
  return { ...lesson, date, prompt: questions[index], example: examples[Math.floor(index / 7)], number: index + 1, checkpoint: (index + 1) % 7 === 0 || index === 67 };
});
export const vocabulary = [
  ['confident', 'Feeling sure of yourself.', 'I feel more confident when I practise.'],
  ['curious', 'Interested in learning more.', 'I am curious about your hometown.'],
  ['usually', 'On most occasions.', 'I usually take a walk after lunch.'],
  ['although', 'Used to connect contrasting ideas.', 'Although it was raining, we went outside.'],
  ['eventually', 'After some time.', 'Eventually, I found the right words.'],
  ['experience', 'Something you have lived through.', 'Travelling alone was a wonderful experience.'],
  ['recommend', 'To suggest something worth trying.', 'Can you recommend a good book?'],
  ['instead', 'In place of something else.', 'Let’s have tea instead.'],
  ['opportunity', 'A chance to do something.', 'This is an opportunity to learn.'],
  ['grateful', 'Feeling thankful.', 'I am grateful for your help.'],
  ['improve', 'To become better.', 'My speaking improves with practice.'],
  ['perhaps', 'Used to express a possibility.', 'Perhaps we could meet tomorrow.'],
];
export type Session = { status: 'completed' | 'skipped'; seconds: number; activities: number[]; journal: string; confidence: number; transcript: string };
export type Word = { status: 'new' | 'learning' | 'known'; favourite: boolean; due: string };
export type Progress = { version: 1; sessions: Record<string, Session>; words: Record<string, Word> };
export const emptyProgress = (): Progress => ({ version: 1, sessions: {}, words: {} });
export function isProgress(value: unknown): value is Progress {
  if (!value || typeof value !== 'object') return false;
  const p = value as Progress;
  return p.version === 1 && !!p.sessions && typeof p.sessions === 'object' && !Array.isArray(p.sessions) && !!p.words && typeof p.words === 'object' && !Array.isArray(p.words)
    && Object.entries(p.sessions).every(([date, s]) => lessons.some(l => l.date === date) && s && ['completed', 'skipped'].includes(s.status) && Number.isFinite(s.seconds) && s.seconds >= 0 && Array.isArray(s.activities) && s.activities.every(a => Number.isInteger(a) && a >= 0 && a < 4) && typeof s.journal === 'string' && s.journal.length <= 20000 && Number.isFinite(s.confidence) && s.confidence >= 1 && s.confidence <= 5 && typeof s.transcript === 'string' && s.transcript.length <= 20000)
    && Object.entries(p.words).every(([word, w]) => vocabulary.some(v => v[0] === word) && w && ['new', 'learning', 'known'].includes(w.status) && typeof w.favourite === 'boolean' && typeof w.due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(w.due));
}
export const todayRiga = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Riga', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

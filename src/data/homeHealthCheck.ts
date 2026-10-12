// Adapted from the supplied standalone quiz. Corrections are recorded in the Phase 3 report.
export type Tone = 'g' | 'y' | 'r';
export type Choice = { text: string; tone: Tone };
export type Question = {
  id: string; question: string; short: string; choices: Choice[];
  rule: string; why: string; tip: string; guide: string;
  source?: { name: string; url: string };
};
export const tones = {
  g: { label: 'Pro move', points: 2 }, y: { label: 'Getting there', points: 1 }, r: { label: 'Uh oh', points: 0 }
} as const;
export const reactions: Record<Tone, string[]> = {
  g: ['Look at you.', 'Gold star.', 'Your house thanks you.', 'Okay, show-off.'],
  y: ['Not bad. Not great.', 'Close enough... almost.', 'We’ve all been there.'],
  r: ['Oof. You’re not alone.', 'Your house noticed.', 'No judgment. Some judgment.']
};
export const questions: Question[] = [
  {
    id: 'smoke', short: 'Smoke alarm care', question: 'When did you last test your smoke alarms?',
    choices: [
      { text: 'Within the last month, including my sealed-battery alarms', tone: 'g' },
      { text: 'A while ago. They’re due for a test', tone: 'y' },
      { text: 'No idea', tone: 'r' },
      { text: 'I took one down when it chirped', tone: 'r' }
    ],
    rule: 'Test monthly. Follow the alarm’s instructions for battery care and whole-alarm replacement, generally at 10 years.',
    why: 'An alarm needs to work when it counts. Sealed-battery models still need testing, but their batteries aren’t replaceable. Replace the whole unit at the end of its service life.',
    tip: 'Check the date and test each alarm. If one is disconnected or won’t work, restore working protection promptly; ask your local fire department or a qualified installer for help.',
    source: { name: 'U.S. Fire Administration: smoke alarms', url: 'https://www.usfa.fema.gov/prevention/home-fires/prepare-for-fire/smoke-alarms/' },
    guide: '/resources/how-often-to-test-smoke-alarms/'
  },
  {
    id: 'filter', short: 'Furnace filter', question: 'How are you keeping up with your furnace filter?',
    choices: [
      { text: 'I check it and follow my system’s schedule', tone: 'g' },
      { text: 'Sometime this year. I should check the instructions', tone: 'y' },
      { text: 'Can’t remember', tone: 'r' },
      { text: 'Totally forgot I needed to do this', tone: 'r' }
    ],
    rule: 'Check it monthly. Clean or replace it on your filter and system’s schedule, sooner if it is dirty.',
    why: 'A clogged filter restricts airflow and makes the system work harder. Filter type, dust, pets, and use can all change the schedule.',
    tip: 'Save the filter size and your equipment’s instructions so the next store run is easier.',
    source: { name: 'ENERGY STAR: maintenance checklist', url: 'https://www.energystar.gov/saveathome/heating-cooling/maintenance-checklist' },
    guide: '/resources/how-often-to-change-furnace-filter/'
  },
  {
    id: 'dryer', short: 'Dryer vent', question: 'When was your dryer vent last cleaned out?',
    choices: [
      { text: 'This year, and I follow the dryer’s instructions', tone: 'g' },
      { text: 'A while ago', tone: 'y' },
      { text: 'Never', tone: 'r' },
      { text: 'I thought the lint screen was the vent', tone: 'r' }
    ],
    rule: 'Clear the lint screen each load. Plan a yearly vent check and cleaning; follow the manual and act sooner if airflow drops.',
    why: 'Lint buildup matters: failure to clean was the leading ignition factor in reported U.S. home dryer fires in 2018–2020.',
    tip: 'Longer drying can signal restricted airflow, though there are other causes. Check the instructions and arrange qualified cleaning or service when needed.',
    source: { name: 'U.S. Fire Administration: appliance fire safety', url: 'https://www.usfa.fema.gov/prevention/home-fires/prevent-fires/appliance-and-electrical/' },
    guide: '/resources/how-to-clean-dryer-vent/'
  },
  {
    id: 'dishwasher', short: 'Dishwasher filter', question: 'How are you keeping up with your dishwasher filter?',
    choices: [
      { text: 'I follow the manual, including if mine is self-cleaning', tone: 'g' },
      { text: 'Once, maybe. I should check its schedule', tone: 'y' },
      { text: 'Never checked the instructions', tone: 'r' },
      { text: 'Wait, there’s a filter?', tone: 'r' }
    ],
    rule: 'Check your manual. If yours has a removable filter, clean it on its schedule and reinstall it correctly.',
    why: 'Spoiler: a neglected removable filter can get gross. Trapped food can leave dishes gritty or smelly. Some models clean their filters differently.',
    tip: 'Find the model’s cleaning instructions before removing anything. There’s no one-size-fits-all twist-and-rinse routine.',
    source: { name: 'Whirlpool: dishwasher filter care', url: 'https://producthelp.whirlpool.com/Dishwashers/Product_Info/Dishwasher_Cleaning_and_Care/How_to_Clean_the_Dishwasher_Filters' },
    guide: '/resources/'
  },
  {
    id: 'heater', short: 'Water heater age', question: 'How old is your water heater?',
    choices: [ { text: 'I know exactly', tone: 'g' }, { text: 'Roughly', tone: 'y' }, { text: 'No idea', tone: 'r' }, { text: 'It came with the house.', tone: 'r' } ],
    rule: 'Know its age and type. Storage heaters often last 10 to 15 years; tankless can last over 20. Age isn’t a replacement deadline.',
    why: 'Knowing its age helps you plan, without predicting a leak. Service life depends on the model, water conditions, care, and use.',
    tip: 'Save the installation record or verify the manufacture date with the maker using the label and serial number. Those dates may differ.',
    source: { name: 'U.S. Department of Energy: Energy Saver guide, water heating', url: 'https://www.energy.gov/sites/default/files/2022-08/energy-saver-guide-2022.pdf#page=23' },
    guide: '/resources/water-heater-maintenance-checklist/'
  },
  {
    id: 'contractor', short: 'Your last pro', question: 'Could you find the last pro who fixed something in your house?',
    choices: [ { text: 'Yes, in under a minute', tone: 'g' }, { text: 'With some digging', tone: 'y' }, { text: 'No idea', tone: 'r' }, { text: 'I just Google a new one every time', tone: 'r' } ],
    rule: 'Save the invoice, name, and number the day of the job.',
    why: 'A good contractor is worth remembering. The good one is easy to lose when the invoice disappears into a drawer.',
    tip: 'Snap the invoice before it disappears into a drawer.', guide: '/home-contractor-records/'
  }
];
export const bands = [
  { min: 11, name: 'House whisperer', description: 'You’re on top of it. Now make sure someone else in your home could be too.' },
  { min: 6, name: 'Mostly on it', description: 'A few things are slipping. Totally normal, and totally fixable.' },
  { min: 0, name: 'Your house is keeping secrets', description: 'No shame. Start with the reds, top to bottom. The smoke alarms first.' }
] as const;
export const shareUrl = 'https://aroundthehouseapp.com/home-health-check/';
export function reactionFor(question: number, answer: number) {
  const tone = questions[question].choices[answer].tone;
  return reactions[tone][(question + answer) % reactions[tone].length];
}
export function resultsFor(picks: readonly (number | undefined)[]) {
  if (picks.length !== questions.length || picks.some((answer, i) => !Number.isInteger(answer) || !questions[i].choices[answer!])) throw new Error('Six valid answers are required.');
  const entries = questions.map((question, i) => ({ question, index: i, answer: picks[i]!, tone: question.choices[picks[i]!].tone }));
  const score = entries.reduce((total, entry) => total + tones[entry.tone].points, 0);
  const band = bands.find(b => score >= b.min)!;
  const rank = { r: 0, y: 1, g: 2 };
  const recommendations = [...entries].sort((a, b) => rank[a.tone] - rank[b.tone] || a.index - b.index);
  // Safety attention is independent of the severity-sorted recommendation list and total score.
  const safety = entries.filter(entry => ['smoke', 'dryer'].includes(entry.question.id) && entry.tone !== 'g');
  return { score, band, entries, recommendations, safety };
}
export function shareText(score: number, category: string) {
  return `I scored ${score}/12 on the Home Health Check (“${category}”). Bet you can’t beat it: ${shareUrl}`;
}
export type QuizState = { index: number; picks: (number | undefined)[]; phase: 'question' | 'results' };
export function initialState(): QuizState { return { index: 0, picks: Array.from({ length: 6 }, () => undefined), phase: 'question' }; }
export function answerQuestion(state: QuizState, index: number, answer: number): QuizState {
  if (state.phase !== 'question' || state.index !== index || state.picks[index] !== undefined || !Number.isInteger(answer) || !questions[index]?.choices[answer]) return state;
  const picks = [...state.picks]; picks[index] = answer; return { ...state, picks };
}
export function nextQuestion(state: QuizState, index: number): QuizState {
  if (state.phase !== 'question' || state.index !== index || state.picks[index] === undefined) return state;
  return index === 5 ? { ...state, phase: 'results' } : { ...state, index: index + 1 };
}
export function previousQuestion(state: QuizState, index: number): QuizState {
  if (state.index !== index || index <= 0) return state;
  return { ...state, index: state.phase === 'results' ? index : index - 1, phase: 'question' };
}
export function changeAnswer(state: QuizState, index: number): QuizState {
  if (state.phase !== 'question' || state.index !== index) return state;
  const picks = [...state.picks]; picks[index] = undefined; return { ...state, picks };
}

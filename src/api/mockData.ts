import type {
  Announcement,
  CatalogSection,
  Course,
  Deadline,
  Finances,
  Student,
  Term,
} from './types';

// Demo data so the app is fully usable before it is wired up to the real portal.

export const student: Student = {
  id: '40123456',
  firstName: 'Alex',
  lastName: 'Rivera',
  email: 'arivera27@cmc.edu',
  classYear: 2027,
  majors: ['Economics', 'Data Science'],
  minors: [],
  advisor: { name: 'Prof. Dana Whitfield', email: 'dwhitfield@cmc.edu' },
  mailbox: 'Box 1234',
  holds: [
    {
      id: 'h1',
      title: 'Health Insurance Waiver',
      description: 'Submit your insurance waiver or enroll in the student plan before Dec 1.',
      blocksRegistration: false,
    },
  ],
};

const TERM = 'Fall 2026';

export const courses: Course[] = [
  {
    id: 'c1',
    code: 'ECON 101',
    section: '01',
    title: 'Intermediate Microeconomics',
    credits: 1,
    instructor: { name: 'Prof. Marcus Lee', email: 'mlee@cmc.edu' },
    campus: 'CMC',
    term: TERM,
    color: 'rose',
    meetings: [{ days: ['Mon', 'Wed'], start: '09:35', end: '10:50', location: 'Bauer North 21' }],
    description:
      'Consumer and producer theory, general equilibrium, welfare economics, and an introduction to game theory.',
    announcements: [
      { id: 'a1', date: '2026-11-09', title: 'Problem Set 7 posted', body: 'PS7 is due next Monday. Office hours moved to Thursday 2–4pm this week.' },
      { id: 'a2', date: '2026-11-02', title: 'Midterm 2 grades released', body: 'Median was 84. Regrade requests within one week, in writing.' },
    ],
    assignments: [
      { id: 's1', title: 'Problem Set 6', due: '2026-11-03', points: 50, score: 46 },
      { id: 's2', title: 'Midterm 2', due: '2026-10-30', points: 100, score: 88 },
      { id: 's3', title: 'Problem Set 7', due: '2026-11-16', points: 50 },
      { id: 's4', title: 'Final Exam', due: '2026-12-14', points: 200 },
    ],
    handouts: [
      { id: 'f1', name: 'Syllabus.pdf', size: '214 KB' },
      { id: 'f2', name: 'PS7.pdf', size: '98 KB' },
      { id: 'f3', name: 'Lecture 18 – Oligopoly.pdf', size: '1.2 MB' },
    ],
  },
  {
    id: 'c2',
    code: 'CSCI 036',
    section: '02',
    title: 'Computer Science II',
    credits: 1,
    instructor: { name: 'Prof. Priya Natarajan', email: 'pnatarajan@cmc.edu' },
    campus: 'CMC',
    term: TERM,
    color: 'sky',
    meetings: [
      { days: ['Tue', 'Thu'], start: '13:15', end: '14:30', location: 'Roberts North 102' },
      { days: ['Fri'], start: '13:15', end: '14:30', location: 'Kravis LC62 (Lab)' },
    ],
    description: 'Data structures, algorithm analysis, recursion, and object-oriented design in Python and Java.',
    announcements: [
      { id: 'a3', date: '2026-11-10', title: 'Project 3 autograder live', body: 'Submit early and often. Late days apply after Friday 11:59pm.' },
    ],
    assignments: [
      { id: 's5', title: 'Lab 9: Hash Tables', due: '2026-11-07', points: 20, score: 20 },
      { id: 's6', title: 'Project 3: Graph Search', due: '2026-11-14', points: 100 },
      { id: 's7', title: 'Lab 10: Heaps', due: '2026-11-21', points: 20 },
    ],
    handouts: [
      { id: 'f4', name: 'Syllabus.pdf', size: '180 KB' },
      { id: 'f5', name: 'Project3_spec.pdf', size: '340 KB' },
    ],
  },
  {
    id: 'c3',
    code: 'GOVT 020',
    section: '01',
    title: 'Introduction to American Politics',
    credits: 1,
    instructor: { name: 'Prof. Helen Okafor', email: 'hokafor@cmc.edu' },
    campus: 'CMC',
    term: TERM,
    color: 'amber',
    meetings: [{ days: ['Mon', 'Wed'], start: '11:00', end: '12:15', location: 'Kravis 164' }],
    description: 'Institutions, elections, parties, and public opinion in American politics.',
    announcements: [],
    assignments: [
      { id: 's8', title: 'Response Paper 3', due: '2026-11-12', points: 25 },
      { id: 's9', title: 'Research Paper Draft', due: '2026-11-25', points: 75 },
    ],
    handouts: [{ id: 'f6', name: 'Syllabus.pdf', size: '150 KB' }],
  },
  {
    id: 'c4',
    code: 'MATH 060',
    section: '03',
    title: 'Linear Algebra',
    credits: 1,
    instructor: { name: 'Prof. Samuel Ortiz', email: 'sortiz@pomona.edu' },
    campus: 'Pomona',
    term: TERM,
    color: 'emerald',
    meetings: [{ days: ['Tue', 'Thu'], start: '09:35', end: '10:50', location: 'Estella 2113' }],
    description: 'Vector spaces, linear transformations, eigenvalues, and inner product spaces.',
    announcements: [
      { id: 'a4', date: '2026-11-08', title: 'Quiz Thursday', body: 'Covers sections 5.1–5.3 (eigenvalues and diagonalization).' },
    ],
    assignments: [
      { id: 's10', title: 'HW 9', due: '2026-11-13', points: 30 },
      { id: 's11', title: 'Quiz 5', due: '2026-11-13', points: 20 },
    ],
    handouts: [{ id: 'f7', name: 'Syllabus.pdf', size: '120 KB' }],
  },
  {
    id: 'c5',
    code: 'PE 010',
    section: '01',
    title: 'Climbing',
    credits: 0,
    instructor: { name: 'Coach Jordan Blake', email: 'jblake@cmc.edu' },
    campus: 'CMC',
    term: TERM,
    color: 'violet',
    meetings: [{ days: ['Fri'], start: '10:00', end: '11:30', location: 'Roberts Pavilion' }],
    description: 'Introductory indoor climbing. Pass/No Credit.',
    announcements: [],
    assignments: [],
    handouts: [],
  },
];

export const terms: Term[] = [
  {
    id: 'FA26',
    name: 'Fall 2026',
    current: true,
    grades: [
      { courseCode: 'ECON 101', title: 'Intermediate Microeconomics', credits: 1, grade: null, midterm: 'A-' },
      { courseCode: 'CSCI 036', title: 'Computer Science II', credits: 1, grade: null, midterm: 'A' },
      { courseCode: 'GOVT 020', title: 'Introduction to American Politics', credits: 1, grade: null, midterm: 'B+' },
      { courseCode: 'MATH 060', title: 'Linear Algebra', credits: 1, grade: null, midterm: 'B+' },
      { courseCode: 'PE 010', title: 'Climbing', credits: 0, grade: null },
    ],
  },
  {
    id: 'SP26',
    name: 'Spring 2026',
    grades: [
      { courseCode: 'ECON 050', title: 'Principles of Economic Analysis', credits: 1, grade: 'A' },
      { courseCode: 'CSCI 005', title: 'Intro to Computer Science', credits: 1, grade: 'A-' },
      { courseCode: 'MATH 032', title: 'Calculus III', credits: 1, grade: 'B+' },
      { courseCode: 'PHIL 030', title: 'Ethics', credits: 1, grade: 'A-' },
    ],
  },
  {
    id: 'FA25',
    name: 'Fall 2025',
    grades: [
      { courseCode: 'FHS 010', title: 'Freshman Humanities Seminar', credits: 1, grade: 'A-' },
      { courseCode: 'MATH 031', title: 'Calculus II', credits: 1, grade: 'B' },
      { courseCode: 'GOVT 080', title: 'Intro to International Relations', credits: 1, grade: 'B+' },
      { courseCode: 'LIT 010', title: 'Freshman Writing Seminar', credits: 1, grade: 'A' },
    ],
  },
];

export const finances: Finances = {
  balance: 2847.5,
  dueDate: '2026-12-01',
  transactions: [
    { id: 't1', date: '2026-11-01', description: 'Lab Fee – CSCI 036', amount: 75, category: 'Fees' },
    { id: 't2', date: '2026-10-15', description: 'Payment – Thank you', amount: -5000, category: 'Payment' },
    { id: 't3', date: '2026-08-20', description: 'CMC Grant', amount: -28500, category: 'Aid' },
    { id: 't4', date: '2026-08-20', description: 'Federal Pell Grant', amount: -3697.5, category: 'Aid' },
    { id: 't5', date: '2026-08-15', description: 'Room – Stark Hall', amount: 5310, category: 'Housing' },
    { id: 't6', date: '2026-08-15', description: 'Board – 16 Meal Plan', amount: 4290, category: 'Meals' },
    { id: 't7', date: '2026-08-15', description: 'Student Activities Fee', amount: 170, category: 'Fees' },
    { id: 't8', date: '2026-08-15', description: 'Fall Tuition', amount: 30200, category: 'Tuition' },
  ],
  aid: [
    { id: 'aw1', name: 'CMC Grant', type: 'Grant', offered: 57000, accepted: 57000, status: 'Accepted' },
    { id: 'aw2', name: 'Federal Pell Grant', type: 'Grant', offered: 7395, accepted: 7395, status: 'Accepted' },
    { id: 'aw3', name: 'Federal Work-Study', type: 'Work-Study', offered: 2500, accepted: 2500, status: 'Accepted' },
    { id: 'aw4', name: 'Federal Direct Subsidized Loan', type: 'Loan', offered: 4500, accepted: 0, status: 'Pending' },
  ],
};

export const announcements: Announcement[] = [
  {
    id: 'n1',
    date: '2026-11-10',
    source: 'Registrar',
    title: 'Spring 2027 registration opens Nov 17',
    body: 'Juniors register starting 8:00am Nov 17. Meet with your advisor to get your PIN released before then.',
    important: true,
  },
  {
    id: 'n2',
    date: '2026-11-09',
    source: 'Dean of Students',
    title: 'Thanksgiving break housing',
    body: 'Residence halls remain open over break. Fill out the break-stay form by Nov 20 if you are staying on campus.',
  },
  {
    id: 'n3',
    date: '2026-11-06',
    source: 'Career Services',
    title: 'Winter internship fair',
    body: '40+ employers in finance, consulting, and tech. Thursday Nov 19, 4–7pm, Ath.',
  },
];

export const deadlines: Deadline[] = [
  { id: 'd1', date: '2026-11-12', title: 'GOVT 020 – Response Paper 3', category: 'Course' },
  { id: 'd2', date: '2026-11-13', title: 'MATH 060 – HW 9 & Quiz 5', category: 'Course' },
  { id: 'd3', date: '2026-11-14', title: 'CSCI 036 – Project 3', category: 'Course' },
  { id: 'd4', date: '2026-11-17', title: 'Spring registration opens (juniors)', category: 'Registration' },
  { id: 'd5', date: '2026-11-20', title: 'Last day to withdraw with a W', category: 'Academic' },
  { id: 'd6', date: '2026-12-01', title: 'Student account balance due', category: 'Financial' },
  { id: 'd7', date: '2026-12-14', title: 'Final exams begin', category: 'Academic' },
];

export const catalog: CatalogSection[] = [
  {
    id: 'k1', code: 'ECON 120', section: '01', title: 'Statistics', credits: 1, instructor: 'Prof. Rachel Kim', campus: 'CMC',
    department: 'Economics', seats: { taken: 22, total: 30 },
    meetings: [{ days: ['Mon', 'Wed'], start: '13:15', end: '14:30', location: 'Bauer South 104' }],
    description: 'Probability, sampling distributions, estimation, hypothesis testing, and regression.',
  },
  {
    id: 'k2', code: 'ECON 125', section: '01', title: 'Econometrics', credits: 1, instructor: 'Prof. Marcus Lee', campus: 'CMC',
    department: 'Economics', seats: { taken: 28, total: 28 },
    meetings: [{ days: ['Tue', 'Thu'], start: '11:00', end: '12:15', location: 'Bauer North 21' }],
    description: 'Linear regression, instrumental variables, panel data, and causal inference.',
  },
  {
    id: 'k3', code: 'ECON 102', section: '02', title: 'Intermediate Macroeconomics', credits: 1, instructor: 'Prof. Tomás García', campus: 'CMC',
    department: 'Economics', seats: { taken: 18, total: 30 },
    meetings: [{ days: ['Mon', 'Wed'], start: '09:35', end: '10:50', location: 'Kravis 101' }],
    description: 'Growth, business cycles, monetary and fiscal policy in open economies.',
  },
  {
    id: 'k4', code: 'CSCI 040', section: '01', title: 'Computability & Logic', credits: 1, instructor: 'Prof. Priya Natarajan', campus: 'CMC',
    department: 'Computer Science', seats: { taken: 12, total: 24 },
    meetings: [{ days: ['Tue', 'Thu'], start: '14:45', end: '16:00', location: 'Roberts North 102' }],
    description: 'Finite automata, Turing machines, decidability, and propositional and first-order logic.',
  },
  {
    id: 'k5', code: 'CSCI 140', section: '01', title: 'Algorithms', credits: 1, instructor: 'Prof. Wen Zhao', campus: 'HMC',
    department: 'Computer Science', seats: { taken: 34, total: 40 },
    meetings: [{ days: ['Mon', 'Wed'], start: '14:45', end: '16:00', location: 'Shanahan 1460' }],
    description: 'Design and analysis of algorithms: divide and conquer, dynamic programming, graph algorithms, NP-completeness.',
  },
  {
    id: 'k6', code: 'CSCI 158', section: '01', title: 'Machine Learning', credits: 1, instructor: 'Prof. Ana Petrova', campus: 'Pomona',
    department: 'Computer Science', seats: { taken: 30, total: 30 },
    meetings: [{ days: ['Tue', 'Thu'], start: '13:15', end: '14:30', location: 'Edmunds 101' }],
    description: 'Supervised and unsupervised learning, model selection, neural networks, and ethics of ML.',
  },
  {
    id: 'k7', code: 'MATH 151', section: '01', title: 'Probability', credits: 1, instructor: 'Prof. Samuel Ortiz', campus: 'Pomona',
    department: 'Mathematics', seats: { taken: 20, total: 32 },
    meetings: [{ days: ['Mon', 'Wed', 'Fri'], start: '11:00', end: '11:50', location: 'Estella 1021' }],
    description: 'Random variables, distributions, expectation, limit theorems.',
  },
  {
    id: 'k8', code: 'GOVT 116', section: '01', title: 'Public Policy Analysis', credits: 1, instructor: 'Prof. Helen Okafor', campus: 'CMC',
    department: 'Government', seats: { taken: 15, total: 25 },
    meetings: [{ days: ['Thu'], start: '18:00', end: '20:45', location: 'Kravis 164' }],
    description: 'Tools for analyzing public policy: cost-benefit analysis, program evaluation, and implementation.',
  },
  {
    id: 'k9', code: 'PHIL 033', section: '01', title: 'Philosophy of Mind', credits: 1, instructor: 'Prof. Isaac Bloom', campus: 'Scripps',
    department: 'Philosophy', seats: { taken: 9, total: 20 },
    meetings: [{ days: ['Tue', 'Thu'], start: '09:35', end: '10:50', location: 'Balch 207' }],
    description: 'Consciousness, mental causation, personal identity, and artificial minds.',
  },
  {
    id: 'k10', code: 'PSYC 030', section: '02', title: 'Introduction to Psychology', credits: 1, instructor: 'Prof. Laura Chen', campus: 'Pitzer',
    department: 'Psychology', seats: { taken: 44, total: 50 },
    meetings: [{ days: ['Mon', 'Wed'], start: '11:00', end: '12:15', location: 'Broad 210' }],
    description: 'Survey of psychological science: cognition, development, social behavior, and mental health.',
  },
];

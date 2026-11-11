// Domain model for the portal. These shapes are independent of where the data
// comes from (demo data today, a JICS adapter later), so the UI never has to
// know about the legacy portal's HTML.

export type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  classYear: number;
  majors: string[];
  minors: string[];
  advisor: { name: string; email: string };
  mailbox: string;
  holds: Hold[];
}

export interface Hold {
  id: string;
  title: string;
  description: string;
  blocksRegistration: boolean;
}

export interface Meeting {
  days: Day[];
  start: string; // "HH:MM" 24h
  end: string;
  location: string;
}

export interface Assignment {
  id: string;
  title: string;
  due: string; // ISO date
  points?: number;
  score?: number;
}

export interface Course {
  id: string;
  code: string; // e.g. "ECON 050"
  section: string;
  title: string;
  credits: number;
  instructor: { name: string; email: string };
  campus: 'CMC' | 'Pomona' | 'Scripps' | 'HMC' | 'Pitzer';
  meetings: Meeting[];
  term: string;
  color: string; // tailwind color key used for schedule blocks
  description?: string;
  announcements?: { id: string; date: string; title: string; body: string }[];
  assignments?: Assignment[];
  handouts?: { id: string; name: string; size: string }[];
}

export interface GradeEntry {
  courseCode: string;
  title: string;
  credits: number;
  grade: string | null; // null = in progress
  midterm?: string;
}

export interface Term {
  id: string;
  name: string; // "Fall 2026"
  current?: boolean;
  grades: GradeEntry[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive = charge, negative = payment/credit
  category: 'Tuition' | 'Housing' | 'Meals' | 'Fees' | 'Payment' | 'Aid';
}

export interface AidAward {
  id: string;
  name: string;
  type: 'Grant' | 'Scholarship' | 'Loan' | 'Work-Study';
  offered: number;
  accepted: number;
  status: 'Accepted' | 'Pending' | 'Declined';
}

export interface Finances {
  balance: number;
  dueDate: string;
  transactions: Transaction[];
  aid: AidAward[];
}

export interface Announcement {
  id: string;
  date: string;
  source: string;
  title: string;
  body: string;
  important?: boolean;
}

export interface Deadline {
  id: string;
  date: string;
  title: string;
  category: 'Academic' | 'Registration' | 'Financial' | 'Course';
}

export interface CatalogSection {
  id: string;
  code: string;
  section: string;
  title: string;
  credits: number;
  instructor: string;
  campus: Course['campus'];
  meetings: Meeting[];
  seats: { taken: number; total: number };
  department: string;
  description: string;
}

export interface PortalApi {
  login(username: string, password: string): Promise<Student>;
  logout(): Promise<void>;
  getStudent(): Promise<Student>;
  getCourses(): Promise<Course[]>;
  getTerms(): Promise<Term[]>;
  getFinances(): Promise<Finances>;
  getAnnouncements(): Promise<Announcement[]>;
  getDeadlines(): Promise<Deadline[]>;
  searchCatalog(query: string, filters?: { campus?: string; department?: string }): Promise<CatalogSection[]>;
}

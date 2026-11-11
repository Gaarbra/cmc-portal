// Every link out to the official CMC systems lives here, so the real URLs can be
// filled in (or corrected) in one place.
//
// HOW TO FILL THESE IN: sign in to the real portal, open the page, and copy the
// path after "/ics" from the address bar into `path` below. An empty path
// falls back to the portal's home page, so every link always lands somewhere real.

export const PORTAL_BASE = 'https://portal.claremontmckenna.edu/ics';

export interface OfficialLink {
  label: string;
  path: string; // path under PORTAL_BASE, e.g. "/Academics/..."; '' = portal home
  description: string;
}

export const OFFICIAL = {
  home: { label: 'Student Portal', path: '', description: 'The official CMC portal' },
  grades: { label: 'Grades & Transcript', path: '', description: 'Official grade report and unofficial transcript' },
  schedule: { label: 'Course Schedule', path: '', description: 'Official schedule of classes' },
  courses: { label: 'Course Pages', path: '', description: 'Course materials posted on the portal' },
  registration: { label: 'Add / Drop', path: '', description: 'Official registration and add/drop' },
  finances: { label: 'Student Account', path: '', description: 'Statements and online payment' },
  aid: { label: 'Financial Aid', path: '', description: 'Award letters and requirements' },
  profile: { label: 'Personal Information', path: '', description: 'Update your address and contacts' },
} satisfies Record<string, OfficialLink>;

export type OfficialKey = keyof typeof OFFICIAL;

export const officialUrl = (key: OfficialKey) => PORTAL_BASE + OFFICIAL[key].path;

export const COLLEGE_SITE = 'https://www.cmc.edu';

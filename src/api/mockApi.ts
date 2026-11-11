import type { PortalApi } from './types';
import * as data from './mockData';

const delay = <T,>(value: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(structuredClone(value)), ms));

/** Demo implementation backed by local sample data. Accepts any credentials. */
export const mockApi: PortalApi = {
  async login(username) {
    if (!username.trim()) throw new Error('Enter your username');
    return delay(data.student, 500);
  },
  async logout() {},
  getStudent: () => delay(data.student),
  getCourses: () => delay(data.courses),
  getTerms: () => delay(data.terms),
  getFinances: () => delay(data.finances),
  getAnnouncements: () => delay(data.announcements),
  getDeadlines: () => delay(data.deadlines),
  async searchCatalog(query, filters = {}) {
    const q = query.trim().toLowerCase();
    const results = data.catalog.filter(
      (c) =>
        (!q || [c.code, c.title, c.instructor, c.department].some((s) => s.toLowerCase().includes(q))) &&
        (!filters.campus || c.campus === filters.campus) &&
        (!filters.department || c.department === filters.department),
    );
    return delay(results, 150);
  },
};

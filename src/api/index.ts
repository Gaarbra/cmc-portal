import { mockApi } from './mockApi';
import type { PortalApi } from './types';

// Swap this for a real adapter (e.g. one that talks to a backend which signs in
// to portal.claremontmckenna.edu) without touching any UI code.
export const api: PortalApi = mockApi;
export * from './types';

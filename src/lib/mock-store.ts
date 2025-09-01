// Simple shared in-memory store for mock API routes
// Imported by multiple route handlers to share state during a single server process

export type AccessCode = { email: string; pin6: string; country?: string };

export const mockStore = {
  accessCodes: [] as AccessCode[]
};

export function addAccessCode(entry: AccessCode) {
  const idx = mockStore.accessCodes.findIndex(e => e.email === entry.email);
  if (idx >= 0) mockStore.accessCodes[idx] = entry;
  else mockStore.accessCodes.push(entry);
}

export function getAccessCode(email: string) {
  return mockStore.accessCodes.find(e => e.email === email);
}

export function removeAccessCode(email: string) {
  const idx = mockStore.accessCodes.findIndex(e => e.email === email);
  if (idx >= 0) mockStore.accessCodes.splice(idx, 1);
}

/**
 * Local storage utilities for persisting user data
 */

const STORAGE_KEYS = {
  USER_NAME: 'overcast-username',
} as const;

/**
 * Get user name from localStorage
 */
export function getUserName(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.USER_NAME);
}

/**
 * Save user name to localStorage
 */
export function saveUserName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
}

/**
 * Clear user name from localStorage
 */
export function clearUserName(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
}


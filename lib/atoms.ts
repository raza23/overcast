import { atom } from 'jotai';
import { UserMode } from '@/types/user';

/**
 * User mode atom - tracks if user is in student or instructor mode
 * Persists across navigation until explicitly changed
 */
export const userModeAtom = atom<UserMode>(UserMode.STUDENT);

/**
 * User display name atom - stores the name entered by user
 * Synced with localStorage
 */
export const userNameAtom = atom<string | null>(null);

/**
 * Active classroom ID atom - tracks which classroom user is in
 */
export const activeClassroomAtom = atom<number | null>(null);


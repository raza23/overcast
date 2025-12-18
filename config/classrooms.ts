import { Classroom, ClassroomStatus } from '@/types/classroom';

/**
 * Pre-defined classroom configurations for Overcast
 * 
 * Note: Room URLs are placeholder values. Replace with actual Daily.co room URLs.
 * You can create rooms at: https://dashboard.daily.co/rooms
 */
export const CLASSROOMS: Classroom[] = [
  {
    id: 1,
    name: "Cohort 1",
    // ⚠️ SETUP REQUIRED: You must create your own Daily.co rooms
    // 
    // Quick Setup (2 minutes):
    // 1. Go to: https://dashboard.daily.co/signup
    // 2. Sign up for FREE account (no credit card needed)
    // 3. In dashboard, click "Rooms" → "Create Room"
    // 4. Create 6 rooms named: overcast-cohort-1, overcast-cohort-2, etc.
    // 5. Copy each room URL and paste below
    // 
    // Example: "https://yourdomain.daily.co/overcast-cohort-1"
    roomUrl: "https://shareef.daily.co/oc1",
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  {
    id: 2,
    name: "Cohort 2",
    // For now, all rooms point to the same URL for testing
    // Create separate rooms for each cohort when ready
    roomUrl: "https://shareef.daily.co/oc1",
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  {
    id: 3,
    name: "Cohort 3",
    roomUrl: "https://shareef.daily.co/oc1",
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  {
    id: 4,
    name: "Cohort 4",
    roomUrl: "https://shareef.daily.co/oc1",
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  {
    id: 5,
    name: "Cohort 5",
    roomUrl: "https://shareef.daily.co/oc1",
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  },
  {
    id: 6,
    name: "Cohort 6",
    roomUrl: "https://shareef.daily.co/oc1",
    maxCapacity: 15,
    status: ClassroomStatus.NOT_STARTED
  }
];

/**
 * Get classroom by ID
 */
export function getClassroomById(id: number): Classroom | undefined {
  return CLASSROOMS.find(classroom => classroom.id === id);
}

/**
 * Get all classrooms
 */
export function getAllClassrooms(): Classroom[] {
  return CLASSROOMS;
}


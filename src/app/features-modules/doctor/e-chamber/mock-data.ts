// src/app/lib/mock-data.ts

export interface ScheduleSession {
  id: string | number;
  startTime: string;
  endTime: string;
  sessionName: string;
  patientCount: number;
  isActive: boolean;
  isPast: boolean;
}

export interface TodayStats {
  waitingPatients: number;
  todayPrescriptions: number;
  completedToday: number;
  totalAppointments: number;
}

export interface SessionPatient {
  id: number;
  name: string;
  age: number;
  token: string;
  concern: string;
  status: 'waiting' | 'in-progress' | 'completed';
  checkedInAt: string;
}

const scheduleSessions: ScheduleSession[] = [
  {
    id: 1,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    sessionName: 'Morning OPD',
    patientCount: 8,
    isActive: false,
    isPast: true,
  },
  {
    id: 2,
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    sessionName: 'General Consultation',
    patientCount: 12,
    isActive: true,
    isPast: false,
  },
  {
    id: 3,
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    sessionName: 'Follow-up Clinic',
    patientCount: 6,
    isActive: false,
    isPast: false,
  },
];

const patientsBySession: Record<string, SessionPatient[]> = {
  '1': [
    {
      id: 1,
      name: 'Samuel Turner',
      age: 48,
      token: 'A-01',
      concern: 'Blood pressure follow up',
      status: 'completed',
      checkedInAt: '08:45 AM',
    },
    {
      id: 2,
      name: 'Priya Das',
      age: 32,
      token: 'A-02',
      concern: 'General fatigue',
      status: 'completed',
      checkedInAt: '08:55 AM',
    },
  ],
  '2': [
    {
      id: 3,
      name: 'Rahul Sahu',
      age: 27,
      token: 'B-01',
      concern: 'Migraine episodes',
      status: 'in-progress',
      checkedInAt: '10:05 AM',
    },
    {
      id: 4,
      name: 'Nisha Patel',
      age: 35,
      token: 'B-02',
      concern: 'Seasonal allergies',
      status: 'waiting',
      checkedInAt: '10:20 AM',
    },
    {
      id: 5,
      name: 'Farhan Ali',
      age: 41,
      token: 'B-03',
      concern: 'Diabetes management',
      status: 'waiting',
      checkedInAt: '10:35 AM',
    },
    {
      id: 6,
      name: 'Ishita Ghosh',
      age: 30,
      token: 'B-04',
      concern: 'Recurring cold',
      status: 'waiting',
      checkedInAt: '10:50 AM',
    },
  ],
  '3': [
    {
      id: 7,
      name: 'Ankit Sharma',
      age: 36,
      token: 'C-01',
      concern: 'Follow-up for knee pain',
      status: 'waiting',
      checkedInAt: '01:45 PM',
    },
    {
      id: 8,
      name: 'Sunita Rao',
      age: 53,
      token: 'C-02',
      concern: 'Thyroid review',
      status: 'waiting',
      checkedInAt: '02:05 PM',
    },
  ],
};

export function getCurrentSchedule(): ScheduleSession[] {
  return scheduleSessions.map((session) => ({ ...session }));
}

export function getSessionById(
  sessionId: string | number
): ScheduleSession | undefined {
  const id = sessionId.toString();
  return scheduleSessions.find((session) => session.id.toString() === id);
}

export function getPatientsForSession(
  sessionId: string | number
): SessionPatient[] {
  const id = sessionId.toString();
  return (patientsBySession[id] ?? []).map((patient) => ({ ...patient }));
}

export function getTodayStats(): TodayStats {
  return {
    waitingPatients: 5,
    todayPrescriptions: 24,
    completedToday: 18,
    totalAppointments: 30,
  };
}

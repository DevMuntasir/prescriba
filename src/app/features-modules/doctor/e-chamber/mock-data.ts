// src/app/lib/mock-data.ts

interface ScheduleSession {
  id: string | number;
  startTime: string;
  endTime: string;
  sessionName: string;
  patientCount: number;
  isActive: boolean;
  isPast: boolean;
}

interface TodayStats {
  waitingPatients: number;
  todayPrescriptions: number;
  completedToday: number;
  totalAppointments: number;
}

export function getCurrentSchedule(): ScheduleSession[] {
  // Dummy data – replace with real logic
  return [
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
}

export function getTodayStats(): TodayStats {
  // Dummy data – replace with real logic
  return {
    waitingPatients: 5,
    todayPrescriptions: 24,
    completedToday: 18,
    totalAppointments: 30,
  };
}

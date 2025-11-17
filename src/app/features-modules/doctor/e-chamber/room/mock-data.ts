// src/app/lib/mockData.ts

export type PatientStatus = 'waiting' | 'in-consultation' | 'completed';

export interface Patient {
  id: string;
  name: string;
  token: number;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  status: PatientStatus;
  arrivalTime: string;      // "HH:mm"
  appointmentTime: string;  // "HH:mm"
}

export function getPatientQueue(): Patient[] {
  return [
    {
      id: 'p1',
      name: 'John Carter',
      token: 1,
      age: 45,
      gender: 'Male',
      status: 'waiting',
      arrivalTime: '09:00',
      appointmentTime: '09:15',
    },
    {
      id: 'p2',
      name: 'Emily Watson',
      token: 2,
      age: 32,
      gender: 'Female',
      status: 'waiting',
      arrivalTime: '09:10',
      appointmentTime: '09:25',
    },
    {
      id: 'p3',
      name: 'Michael Brown',
      token: 3,
      age: 58,
      gender: 'Male',
      status: 'waiting',
      arrivalTime: '09:20',
      appointmentTime: '09:35',
    },
    {
      id: 'p4',
      name: 'Sophia Lee',
      token: 4,
      age: 27,
      gender: 'Female',
      status: 'waiting',
      arrivalTime: '09:30',
      appointmentTime: '09:45',
    },
    {
      id: 'p5',
      name: 'Robert Miller',
      token: 5,
      age: 66,
      gender: 'Male',
      status: 'completed',
      arrivalTime: '08:30',
      appointmentTime: '08:45',
    },
    {
      id: 'p6',
      name: 'Olivia Johnson',
      token: 6,
      age: 39,
      gender: 'Female',
      status: 'completed',
      arrivalTime: '08:40',
      appointmentTime: '08:55',
    },
  ];
}

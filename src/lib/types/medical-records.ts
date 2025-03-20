// src/lib/types/medical-records.ts

export type PatientRecord = {
  id: string;
  userId: string;
  birthDate: string | null;
  address: string | null;
  phone: string | null;
  socialSecurityNumber: string | null;
  medicalHistory: string | null;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  appointments: Array<{
    id: string;
    date: string;
    duration: number;
    reason: string | null;
    notes: string | null;
    status: string;
    appointmentType: string | null;
  }>;
};

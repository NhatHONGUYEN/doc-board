export type User = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role: "PATIENT" | "DOCTOR";
};

export type Doctor = {
  id: string;
  userId: string;
  specialty: string | null;
  licenseNumber: string | null;
  phone: string | null;
  officeAddress: string | null;
  description: string | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

export type Appointment = {
  id: string;
  date: string;
  duration: number;
  reason: string | null;
  notes: string | null;
  status: string;
  patientId: string;
  doctorId: string;
  doctor: Doctor;
  createdAt: string;
  updatedAt: string;
};

export type Patient = {
  id: string;
  userId: string;
  birthDate: string | null;
  address: string | null;
  phone: string | null;
  socialSecurityNumber: string | null;
  medicalHistory: string | null;
  user: User;
  appointments: Appointment[];
  createdAt: string;
  updatedAt: string;
};

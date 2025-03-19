/**
 * Core application entities for the DocBoard system
 */

// Auth & Identity types
export type User = {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
};

export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

// Medical professional types
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
    name: string;
    email: string;
    image?: string | null;
  };
  appointments: Appointment[];
  availabilities?: Availability[];
  createdAt: string;
  updatedAt: string;
};

export type Availability = {
  id: string;
  day: number; // 0-6 for Monday-Sunday
  startTime: string; // Format "HH:MM"
  endTime: string; // Format "HH:MM"
  doctorId: string;
  createdAt: string;
  updatedAt: string;
};

// Patient & medical record types
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

// Appointment status options for better type safety
export type AppointmentStatus =
  | "confirmed"
  | "completed"
  | "cancelled"
  | "pending"
  | "no-show";

// Appointment types
export type Appointment = {
  id: string;
  date: string; // ISO string from DateTime
  duration: number;
  reason: string | null;
  notes: string | null;
  status: AppointmentStatus;
  appointmentType?: string;

  patientId: string;
  patient?: {
    id?: string;
    user?: {
      name?: string;
      image?: string;
    };
  };

  doctorId: string;
  doctor: {
    id: string;
    specialty: string | null;
    user: {
      name: string;
    };
  };

  createdAt: string;
  updatedAt: string;
};

// Analytics & Statistics
export type Stats = {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
};

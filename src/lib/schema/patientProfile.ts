// src/lib/schema/patientProfile.ts
import * as z from "zod";
import { Patient } from "@/lib/types/core-entities";

// Patient profile schema with validation
export const patientProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
});

// Infer the type from the schema for use in components
export type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

// Helper function to prepare initial values for the form
export function getDefaultPatientProfileValues(): PatientProfileFormValues {
  return {
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    address: "",
    socialSecurityNumber: "",
    medicalHistory: "",
  };
}

// Helper function to populate form values from patient data
export function mapPatientDataToFormValues(
  patient: Patient | undefined | null
): PatientProfileFormValues {
  if (!patient) return getDefaultPatientProfileValues();

  return {
    name: patient.user?.name || "",
    email: patient.user?.email || "",
    birthDate: patient.birthDate
      ? new Date(patient.birthDate).toISOString().split("T")[0]
      : "",
    phone: patient.phone || "",
    address: patient.address || "",
    socialSecurityNumber: patient.socialSecurityNumber || "",
    medicalHistory: patient.medicalHistory || "",
  };
}

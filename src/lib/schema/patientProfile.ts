// src/lib/schema/patientProfile.ts
import * as z from "zod";
import { Patient } from "@/lib/types/core-entities";

// Schéma de profil patient avec validation
export const patientProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez saisir un email valide"),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
});

// Inférer le type à partir du schéma pour utilisation dans les composants
export type PatientProfileFormValues = z.infer<typeof patientProfileSchema>;

// Fonction utilitaire pour préparer les valeurs initiales du formulaire
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

// Fonction utilitaire pour remplir les valeurs du formulaire à partir des données patient
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

// src/schemas/patientAppointment.ts
import * as z from "zod";

/**
 * Schéma de validation pour le formulaire de prise de rendez-vous patient
 */
export const appointmentFormSchema = z.object({
  doctorId: z.string({
    required_error: "Veuillez sélectionner un médecin",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string({
    required_error: "Veuillez sélectionner une heure",
  }),
  duration: z.string({
    required_error: "Veuillez sélectionner une durée de rendez-vous",
  }),
  reason: z.string().optional(),
});

/**
 * Type d'inférence pour les valeurs du formulaire de rendez-vous
 */
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

/**
 * Type pour les créneaux horaires
 */
export type TimeSlot = {
  value: string; // Format "HH:MM" pour la soumission
  label: string; // Format affiché à l'utilisateur (ex: "14h30")
  available: boolean; // Indique si le créneau est disponible
};

// src/lib/schema/appointment.ts
import * as z from "zod";

// Schéma de base pour les champs communs de rendez-vous
const appointmentBaseSchema = z.object({
  patientId: z.string({
    required_error: "Veuillez sélectionner un patient",
  }),
  doctorId: z.string(),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  duration: z
    .string({
      required_error: "Veuillez sélectionner une durée de rendez-vous",
    })
    .or(z.number()),
  appointmentType: z
    .enum(["regular", "followup", "urgent", "procedure", "consultation"], {
      invalid_type_error: "Veuillez sélectionner un type de rendez-vous valide",
    })
    .default("regular"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// Schéma pour créer un nouveau rendez-vous via le formulaire
export const appointmentFormSchema = z.object({
  patientId: z.string({
    required_error: "Veuillez sélectionner un patient",
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
  appointmentType: z
    .enum(["regular", "followup", "urgent", "procedure", "consultation"], {
      invalid_type_error: "Veuillez sélectionner un type de rendez-vous valide",
    })
    .default("regular"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// Schéma pour les données de rendez-vous dans l'API
export const appointmentApiSchema = appointmentBaseSchema.extend({
  id: z.string().optional(), // Uniquement requis lors de la mise à jour
  date: z.string().or(z.date()), // L'API accepte à la fois un objet date ou une chaîne ISO
  status: z
    .enum(["pending", "confirmed", "cancelled", "completed", "no-show"], {
      invalid_type_error: "Veuillez sélectionner un statut valide",
    })
    .default("pending"),
  timeSlot: z.string(),
  duration: z.coerce.number().positive({
    message: "La durée doit être un nombre positif",
  }),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

// Schéma pour la mise à jour du statut de rendez-vous
export const appointmentStatusUpdateSchema = z.object({
  id: z.string({
    required_error: "L'identifiant du rendez-vous est requis",
  }),
  status: z.enum(
    ["pending", "confirmed", "cancelled", "completed", "no-show"],
    {
      required_error: "Le statut est requis",
    }
  ),
});

// Schéma pour vérifier la disponibilité des rendez-vous
export const appointmentAvailabilitySchema = z.object({
  doctorId: z.string({
    required_error: "L'identifiant du médecin est requis",
  }),
  date: z.string().or(z.date()),
});

// Types dérivés
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
export type AppointmentApiData = z.infer<typeof appointmentApiSchema>;
export type AppointmentStatusUpdate = z.infer<
  typeof appointmentStatusUpdateSchema
>;
export type AppointmentAvailabilityCheck = z.infer<
  typeof appointmentAvailabilitySchema
>;

// Type pour les rendez-vous avec données associées
export interface Appointment
  extends Omit<AppointmentApiData, "patientId" | "doctorId"> {
  id: string;
  patient?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
  };
  doctor?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
    };
    specialty?: string;
  };
}

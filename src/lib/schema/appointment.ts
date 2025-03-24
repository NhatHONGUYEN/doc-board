import * as z from "zod";

// Base schema for common appointment fields
const appointmentBaseSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  doctorId: z.string(),
  date: z.date({
    required_error: "Please select a date",
  }),
  duration: z
    .string({
      required_error: "Please select an appointment duration",
    })
    .or(z.number()),
  appointmentType: z
    .enum(["regular", "followup", "urgent", "procedure", "consultation"], {
      invalid_type_error: "Please select a valid appointment type",
    })
    .default("regular"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for creating a new appointment through the form
export const appointmentFormSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  duration: z.string({
    required_error: "Please select an appointment duration",
  }),
  appointmentType: z
    .enum(["regular", "followup", "urgent", "procedure", "consultation"], {
      invalid_type_error: "Please select a valid appointment type",
    })
    .default("regular"),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

// Schema for appointment data in the API
export const appointmentApiSchema = appointmentBaseSchema.extend({
  id: z.string().optional(), // Only required when updating
  date: z.string().or(z.date()), // API accepts both date object or ISO string
  status: z
    .enum(["pending", "confirmed", "cancelled", "completed", "no-show"], {
      invalid_type_error: "Please select a valid status",
    })
    .default("pending"),
  timeSlot: z.string(),
  duration: z.coerce.number().positive({
    message: "Duration must be a positive number",
  }),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

// Schema for updating appointment status
export const appointmentStatusUpdateSchema = z.object({
  id: z.string({
    required_error: "Appointment ID is required",
  }),
  status: z.enum(
    ["pending", "confirmed", "cancelled", "completed", "no-show"],
    {
      required_error: "Status is required",
    }
  ),
});

// Schema for checking appointment availability
export const appointmentAvailabilitySchema = z.object({
  doctorId: z.string({
    required_error: "Doctor ID is required",
  }),
  date: z.string().or(z.date()),
});

// Derived types
export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
export type AppointmentApiData = z.infer<typeof appointmentApiSchema>;
export type AppointmentStatusUpdate = z.infer<
  typeof appointmentStatusUpdateSchema
>;
export type AppointmentAvailabilityCheck = z.infer<
  typeof appointmentAvailabilitySchema
>;

// Type for appointment with related data
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

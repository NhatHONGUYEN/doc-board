import { create } from "zustand";
import { TimeSlot } from "@/lib/schema/patientAppointment";

/**
 * Store Zustand pour gérer l'état du formulaire de prise de rendez-vous patient
 */
interface PatientAppointmentFormState {
  // États
  timeSlots: TimeSlot[];
  isSubmitting: boolean;
  selectedDoctor: string | null;
  selectedDate: Date | null;
  formErrors: Record<string, string>;
  formSuccess: boolean;

  // Actions
  setTimeSlots: (slots: TimeSlot[]) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setSelectedDoctor: (doctorId: string | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  setFormSuccess: (success: boolean) => void;
  resetForm: () => void;
}

/**
 * Hook pour accéder et manipuler l'état du formulaire de rendez-vous patient
 */
export const usePatientAppointmentFormStore =
  create<PatientAppointmentFormState>((set) => ({
    // États initiaux
    timeSlots: [],
    isSubmitting: false,
    selectedDoctor: null,
    selectedDate: null,
    formErrors: {},
    formSuccess: false,

    // Actions
    setTimeSlots: (slots) => set({ timeSlots: slots }),
    setSubmitting: (isSubmitting) => set({ isSubmitting }),
    setSelectedDoctor: (doctorId) => set({ selectedDoctor: doctorId }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setFormErrors: (errors) => set({ formErrors: errors }),
    setFormSuccess: (success) => set({ formSuccess: success }),
    resetForm: () =>
      set({
        timeSlots: [],
        isSubmitting: false,
        selectedDoctor: null,
        selectedDate: null,
        formErrors: {},
        formSuccess: false,
      }),
  }));

// src/lib/store/useMedicalRecordsStore.ts
import { create } from "zustand";
import { PatientRecord } from "@/lib/types/medical-records";

type MedicalRecordsState = {
  // Data and status
  patient: PatientRecord | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;

  // Editing states
  isEditing: boolean;
  editableNotes: string;
  isSaving: boolean;

  // Actions
  fetchPatientRecord: (patientId: string, doctorId: string) => Promise<void>;
  updateMedicalHistory: (
    patientId: string,
    medicalHistory: string
  ) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
  setEditableNotes: (notes: string) => void;
  resetStore: () => void;
};

const initialState = {
  patient: null,
  isLoading: false,
  isError: false,
  error: null,
  isEditing: false,
  editableNotes: "",
  isSaving: false,
};

export const useMedicalRecordsStore = create<MedicalRecordsState>(
  (set, get) => ({
    ...initialState,

    // Action to fetch patient record
    fetchPatientRecord: async (patientId: string) => {
      if (!patientId) return;

      try {
        set({ isLoading: true, isError: false, error: null });

        // Use the patient ID directly with your existing API endpoint
        const response = await fetch(`/api/patients/${patientId}/records`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch patient records: ${response.statusText}`
          );
        }

        const patient = await response.json();
        set({
          patient,
          isLoading: false,
          editableNotes: patient.medicalHistory || "",
        });
      } catch (error) {
        console.error(error);
        set({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    },

    // Action to update medical history
    updateMedicalHistory: async (patientId: string, medicalHistory: string) => {
      try {
        set({ isSaving: true });

        // Update the medical history using the patient ID
        const response = await fetch(
          `/api/patients/${patientId}/medical-history`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ medicalHistory }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update medical history: ${response.statusText}`
          );
        }

        const updatedPatient = await response.json();

        const currentPatient = get().patient;
        if (!currentPatient) {
          throw new Error(
            "Cannot update medical history for non-existent patient"
          );
        }

        // Update the patient in the store
        set({
          patient: {
            ...currentPatient,
            medicalHistory: updatedPatient.medicalHistory,
          },
          isEditing: false,
          isSaving: false,
        });
      } catch (error) {
        console.error(error);
        set({
          isSaving: false,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    },

    // UI state actions
    setIsEditing: (isEditing: boolean) => set({ isEditing }),
    setEditableNotes: (editableNotes: string) => set({ editableNotes }),
    resetStore: () => set(initialState),
  })
);

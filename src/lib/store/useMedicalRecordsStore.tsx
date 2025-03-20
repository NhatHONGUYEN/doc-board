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
  fetchPatientRecord: (patientId: string, userId: string) => Promise<void>;
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
    fetchPatientRecord: async (patientId: string, userId: string) => {
      if (!patientId || !userId) return;

      try {
        set({ isLoading: true, isError: false, error: null });

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
      const { patient } = get();

      if (!patient) {
        set({
          isError: true,
          error: new Error("Patient data is required"),
        });
        return;
      }

      try {
        set({ isSaving: true });

        // First get the full patient data
        const patientResponse = await fetch(
          `/api/patient?userId=${patient.userId}`
        );

        if (!patientResponse.ok) {
          throw new Error("Failed to fetch patient data");
        }

        const patientData = await patientResponse.json();

        // Then update with the new medical history
        const response = await fetch(`/api/patient?userId=${patient.userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...patientData,
            medicalHistory,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update medical record");
        }

        // Update local state
        set({
          patient: { ...patient, medicalHistory },
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

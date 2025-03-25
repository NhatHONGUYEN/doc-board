// src/hooks/useMedicalRecordsListStore.ts
import { create } from "zustand";
import { toast } from "sonner";
import { PatientRecord } from "@/lib/types/medical-records";
import { QueryClient } from "@tanstack/react-query";

// Utility function to create and manage query client
const createQueryClientManager = () => {
  let queryClientInstance: QueryClient | null = null;

  return {
    getInstance: () => {
      if (typeof window === "undefined") return null;
      if (!queryClientInstance) {
        queryClientInstance = new QueryClient();
      }
      return queryClientInstance;
    },
  };
};

const queryClientManager = createQueryClientManager();

// Filter utility function
const filterPatients = (
  patients: PatientRecord[],
  searchTerm: string
): PatientRecord[] => {
  if (!searchTerm.trim()) return patients;

  const searchString = searchTerm.toLowerCase();
  return patients.filter(
    (patient) =>
      (patient.user?.name ?? "").toLowerCase().includes(searchString) ||
      (patient.socialSecurityNumber ?? "")
        .toLowerCase()
        .includes(searchString) ||
      (patient.medicalHistory ?? "").toLowerCase().includes(searchString)
  );
};

// API utility functions
const patientApi = {
  async fetchPatients(): Promise<PatientRecord[]> {
    const response = await fetch("/api/patients");
    if (!response.ok) {
      throw new Error("Failed to fetch patient records");
    }
    return response.json();
  },

  async updatePatientRecord(patient: PatientRecord): Promise<PatientRecord> {
    const response = await fetch(`/api/patient?userId=${patient.userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      throw new Error("Failed to update medical record");
    }

    return response.json();
  },
};

// Zustand store type
type MedicalRecordsState = {
  // Data
  patients: PatientRecord[];
  filteredPatients: PatientRecord[];
  selectedPatient: PatientRecord | null;

  // UI states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchTerm: string;
  isEditing: boolean;
  editableNotes: string;
  isSaving: boolean;
  isDetailOpen: boolean;
  initialLoadAttempted: boolean;

  // Actions
  fetchPatients: (userId: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  viewPatientRecord: (patient: PatientRecord) => void;
  closePatientRecord: () => void;
  startEditing: () => void;
  cancelEditing: () => void;
  setEditableNotes: (notes: string) => void;
  updateMedicalRecord: () => Promise<void>;
  resetStore: () => void;
};

export const useMedicalRecordsListStore = create<MedicalRecordsState>(
  (set, get) => ({
    // Initial states remain the same as in the original implementation
    patients: [],
    filteredPatients: [],
    selectedPatient: null,
    isLoading: false,
    isError: false,
    error: null,
    searchTerm: "",
    isEditing: false,
    editableNotes: "",
    isSaving: false,
    isDetailOpen: false,
    initialLoadAttempted: false,

    fetchPatients: async (userId: string) => {
      if (!userId) return;

      const queryClient = queryClientManager.getInstance();
      set({ isLoading: true, isError: false, error: null });

      try {
        const data = queryClient
          ? await queryClient.fetchQuery({
              queryKey: ["patients", userId],
              queryFn: patientApi.fetchPatients,
              staleTime: 5 * 60 * 1000, // 5 minutes
            })
          : await patientApi.fetchPatients();

        set({
          patients: data,
          filteredPatients: filterPatients(data, get().searchTerm),
          isLoading: false,
          initialLoadAttempted: true,
        });
      } catch (error) {
        console.error(error);
        set({
          isLoading: false,
          isError: true,
          error: error instanceof Error ? error : new Error(String(error)),
          initialLoadAttempted: true,
        });
        toast.error("Failed to load patient medical records");
      }
    },

    setSearchTerm: (term: string) => {
      const { patients } = get();
      set({
        searchTerm: term,
        filteredPatients: filterPatients(patients, term),
      });
    },

    viewPatientRecord: (patient: PatientRecord) => {
      set({
        selectedPatient: patient,
        editableNotes: patient.medicalHistory || "",
        isEditing: false,
        isDetailOpen: true,
      });
    },

    closePatientRecord: () => {
      set({
        isDetailOpen: false,
        selectedPatient: null,
        isEditing: false,
        editableNotes: "",
      });
    },

    startEditing: () => set({ isEditing: true }),

    cancelEditing: () => {
      const { selectedPatient } = get();
      set({
        isEditing: false,
        editableNotes: selectedPatient?.medicalHistory || "",
      });
    },

    setEditableNotes: (notes: string) => set({ editableNotes: notes }),

    updateMedicalRecord: async () => {
      const { selectedPatient, editableNotes, patients } = get();
      if (!selectedPatient) return;

      set({ isSaving: true });

      try {
        const updatedPatient = await patientApi.updatePatientRecord({
          ...selectedPatient,
          medicalHistory: editableNotes,
        });

        const updatedPatients = patients.map((p) =>
          p.id === selectedPatient.id ? updatedPatient : p
        );

        const queryClient = queryClientManager.getInstance();
        if (queryClient) {
          queryClient.setQueryData(
            ["patients", selectedPatient.userId],
            updatedPatients
          );
          queryClient.setQueryData(
            ["patient", selectedPatient.id],
            updatedPatient
          );
        }

        set({
          patients: updatedPatients,
          filteredPatients: filterPatients(updatedPatients, get().searchTerm),
          selectedPatient: updatedPatient,
          isEditing: false,
          isSaving: false,
        });

        toast.success("Medical record updated successfully");
      } catch (error) {
        console.error(error);
        set({ isSaving: false });
        toast.error("Failed to update medical record");
      }
    },

    resetStore: () =>
      set({
        isLoading: false,
        isError: false,
        error: null,
        searchTerm: "",
        isEditing: false,
        editableNotes: "",
        isSaving: false,
        isDetailOpen: false,
      }),
  })
);

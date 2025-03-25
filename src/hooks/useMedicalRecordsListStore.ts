// src/hooks/useMedicalRecordsListStore.ts
import { create } from "zustand";
import { toast } from "sonner";
import { PatientRecord } from "@/lib/types/medical-records";
import { QueryClient } from "@tanstack/react-query";

// Function to create a query client with proper types
let queryClientInstance: QueryClient | null = null;
const getQueryClient = (): QueryClient | null => {
  if (typeof window === "undefined") return null;
  if (!queryClientInstance) {
    queryClientInstance = new QueryClient();
  }
  return queryClientInstance;
};

// No need for PatientDataResponse - use PatientRecord instead!

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
    // Initial data state
    patients: [],
    filteredPatients: [],
    selectedPatient: null,

    // Initial UI state
    isLoading: false,
    isError: false,
    error: null,
    searchTerm: "",
    isEditing: false,
    editableNotes: "",
    isSaving: false,
    isDetailOpen: false,
    initialLoadAttempted: false,

    // Actions
    fetchPatients: async (userId: string) => {
      if (!userId) return;

      const queryClient = getQueryClient();
      if (!queryClient) {
        // Fall back to regular fetch if no query client
        try {
          set({ isLoading: true, isError: false, error: null });

          const response = await fetch("/api/patients");

          if (!response.ok) {
            throw new Error("Failed to fetch patient records");
          }

          const data = (await response.json()) as PatientRecord[];
          set({
            patients: data,
            filteredPatients: data,
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
        return;
      }

      // Use TanStack Query for caching
      set({ isLoading: true, isError: false, error: null });

      try {
        // Check cache first
        const cachedData = queryClient.getQueryData<PatientRecord[]>([
          "patients",
          userId,
        ]);

        if (cachedData) {
          // Use cached data immediately
          set({
            patients: cachedData,
            filteredPatients: get().searchTerm
              ? cachedData.filter((p) => {
                  const searchString = get().searchTerm.toLowerCase();
                  return (
                    (p.user?.name ?? "").toLowerCase().includes(searchString) ||
                    (p.socialSecurityNumber ?? "")
                      .toLowerCase()
                      .includes(searchString) ||
                    (p.medicalHistory ?? "")
                      .toLowerCase()
                      .includes(searchString)
                  );
                })
              : cachedData,
            isLoading: false,
            initialLoadAttempted: true,
          });
        }

        // Fetch fresh data (will update UI if different from cache)
        const data = await queryClient.fetchQuery<PatientRecord[]>({
          queryKey: ["patients", userId],
          queryFn: async () => {
            const response = await fetch("/api/patients");
            if (!response.ok) {
              throw new Error("Failed to fetch patient records");
            }
            return response.json() as Promise<PatientRecord[]>;
          },
          staleTime: 5 * 60 * 1000, // 5 minutes
        });

        set({
          patients: data,
          filteredPatients: get().searchTerm
            ? data.filter((p) => {
                const searchString = get().searchTerm.toLowerCase();
                return (
                  (p.user?.name ?? "").toLowerCase().includes(searchString) ||
                  (p.socialSecurityNumber ?? "")
                    .toLowerCase()
                    .includes(searchString) ||
                  (p.medicalHistory ?? "").toLowerCase().includes(searchString)
                );
              })
            : data,
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
      set({ searchTerm: term });

      if (!term.trim()) {
        set({ filteredPatients: patients });
        return;
      }

      const searchString = term.toLowerCase();
      const filtered = patients.filter(
        (patient) =>
          (patient.user?.name ?? "").toLowerCase().includes(searchString) ||
          (patient.socialSecurityNumber ?? "")
            .toLowerCase()
            .includes(searchString) ||
          (patient.medicalHistory ?? "").toLowerCase().includes(searchString)
      );

      set({ filteredPatients: filtered });
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
        // First get the full patient data
        const patientResponse = await fetch(
          `/api/patient?userId=${selectedPatient.userId}`
        );

        if (!patientResponse.ok) {
          throw new Error("Failed to fetch patient data");
        }

        // Use PatientRecord type instead of custom interface
        const patientData = (await patientResponse.json()) as PatientRecord;

        // Then update with the new medical history
        const response = await fetch(
          `/api/patient?userId=${selectedPatient.userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...patientData,
              medicalHistory: editableNotes,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update medical record");
        }

        // Update patients and filtered patients in one operation
        const updatedPatients = patients.map((p) =>
          p.id === selectedPatient.id
            ? { ...p, medicalHistory: editableNotes }
            : p
        );

        set({
          patients: updatedPatients,
          filteredPatients: get().searchTerm
            ? updatedPatients.filter((p) => {
                const searchString = get().searchTerm.toLowerCase();
                return (
                  (p.user?.name ?? "").toLowerCase().includes(searchString) ||
                  (p.socialSecurityNumber ?? "")
                    .toLowerCase()
                    .includes(searchString) ||
                  (p.medicalHistory ?? "").toLowerCase().includes(searchString)
                );
              })
            : updatedPatients,
          selectedPatient: {
            ...selectedPatient,
            medicalHistory: editableNotes,
          },
          isEditing: false,
          isSaving: false,
        });

        // Update the query cache
        const queryClient = getQueryClient();
        if (queryClient) {
          // Update list cache
          queryClient.setQueryData<PatientRecord[]>(
            ["patients", selectedPatient.userId],
            (oldData) => {
              if (!oldData) return updatedPatients;
              return oldData.map((p) =>
                p.id === selectedPatient.id
                  ? { ...p, medicalHistory: editableNotes }
                  : p
              );
            }
          );

          // Update individual patient cache if it exists
          queryClient.setQueryData<PatientRecord>(
            ["patient", selectedPatient.id],
            { ...selectedPatient, medicalHistory: editableNotes }
          );
        }

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
        // Don't reset patients data or initialLoadAttempted when navigating away
      }),
  })
);

import { create } from "zustand";
import { Patient } from "@/lib/types/core-entities";

type SortKey = keyof Patient["user"] | "appointments" | "birthDate";
type SortDirection = "ascending" | "descending";

interface PatientsState {
  // Data
  filteredPatients: Patient[];
  searchTerm: string;
  sortConfig: {
    key: SortKey;
    direction: SortDirection;
  };

  // Actions
  setSearchTerm: (term: string) => void;
  setSortConfig: (key: SortKey, direction?: SortDirection) => void;
  updateFilteredPatients: (patients: Patient[]) => void;
}

export const usePatientsStore = create<PatientsState>((set, get) => ({
  // Initial state
  filteredPatients: [],
  searchTerm: "",
  sortConfig: { key: "name", direction: "ascending" },

  // Actions
  setSearchTerm: (term) => set({ searchTerm: term }),

  setSortConfig: (key) =>
    set((state) => {
      const direction =
        state.sortConfig.key === key &&
        state.sortConfig.direction === "ascending"
          ? "descending"
          : "ascending";

      return { sortConfig: { key, direction } };
    }),

  updateFilteredPatients: (patients) => {
    const { searchTerm, sortConfig } = get();
    let filtered = [...patients];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          (patient.user.name &&
            patient.user.name.toLowerCase().includes(searchLower)) ||
          (patient.user.email &&
            patient.user.email.toLowerCase().includes(searchLower)) ||
          (patient.phone &&
            patient.phone.toLowerCase().includes(searchLower)) ||
          (patient.address &&
            patient.address.toLowerCase().includes(searchLower)) ||
          (patient.socialSecurityNumber &&
            patient.socialSecurityNumber.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { key, direction } = sortConfig;

      if (key === "appointments") {
        return direction === "ascending"
          ? a.appointments.length - b.appointments.length
          : b.appointments.length - a.appointments.length;
      }

      if (key === "birthDate") {
        if (!a.birthDate) return direction === "ascending" ? 1 : -1;
        if (!b.birthDate) return direction === "ascending" ? -1 : 1;

        return direction === "ascending"
          ? new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
          : new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime();
      }

      // For user properties
      if (!a.user[key]) return direction === "ascending" ? 1 : -1;
      if (!b.user[key]) return direction === "ascending" ? -1 : 1;

      return direction === "ascending"
        ? a.user[key].localeCompare(b.user[key])
        : b.user[key].localeCompare(a.user[key]);
    });

    set({ filteredPatients: filtered });
  },
}));

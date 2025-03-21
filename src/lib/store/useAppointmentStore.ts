import { create } from "zustand";
import { toast } from "sonner";
import { Appointment, AppointmentStatus } from "@/lib/types/core-entities";

// Separate the state data from the actions
type AppointmentStateData = {
  // UI State
  detailsDialogOpen: boolean;
  updateStatusDialogOpen: boolean;
  addNotesDialogOpen: boolean;

  // Data State
  selectedAppointment: Appointment | null;
  notes: string;
  newStatus: AppointmentStatus | "";

  // Loading States
  isUpdatingStatus: boolean;
  isSavingNotes: boolean;
};

// Full store type with actions
type AppointmentState = AppointmentStateData & {
  // Dialog Actions
  openDetailsDialog: (appointment: Appointment) => void;
  closeDetailsDialog: () => void;
  openUpdateStatusDialog: (appointment: Appointment) => void;
  closeUpdateStatusDialog: () => void;
  openAddNotesDialog: (appointment: Appointment) => void;
  closeAddNotesDialog: () => void;

  // Form Actions
  setNotes: (notes: string) => void;
  setNewStatus: (status: AppointmentStatus | "") => void;

  // API Actions
  updateAppointmentStatus: () => Promise<boolean>;
  addNotes: () => Promise<boolean>;

  // Reset
  resetStore: () => void;
};

// Define initial state with proper typing
const initialState: AppointmentStateData = {
  detailsDialogOpen: false,
  updateStatusDialogOpen: false,
  addNotesDialogOpen: false,
  selectedAppointment: null,
  notes: "",
  newStatus: "",
  isUpdatingStatus: false,
  isSavingNotes: false,
};

const useAppointmentStore = create<AppointmentState>((set, get) => ({
  // Initial state
  ...initialState,

  // Dialog Actions
  openDetailsDialog: (appointment) => {
    set({
      selectedAppointment: appointment,
      notes: appointment.notes || "",
      detailsDialogOpen: true,
    });
  },

  closeDetailsDialog: () => {
    set({ detailsDialogOpen: false });
  },

  openUpdateStatusDialog: (appointment) => {
    set({
      selectedAppointment: appointment,
      newStatus: appointment.status,
      updateStatusDialogOpen: true,
    });
  },

  closeUpdateStatusDialog: () => {
    set({ updateStatusDialogOpen: false });
  },

  openAddNotesDialog: (appointment) => {
    set({
      selectedAppointment: appointment,
      notes: appointment.notes || "",
      addNotesDialogOpen: true,
    });
  },

  closeAddNotesDialog: () => {
    set({ addNotesDialogOpen: false });
  },

  // Form Actions
  setNotes: (notes) => {
    set({ notes });
  },

  setNewStatus: (status) => {
    set({ newStatus: status });
  },

  // API Actions
  updateAppointmentStatus: async () => {
    const { selectedAppointment, newStatus } = get();
    if (!selectedAppointment || !newStatus) return false;

    set({ isUpdatingStatus: true });
    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      toast.success(`Appointment marked as ${newStatus}`);
      set({ updateStatusDialogOpen: false });
      return true;
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error(error);
      return false;
    } finally {
      set({ isUpdatingStatus: false });
    }
  },

  addNotes: async () => {
    const { selectedAppointment, notes } = get();
    if (!selectedAppointment || !notes.trim()) return false;

    set({ isSavingNotes: true });
    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add notes");
      }

      toast.success("Notes added successfully");
      set({ addNotesDialogOpen: false });
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add notes"
      );
      console.error(error);
      return false;
    } finally {
      set({ isSavingNotes: false });
    }
  },

  // Reset Store
  resetStore: () => {
    set(initialState);
  },
}));

export default useAppointmentStore;

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { format } from "date-fns";
import { Patient } from "@/lib/types/core-entities";

interface AppointmentData {
  patientId: string;
  doctorId: string;
  date: string | Date;
  timeSlot: string;
  notes?: string;
  reason?: string;
}

type TimeSlot = {
  value: string;
  label: string;
  available: boolean;
};

interface AppointmentFormState {
  // Patient selection state
  patients: Patient[];
  filteredPatients: Patient[];
  searchTerm: string;
  isLoadingPatients: boolean;
  error: Error | null;

  // Time slots state
  timeSlots: TimeSlot[];
  isCheckingAvailability: boolean;

  // Form submission state
  isSubmitting: boolean;

  // Session-related state
  doctorId: string | null;

  // Actions
  setPatients: (patients: Patient[]) => void;
  setSearchTerm: (term: string) => void;
  filterPatients: () => void;
  fetchPatients: () => Promise<void>;

  checkAvailability: (date: Date, doctorId: string) => Promise<void>;

  submitAppointment: (appointmentData: AppointmentData) => Promise<boolean>;
  reset: () => void;
}

const useAppointmentFormStore = create<AppointmentFormState>()(
  persist(
    (set, get) => ({
      // Initial states
      patients: [],
      filteredPatients: [],
      searchTerm: "",
      isLoadingPatients: false,
      error: null,

      timeSlots: [],
      isCheckingAvailability: false,

      isSubmitting: false,
      doctorId: null,

      // Actions for patient management
      setPatients: (patients) => set({ patients, filteredPatients: patients }),

      setSearchTerm: (searchTerm) => {
        set({ searchTerm });
        get().filterPatients();
      },

      filterPatients: () => {
        const { patients, searchTerm } = get();

        if (!patients || patients.length === 0) {
          set({ filteredPatients: [] });
          return;
        }

        if (searchTerm === "") {
          set({ filteredPatients: patients });
          return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = patients.filter(
          (patient) =>
            patient.user.name?.toLowerCase().includes(searchTermLower) ||
            patient.user.email?.toLowerCase().includes(searchTermLower)
        );

        set({ filteredPatients: filtered });
      },

      fetchPatients: async () => {
        set({ isLoadingPatients: true, error: null });

        try {
          const response = await fetch("/api/patients");

          if (!response.ok) {
            throw new Error("Failed to fetch patients");
          }

          const data = await response.json();

          if (data && Array.isArray(data)) {
            set({ patients: data, filteredPatients: data });

            if (data.length === 0) {
              toast.info("No patients found in the system");
            }
          }
        } catch (error) {
          toast.error("Failed to load patients");
          set({ error: error as Error });
          console.error(error);
        } finally {
          set({ isLoadingPatients: false });
        }
      },

      // Actions for availability management
      checkAvailability: async (date, doctorId) => {
        if (!doctorId || !date) return;

        set({ isCheckingAvailability: true });

        try {
          const formattedDate = format(date, "yyyy-MM-dd");
          const response = await fetch(
            `/api/doctor/availability?doctorId=${doctorId}&date=${formattedDate}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch availability");
          }

          const data = await response.json();

          // Create time slots from the doctor's availability
          const slots: TimeSlot[] = [];

          // If no availability is set for this day
          if (!data.availableSlots || data.availableSlots.length === 0) {
            // Create default work hours (9 AM to 5 PM in 30-minute increments)
            for (let hour = 9; hour < 17; hour++) {
              for (const minute of [0, 30]) {
                const timeString = `${hour.toString().padStart(2, "0")}:${minute
                  .toString()
                  .padStart(2, "0")}`;

                // Format for display (12-hour format)
                const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                const period = hour < 12 ? "AM" : "PM";
                const displayTime = `${displayHour}:${minute
                  .toString()
                  .padStart(2, "0")} ${period}`;

                slots.push({
                  value: timeString,
                  label: displayTime,
                  available: true,
                });
              }
            }
          } else {
            // Use the available slots from the API
            for (const slot of data.availableSlots) {
              const [hour, minute] = slot.split(":");
              const hourNum = parseInt(hour);

              // Format for display (12-hour format)
              const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
              const period = hourNum < 12 ? "AM" : "PM";
              const displayTime = `${displayHour}:${minute} ${period}`;

              slots.push({
                value: slot,
                label: displayTime,
                available: true,
              });
            }
          }

          // Mark booked slots as unavailable
          if (data.bookedSlots) {
            data.bookedSlots.forEach((bookedSlot: string) => {
              const slotToUpdate = slots.find(
                (slot) => slot.value === bookedSlot
              );
              if (slotToUpdate) {
                slotToUpdate.available = false;
              }
            });
          }

          set({ timeSlots: slots });
        } catch (error) {
          console.error(error);
          toast.error("Failed to check availability");
        } finally {
          set({ isCheckingAvailability: false });
        }
      },

      // Actions for form submission
      submitAppointment: async (appointmentData) => {
        set({ isSubmitting: true });

        try {
          const response = await fetch("/api/appointments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(appointmentData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to book appointment");
          }

          toast.success("Appointment scheduled successfully");
          return true;
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Failed to schedule appointment");
          }
          console.error(error);
          return false;
        } finally {
          set({ isSubmitting: false });
        }
      },

      // Reset store
      reset: () => {
        set({
          searchTerm: "",
          timeSlots: [],
          isCheckingAvailability: false,
          isSubmitting: false,
        });
      },
    }),
    {
      name: "appointment-form-storage",
      // Only persist these keys
      partialize: (state) => ({
        patients: state.patients,
        doctorId: state.doctorId,
      }),
    }
  )
);

export default useAppointmentFormStore;

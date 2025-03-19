import { create } from "zustand";
import { toast } from "sonner";
import { Appointment, Doctor } from "@/lib/types/patient";

type Stats = {
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
};

type DoctorDashboardState = {
  // Derived data only
  stats: Stats;
  todaysAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  updatingAppointmentId: string | null;

  // Actions
  setDoctorData: (doctor: Doctor | null) => void;
  updateAppointmentStatus: (
    appointmentId: string,
    newStatus: string
  ) => Promise<void>;
};

const useDoctorDashboardStore = create<DoctorDashboardState>((set) => ({
  stats: {
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  },
  todaysAppointments: [],
  upcomingAppointments: [],
  updatingAppointmentId: null,

  // Actions
  setDoctorData: (doctor) => {
    if (!doctor) return;

    // Calculate stats
    const uniquePatientIds = new Set(
      doctor.appointments.map((apt: Appointment) => apt.patientId)
    );

    const completed = doctor.appointments.filter(
      (apt: Appointment) => apt.status === "completed"
    ).length;

    const cancelled = doctor.appointments.filter(
      (apt: Appointment) => apt.status === "cancelled"
    ).length;

    // Get today's date and format it
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate appointments for today
    const todaysAppointments = doctor.appointments
      .filter((apt: Appointment) => {
        const appointmentDate = new Date(apt.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return (
          appointmentDate.getTime() === today.getTime() &&
          apt.status !== "cancelled"
        );
      })
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    // Calculate upcoming appointments (excluding today)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingAppointments = doctor.appointments
      .filter(
        (apt: Appointment) =>
          new Date(apt.date) >= tomorrow && apt.status !== "cancelled"
      )
      .sort(
        (a: Appointment, b: Appointment) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      .slice(0, 5); // Show only next 5 upcoming appointments

    set({
      stats: {
        totalPatients: uniquePatientIds.size,
        totalAppointments: doctor.appointments.length,
        completedAppointments: completed,
        cancelledAppointments: cancelled,
      },
      todaysAppointments,
      upcomingAppointments,
    });
  },

  updateAppointmentStatus: async (appointmentId, newStatus) => {
    set({ updatingAppointmentId: appointmentId });

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/status`,
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
      return Promise.resolve();
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error(error);
      return Promise.reject(error);
    } finally {
      set({ updatingAppointmentId: null });
    }
  },
}));

export default useDoctorDashboardStore;

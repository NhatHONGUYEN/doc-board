import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { AppointmentFormValues } from "@/lib/schema/appointment";

type UseInitializeAppointmentFormProps = {
  session: {
    user?: {
      id: string;
    };
  };
  doctor?: {
    id: string;
    [key: string]: unknown;
  };
  form: UseFormReturn<AppointmentFormValues>;
  fetchPatients: () => void;
  checkAvailability: (date: Date, doctorId: string) => void;
};

export function useInitializeAppointmentForm({
  session,
  doctor,
  form,
  fetchPatients,
  checkAvailability,
}: UseInitializeAppointmentFormProps) {
  // Fetch patients data on initial load
  useEffect(() => {
    if (session?.user?.id) {
      fetchPatients();
    }
  }, [session?.user?.id, fetchPatients]);

  // Watch for changes to date to fetch available time slots
  const watchDate = form.watch("date");

  useEffect(() => {
    if (doctor?.id && watchDate) {
      checkAvailability(watchDate, doctor.id);
    }
  }, [watchDate, doctor?.id, checkAvailability]);
}

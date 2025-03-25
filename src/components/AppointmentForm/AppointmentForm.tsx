"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { InfoNotice } from "@/components/InfoNotice";
import useSessionStore from "@/lib/store/useSessionStore";
import useAppointmentFormStore from "@/lib/store/useAppointmentFormStore";
import { useDoctorData } from "@/hooks/useDoctorData";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  appointmentFormSchema,
  AppointmentFormValues,
} from "@/lib/schema/appointment";
import PatientSelector from "./PatientSelector";
import AppointmentDetails from "./AppointmentDetails";
import AppointmentTiming from "./AppointmentTiming";
import AppointmentNotes from "./AppointmentNotes";

export default function AppointmentForm({
  router,
}: {
  router: AppRouterInstance;
}) {
  const searchParams = useSearchParams();
  const selectedDateParam = searchParams.get("date");
  const selectedPatientParam = searchParams.get("patientId");
  const { session, status } = useSessionStore();

  // Get doctor data
  const { data: doctor, isLoading: isLoadingDoctor } = useDoctorData(
    session?.user?.id
  );

  // Use the store for appointment form state
  const {
    patients,
    timeSlots,
    isCheckingAvailability,
    isSubmitting,
    fetchPatients,
    checkAvailability,
    submitAppointment,
  } = useAppointmentFormStore();

  // Initialize form with default values
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: selectedPatientParam || "",
      date: selectedDateParam ? new Date(selectedDateParam) : undefined,
      time: "",
      duration: "30", // Default to 30 min
      appointmentType: "regular",
      reason: "",
      notes: "",
    },
  });

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

  // Handle form submission
  const onSubmit = async (data: AppointmentFormValues) => {
    if (!session) {
      toast.error("You must be logged in to schedule an appointment");
      return;
    }

    if (!doctor?.id) {
      toast.error("Doctor information not available");
      return;
    }

    // Convert date and time to ISO string
    const [hours, minutes] = data.time.split(":");
    const appointmentDate = new Date(data.date);
    appointmentDate.setHours(parseInt(hours, 10));
    appointmentDate.setMinutes(parseInt(minutes, 10));

    const appointmentData = {
      patientId: data.patientId,
      doctorId: doctor.id,
      date: appointmentDate.toISOString(),
      timeSlot: data.time,
      duration: parseInt(data.duration),
      reason: data.reason || undefined,
      notes: data.notes || undefined,
      appointmentType: data.appointmentType || "regular",
      status: "confirmed",
    };

    const success = await submitAppointment(appointmentData);
    if (success) {
      router.push("/doctor/appointment");
    }
  };

  if (status === "loading" || isLoadingDoctor) {
    return <div className="p-8">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Doctor profile not found</h1>
        <p>Please complete your doctor profile first.</p>
        <Button className="mt-4" onClick={() => router.push("/doctor/profile")}>
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      {/* CardHeader removed to avoid redundancy with PageHeader */}

      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PatientSelector control={form.control} patients={patients} />
            <AppointmentDetails control={form.control} />
            <AppointmentTiming
              control={form.control}
              timeSlots={timeSlots}
              isCheckingAvailability={isCheckingAvailability}
            />
            <AppointmentNotes control={form.control} />

            <div className="flex justify-between w-full pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </div>
          </form>
        </Form>

        {/* InfoNotice added at the end of the form */}
        <div className="mt-8">
          <InfoNotice
            icon={<CalendarClock size={14} />}
            note="Note: Patients will receive an automatic notification about the new appointment."
          >
            Once scheduled, the appointment will appear on your calendar and the
            patient&apos;s dashboard. You can modify or cancel the appointment
            from your appointments page.
          </InfoNotice>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useFetchDoctors } from "@/hooks/useFetchDoctors";
import useSessionStore from "@/lib/store/useSessionStore";
import { usePatientAppointmentFormStore } from "@/lib/store/usePatientAppointmentFormStore";
import {
  appointmentFormSchema,
  AppointmentFormValues,
} from "@/lib/schema/patientAppointment";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAvailableTimeSlots } from "@/hooks/useAvailableTimeSlots";
import { useCreateAppointment } from "@/hooks/useCreateAppointment";
import { toast } from "sonner";
import { formatAppointmentData } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { DoctorSelector } from "@/components/PatientAppointment/DoctorSelector";
import { DateSelector } from "@/components/PatientAppointment/DateSelector";
import { TimeSelector } from "@/components/PatientAppointment/TimeSelector";
import { DurationSelector } from "@/components/PatientAppointment/DurationSelector";
import { ReasonField } from "@/components/PatientAppointment/ReasonField";
import { FormActions } from "@/components/PatientAppointment/FormActions";
import { Form } from "@/components/ui/form";
import { PageHeader } from "@/components/PageHeader";

// app/patient/appointment/new/page.tsx
export default function NewAppointmentPage() {
  const router = useRouter();

  return (
    <div className="container py-10">
      <PageHeader
        title="Prendre un rendez-vous"
        icon={<CalendarIcon className="h-5 w-5 text-primary" />}
        description="Réservez un rendez-vous avec l'un de nos professionnels de santé"
        actions={
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Retour
          </Button>
        }
      />

      <Suspense
        fallback={
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        }
      >
        <AppointmentFormContent router={router} />
      </Suspense>
    </div>
  );
}

function AppointmentFormContent({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const searchParams = useSearchParams();
  const selectedDateParam = searchParams.get("date");
  const { session, status } = useSessionStore();

  // Hooks et states
  const { data: doctors = [], isLoading: isDoctorsLoading } = useFetchDoctors();
  const timeSlots = usePatientAppointmentFormStore((state) => state.timeSlots);
  const setTimeSlots = usePatientAppointmentFormStore(
    (state) => state.setTimeSlots
  );
  const isSubmitting = usePatientAppointmentFormStore(
    (state) => state.isSubmitting
  );
  const setSubmitting = usePatientAppointmentFormStore(
    (state) => state.setSubmitting
  );
  const resetForm = usePatientAppointmentFormStore((state) => state.resetForm);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      doctorId: "",
      date: selectedDateParam ? new Date(selectedDateParam) : undefined,
      time: "",
      duration: "30",
      reason: "",
    },
  });

  const watchDoctorId = form.watch("doctorId");
  const watchDate = form.watch("date");
  const hasDoctorAndDate = !!watchDoctorId && !!watchDate;

  const { data: availabilityData, isLoading: isCheckingAvailability } =
    useAvailableTimeSlots(watchDoctorId, watchDate);

  // Effets
  useEffect(() => {
    if (availabilityData) {
      setTimeSlots(availabilityData.timeSlots);
      const currentTime = form.getValues("time");
      if (
        currentTime &&
        !availabilityData.availableSlots.includes(currentTime)
      ) {
        form.setValue("time", "");
      }
    }
  }, [availabilityData, form, setTimeSlots]);

  useEffect(() => {
    if (selectedDateParam && !form.getValues("doctorId")) {
      form.setValue("date", new Date(selectedDateParam));
    }
  }, [selectedDateParam, form]);

  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  // Mutation
  const createAppointmentMutation = useCreateAppointment();

  // Soumission du formulaire
  const onSubmit = async (data: AppointmentFormValues) => {
    if (isSubmitting) return;
    setSubmitting(true);

    if (!session) {
      toast.error("Vous devez être connecté pour prendre un rendez-vous");
      setSubmitting(false);
      return;
    }

    try {
      const appointmentData = formatAppointmentData(data);
      await createAppointmentMutation.mutateAsync(appointmentData);
      router.push("/patient/appointment");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Gestion des états
  if (status === "loading") return <div className="p-8">Chargement...</div>;
  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p>Veuillez vous connecter pour prendre un rendez-vous.</p>
        <Button className="mt-4" onClick={() => router.push("/auth/login")}>
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sélectionner un médecin et un horaire</CardTitle>
        <CardDescription>
          Choisissez votre médecin et l&apos;horaire de rendez-vous préférés
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DoctorSelector
              control={form.control}
              doctors={doctors}
              isLoading={isDoctorsLoading}
            />

            <DateSelector control={form.control} />

            <TimeSelector
              control={form.control}
              timeSlots={timeSlots}
              isCheckingAvailability={isCheckingAvailability}
              hasDoctorAndDate={hasDoctorAndDate}
            />

            <DurationSelector control={form.control} />

            <ReasonField control={form.control} />

            <CardFooter className="px-0 pb-0">
              <FormActions
                isPending={createAppointmentMutation.isPending}
                onCancel={() => router.back()}
              />
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

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

  // Récupérer les données du médecin
  const { data: doctor, isLoading: isLoadingDoctor } = useDoctorData(
    session?.user?.id
  );

  // Utiliser le store pour l'état du formulaire de rendez-vous
  const {
    patients,
    timeSlots,
    isCheckingAvailability,
    isSubmitting,
    fetchPatients,
    checkAvailability,
    submitAppointment,
  } = useAppointmentFormStore();

  // Initialiser le formulaire avec des valeurs par défaut
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: selectedPatientParam || "",
      date: selectedDateParam ? new Date(selectedDateParam) : undefined,
      time: "",
      duration: "30", // Par défaut 30 min
      appointmentType: "regular",
      reason: "",
      notes: "",
    },
  });

  // Récupérer les données des patients au chargement initial
  useEffect(() => {
    if (session?.user?.id) {
      fetchPatients();
    }
  }, [session?.user?.id, fetchPatients]);

  // Observer les changements de date pour récupérer les créneaux disponibles
  const watchDate = form.watch("date");

  useEffect(() => {
    if (doctor?.id && watchDate) {
      checkAvailability(watchDate, doctor.id);
    }
  }, [watchDate, doctor?.id, checkAvailability]);

  // Gérer la soumission du formulaire
  const onSubmit = async (data: AppointmentFormValues) => {
    if (!session) {
      toast.error("Vous devez être connecté pour planifier un rendez-vous");
      return;
    }

    if (!doctor?.id) {
      toast.error("Informations du médecin non disponibles");
      return;
    }

    // Convertir la date et l'heure en chaîne ISO
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
    return <div className="p-8">Chargement...</div>;
  }

  if (!doctor) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Profil médecin non trouvé</h1>
        <p>Veuillez d&apos;abord compléter votre profil médecin.</p>
        <Button className="mt-4" onClick={() => router.push("/doctor/profile")}>
          Compléter le profil
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      {/* En-tête de carte supprimé pour éviter la redondance avec PageHeader */}

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
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting
                  ? "Planification en cours..."
                  : "Planifier le rendez-vous"}
              </Button>
            </div>
          </form>
        </Form>

        {/* InfoNotice ajouté à la fin du formulaire */}
        <div className="mt-8">
          <InfoNotice
            icon={<CalendarClock size={14} />}
            note="Remarque : Les patients recevront une notification automatique concernant le nouveau rendez-vous."
          >
            Une fois planifié, le rendez-vous apparaîtra sur votre calendrier et
            sur le tableau de bord du patient. Vous pourrez modifier ou annuler
            le rendez-vous depuis votre page de rendez-vous.
          </InfoNotice>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Composant principal de la page - n'utilise pas useSearchParams
export default function NewAppointmentPage() {
  const router = useRouter();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Prendre un rendez-vous</h1>

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

// Composant séparé qui utilise useSearchParams
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import useSessionStore from "@/lib/store/useSessionStore";
import { cn } from "@/lib/utils";
import { Doctor } from "@/lib/types/core-entities";

// Schéma de validation du formulaire
const appointmentFormSchema = z.object({
  doctorId: z.string({
    required_error: "Veuillez sélectionner un médecin",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
  time: z.string({
    required_error: "Veuillez sélectionner une heure",
  }),
  duration: z.string({
    required_error: "Veuillez sélectionner une durée de rendez-vous",
  }),
  reason: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type TimeSlot = {
  value: string;
  label: string;
  available: boolean;
};

// Composant de formulaire qui utilise useSearchParams
function AppointmentFormContent({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const searchParams = useSearchParams();
  const selectedDateParam = searchParams.get("date");
  const { session, status } = useSessionStore();

  // État et logique de formulaire existants
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSelectedDoctor] = useState<string | null>(null);
  const [, setSelectedDate] = useState<Date | null>(
    selectedDateParam ? new Date(selectedDateParam) : null
  );

  // Initialisation du formulaire avec valeurs par défaut
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      doctorId: "",
      date: selectedDateParam ? new Date(selectedDateParam) : undefined,
      time: "",
      duration: "30", // Par défaut 30 min
      reason: "",
    },
  });

  // Récupérer la liste des médecins au chargement du composant
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/allDoctor");
        if (!response.ok) throw new Error("Échec de récupération des médecins");
        const data = await response.json();

        // Déboguer ce qui vient de l'API
        console.log("Données des médecins:", data);

        if (data && Array.isArray(data)) {
          setDoctors(data);
          if (data.length === 0) {
            toast.info(
              "Aucun médecin disponible dans le système pour l'instant"
            );
          }
        }
      } catch (error) {
        toast.error("Échec du chargement des médecins");
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  // Surveillance des changements de médecin et de date pour récupérer les créneaux disponibles
  const watchDoctorId = form.watch("doctorId");
  const watchDate = form.watch("date");

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!watchDoctorId || !watchDate) return;

      setIsCheckingAvailability(true);
      try {
        const formattedDate = format(watchDate, "yyyy-MM-dd");
        const response = await fetch(
          `/api/doctor/availability?doctorId=${watchDoctorId}&date=${formattedDate}`
        );

        if (!response.ok)
          throw new Error("Échec de vérification des disponibilités");

        const data = await response.json();

        // Créer uniquement des créneaux pour les heures disponibles renvoyées par l'API
        const slots: TimeSlot[] = [];

        if (data.availableSlots && data.availableSlots.length > 0) {
          // Trier les créneaux horaires pour un affichage correct
          const sortedSlots = [...data.availableSlots].sort();

          // Créer des créneaux adaptés à l'interface uniquement pour les heures disponibles
          sortedSlots.forEach((timeString) => {
            const [hour, minute] = timeString.split(":").map(Number);

            // Format d'affichage (format 24h pour la France)
            const displayTime = `${hour}h${minute.toString().padStart(2, "0")}`;

            slots.push({
              value: timeString,
              label: displayTime,
              available: true, // Tous les créneaux affichés sont disponibles
            });
          });
        }

        setTimeSlots(slots);

        // Effacer le créneau précédemment sélectionné s'il n'est plus disponible
        const currentTime = form.getValues("time");
        if (currentTime && !data.availableSlots.includes(currentTime)) {
          form.setValue("time", "");
        }
      } catch (error) {
        toast.error("Échec de vérification des disponibilités");
        console.error(error);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    if (watchDoctorId && watchDate) {
      setSelectedDoctor(watchDoctorId);
      setSelectedDate(watchDate);
      fetchAvailableTimeSlots();
    }
  }, [watchDoctorId, watchDate, form]);

  // Après l'initialisation du formulaire :
  useEffect(() => {
    // Si nous avons une date depuis l'URL mais pas de médecin sélectionné, définir uniquement la date du formulaire
    if (selectedDateParam && !form.getValues("doctorId")) {
      form.setValue("date", new Date(selectedDateParam));
    }

    // Si nous avons à la fois une date depuis l'URL et un médecin déjà sélectionné, vérifier la disponibilité
    if (selectedDateParam && form.getValues("doctorId")) {
      fetchAvailableTimeSlots(
        form.getValues("doctorId"),
        new Date(selectedDateParam)
      );
    }
  }, [selectedDateParam, form]);

  // Extraire fetchAvailableTimeSlots dans une fonction séparée pour la réutiliser
  const fetchAvailableTimeSlots = async (doctorId: string, date: Date) => {
    if (!doctorId || !date) return;

    setIsCheckingAvailability(true);
    try {
      // Reste de votre code existant pour gérer la réponse
      // ...
    } catch {
      // ...
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    if (!session) {
      toast.error("Vous devez être connecté pour prendre un rendez-vous");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convertir la date et l'heure en chaîne ISO
      const [hours, minutes] = data.time.split(":");
      const appointmentDate = new Date(data.date);
      appointmentDate.setHours(parseInt(hours, 10));
      appointmentDate.setMinutes(parseInt(minutes, 10));

      const appointmentData = {
        doctorId: data.doctorId,
        date: appointmentDate.toISOString(),
        duration: parseInt(data.duration),
        reason: data.reason || undefined,
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Échec de réservation du rendez-vous"
        );
      }

      toast.success("Rendez-vous pris avec succès");
      router.push("/patient/appointment");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Échec de réservation du rendez-vous");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8">Chargement...</div>;
  }

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

  // Retourner votre élément Card existant avec tout son contenu
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sélectionner un médecin et un horaire</CardTitle>
        <CardDescription>
          Choisissez votre médecin et l&apos;horaire de rendez-vous préférés
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Votre formulaire existant */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sélection du médecin */}
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Médecin</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un médecin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            Dr. {doctor.user.name}
                            {doctor.specialty && ` • ${doctor.specialty}`}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">
                          Aucun médecin disponible actuellement
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sélecteur de date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "d MMMM yyyy", { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={fr}
                        disabled={
                          (date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || // Pas de dates passées
                            date >
                              new Date(
                                new Date().setMonth(new Date().getMonth() + 3)
                              ) // Max 3 mois à l'avance
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Sélectionnez une date pour votre rendez-vous.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Créneaux horaires */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isCheckingAvailability || timeSlots.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isCheckingAvailability
                              ? "Vérification des disponibilités..."
                              : timeSlots.length === 0 &&
                                watchDoctorId &&
                                watchDate
                              ? "Aucun créneau disponible pour ce jour"
                              : timeSlots.length === 0
                              ? "Sélectionnez d'abord un médecin et une date"
                              : "Sélectionner une heure"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isCheckingAvailability ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Vérification des disponibilités...
                        </div>
                      ) : timeSlots.length === 0 &&
                        watchDoctorId &&
                        watchDate ? (
                        <div className="p-2 text-center text-muted-foreground">
                          Aucun créneau disponible ce jour. Veuillez
                          sélectionner une autre date.
                        </div>
                      ) : (
                        timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Durée */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la durée" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motif de la visite */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif de la consultation (Facultatif)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brève description de vos symptômes ou du motif de la consultation"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cela aide le médecin à se préparer pour votre rendez-vous.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pb-0">
              <div className="flex justify-between w-full">
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
                    ? "Réservation en cours..."
                    : "Prendre rendez-vous"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  X,
  PlusCircle,
  FileText,
  ClipboardList,
} from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import { Appointment } from "@/lib/types/core-entities";
import useSessionStore from "@/lib/store/useSessionStore";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Badge } from "@/components/ui/badge";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { PageHeader } from "@/components/PageHeader";

export default function AppointmentPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientData(session?.user?.id);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const calendarRef = useRef<FullCalendar | null>(null);
  const router = useRouter();

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Chargement de vos rendez-vous...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Erreur : {error.message}</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        Veuillez vous connecter pour voir vos rendez-vous
      </div>
    );
  }

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;

    setIsCancelling(true);
    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/cancel`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error("Échec de l'annulation du rendez-vous");
      }

      toast.success("Rendez-vous annulé avec succès");
      setCancelDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Échec de l'annulation du rendez-vous");
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const openDetailsDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsDialogOpen(true);
  };

  // Formater les rendez-vous pour FullCalendar
  const calendarEvents =
    patient?.appointments?.map((apt) => {
      const startDate = new Date(apt.date);
      const endDate = new Date(startDate.getTime() + apt.duration * 60000);

      // Définir la couleur en fonction du statut
      let backgroundColor;
      let borderColor;

      if (apt.status === "cancelled") {
        backgroundColor = "var(--destructive-200)";
        borderColor = "var(--destructive-500)";
      } else if (apt.status === "confirmed") {
        backgroundColor = "var(--primary-200)";
        borderColor = "var(--primary-500)";
      } else {
        backgroundColor = "var(--secondary-200)";
        borderColor = "var(--secondary-500)";
      }

      return {
        id: apt.id,
        title: `Dr. ${apt.doctor.user.name}`,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        extendedProps: { appointment: apt },
        backgroundColor,
        borderColor,
        textColor:
          apt.status === "cancelled"
            ? "var(--destructive-700)"
            : "var(--foreground)",
      };
    }) || [];

  // Gérer le clic sur un événement
  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps
      .appointment as Appointment;
    openDetailsDialog(appointment);
  };

  // Gérer le clic sur une date (pour la réservation)
  const handleDateClick = (info: DateClickArg) => {
    // Naviguer vers la page de réservation avec la date sélectionnée
    router.push(`/patient/appointment/new?date=${info.dateStr}`);
  };

  // Traduire le statut du rendez-vous
  const translateStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "cancelled":
        return "Annulé";
      case "completed":
        return "Terminé";
      default:
        return "En attente";
    }
  };

  return (
    <div className="container py-10">
      <PageHeader
        title="Mes Rendez-vous"
        icon={<CalendarIcon className="h-5 w-5 text-primary" />}
        description="Consultez et gérez vos rendez-vous médicaux"
        actions={
          <Button asChild>
            <Link href="/patient/appointment/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Prendre un nouveau rendez-vous
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 md:p-6 h-[70vh]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: "short",
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Lundi - Vendredi
              startTime: "09:00",
              endTime: "17:00",
            }}
            nowIndicator={true}
            dayMaxEvents={true}
            // Styles personnalisés
            eventDidMount={(info) => {
              // Ajouter une classe personnalisée pour les rendez-vous annulés
              if (
                info.event.extendedProps.appointment?.status === "cancelled"
              ) {
                info.el.classList.add("line-through", "opacity-60");
              }
            }}
            locale="fr" // Définir la localisation en français
          />
        </CardContent>
      </Card>

      {/* Boîte de dialogue des détails du rendez-vous */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge
                    variant={
                      selectedAppointment.status === "confirmed"
                        ? "default"
                        : selectedAppointment.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {translateStatus(selectedAppointment.status)}
                  </Badge>
                </div>
                <div className="text-right">
                  {new Date(selectedAppointment.date) > new Date() &&
                    selectedAppointment.status !== "cancelled" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDetailsDialogOpen(false);
                          setTimeout(
                            () => openCancelDialog(selectedAppointment),
                            100
                          );
                        }}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                </div>
              </div>

              <div className="space-y-4">
                {/* Date */}
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Heure */}
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Heure et durée</p>
                    <p className="text-muted-foreground">
                      {new Date(selectedAppointment.date).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      {" à "}
                      {new Date(
                        new Date(selectedAppointment.date).getTime() +
                          selectedAppointment.duration * 60000
                      ).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="block text-xs">
                        Durée : {selectedAppointment.duration} minutes
                      </span>
                    </p>
                  </div>
                </div>

                {/* Médecin */}
                <div className="flex items-start gap-4">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Médecin</p>
                    <p className="text-muted-foreground">
                      Dr. {selectedAppointment.doctor.user.name}
                      <span className="block text-xs">
                        {selectedAppointment.doctor.specialty ||
                          "Médecin généraliste"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Motif de la visite */}
                {selectedAppointment.reason && (
                  <div className="pt-3 border-t border-muted/20">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Motif de la visite
                        </p>
                        <p className="text-muted-foreground">
                          {selectedAppointment.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes du médecin */}
                {selectedAppointment.notes && (
                  <div className="pt-3 border-t border-muted/20">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <ClipboardList className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Notes du médecin</p>
                        <p className="text-muted-foreground">
                          {selectedAppointment.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton vers page détaillée */}
              <div className="border-t pt-4 mt-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/patient/appointment/${selectedAppointment.id}`}>
                    Voir tous les détails
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue d'annulation de rendez-vous */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Annuler le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action ne
              peut pas être annulée.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-3 my-2 border border-destructive/10 bg-destructive/5 rounded-md">
              <div className="space-y-3">
                <div className="flex items-start gap-3 px-4">
                  <div className="h-7 w-7 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                    <CalendarIcon className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Date</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-4">
                  <div className="h-7 w-7 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Heure</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(selectedAppointment.date).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 px-4">
                  <div className="h-7 w-7 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Médecin</p>
                    <p className="text-muted-foreground text-sm">
                      Dr. {selectedAppointment.doctor.user.name}
                      {selectedAppointment.doctor.specialty && (
                        <span className="block text-xs">
                          {selectedAppointment.doctor.specialty}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="flex-1"
            >
              Conserver
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
              disabled={isCancelling}
              className="flex-1"
            >
              {isCancelling
                ? "Annulation en cours..."
                : "Confirmer l'annulation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

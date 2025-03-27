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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Rendez-vous</h1>
        <Button asChild>
          <Link href="/patient/appointment/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Prendre un nouveau rendez-vous
          </Link>
        </Button>
      </div>

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
            <div className="py-4 space-y-6">
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

              <div className="grid grid-cols-[20px_1fr] gap-x-4 gap-y-3 items-start">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
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

                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
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
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Durée : {selectedAppointment.duration} minutes
                  </p>
                </div>

                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    Dr. {selectedAppointment.doctor.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.doctor.specialty ||
                      "Médecin généraliste"}
                  </p>
                </div>

                {selectedAppointment.reason && (
                  <>
                    <div className="col-span-2 mt-2">
                      <h4 className="font-medium text-sm">
                        Motif de la visite
                      </h4>
                    </div>
                    <div className="col-span-2 bg-muted p-3 rounded text-sm">
                      {selectedAppointment.reason}
                    </div>
                  </>
                )}

                {selectedAppointment.notes && (
                  <>
                    <div className="col-span-2 mt-2">
                      <h4 className="font-medium text-sm">Notes du médecin</h4>
                    </div>
                    <div className="col-span-2 bg-muted p-3 rounded text-sm">
                      {selectedAppointment.notes}
                    </div>
                  </>
                )}
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
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(selectedAppointment.date).toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(selectedAppointment.date).toLocaleTimeString(
                      "fr-FR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Dr. {selectedAppointment.doctor.user.name}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Conserver le rendez-vous
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
              disabled={isCancelling}
            >
              {isCancelling
                ? "Annulation en cours..."
                : "Annuler le rendez-vous"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Card, CardContent } from "@/components/ui/card";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Appointment } from "@/lib/types/core-entities";
import useAppointmentStore from "@/lib/store/useAppointmentStore";
import { toast } from "sonner";
import { useAvailabilityData } from "@/hooks/useAvailabilityData";

// Emploi du temps par défaut
const DEFAULT_SCHEDULE = {
  1: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  2: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  3: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  4: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  5: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  6: { enabled: false, slots: [] },
  7: { enabled: false, slots: [] },
};

type AppointmentCalendarProps = {
  appointments: Appointment[];
  doctorId?: string; // Ajouter le prop doctorId
};

export function AppointmentCalendar({
  appointments = [],
  doctorId, // Recevoir doctorId depuis les props
}: AppointmentCalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const router = useRouter();
  const { openDetailsDialog } = useAppointmentStore();

  // Plus besoin de récupérer doctorId depuis la session
  // const { session } = useSessionStore();
  // const doctorId = session?.user?.id;

  // Récupérer les données de disponibilité avec le doctorId fourni
  const { data: availabilityData } = useAvailabilityData(doctorId);

  // Obtenir l'emploi du temps hebdomadaire, utiliser la valeur par défaut si non disponible
  const weeklySchedule = availabilityData?.weeklySchedule || DEFAULT_SCHEDULE;

  const calendarEvents = appointments.map((apt) => {
    const startDate = new Date(apt.date);
    const endDate = new Date(startDate.getTime() + apt.duration * 60000);

    return {
      id: apt.id,
      title: apt.patient?.user?.name || "Patient",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      extendedProps: { appointment: apt },
    };
  });

  // Générer les heures de travail pour FullCalendar
  const businessHours = Object.entries(weeklySchedule)
    .filter(([, dayData]) => dayData.enabled && dayData.slots.length > 0)
    .flatMap(([day, dayData]) => {
      return dayData.slots.map((slot) => ({
        daysOfWeek: [parseInt(day)],
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));
    });

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps
      .appointment as Appointment;
    openDetailsDialog(appointment);
  };

  const handleDateClick = (info: DateClickArg) => {
    // Obtenir le jour de la semaine à partir de la date cliquée
    const clickedDate = new Date(info.dateStr);
    let dayOfWeek = clickedDate.getDay(); // 0-6 où 0 est Dimanche

    // Convertir au format ISO (1-7, Lundi-Dimanche)
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Vérifier si ce jour est activé dans l'emploi du temps du médecin
    const dayAvailability =
      weeklySchedule[dayOfWeek as keyof typeof weeklySchedule];

    if (dayAvailability?.enabled && dayAvailability.slots.length > 0) {
      // Le jour est disponible, procéder à la création du rendez-vous
      router.push(`/doctor/appointment/new?date=${info.dateStr}`);
    } else {
      // Le jour n'est pas disponible, afficher un message d'erreur
      toast.error(
        "Vous n'avez pas de disponibilité définie pour ce jour. Veuillez choisir un autre jour ou mettre à jour vos disponibilités."
      );
    }
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6 h-[70vh]">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
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
          businessHours={
            businessHours.length > 0
              ? businessHours
              : {
                  daysOfWeek: [1, 2, 3, 4, 5],
                  startTime: "09:00",
                  endTime: "17:00",
                }
          }
          nowIndicator={true}
          dayMaxEvents={true}
          eventDidMount={(info) => {
            if (info.event.extendedProps.appointment?.status === "cancelled") {
              info.el.classList.add("cancelled");
            }
          }}
          buttonText={{
            today: "Aujourd'hui",
          }}
          locale="fr"
        />
      </CardContent>
    </Card>
  );
}

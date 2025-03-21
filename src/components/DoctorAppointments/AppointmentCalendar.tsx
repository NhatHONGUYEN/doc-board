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

// Default schedule for fallback
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
  doctorId?: string; // Add doctorId prop
};

export function AppointmentCalendar({
  appointments = [],
  doctorId, // Accept doctorId from props
}: AppointmentCalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const router = useRouter();
  const { openDetailsDialog } = useAppointmentStore();

  // No longer need to get doctorId from session
  // const { session } = useSessionStore();
  // const doctorId = session?.user?.id;

  // Fetch availability data with the passed doctorId
  const { data: availabilityData } = useAvailabilityData(doctorId);

  // Get weekly schedule, fallback to default if not available
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

  // Generate business hours for FullCalendar
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
    // Get day of week from clicked date
    const clickedDate = new Date(info.dateStr);
    let dayOfWeek = clickedDate.getDay(); // 0-6 where 0 is Sunday

    // Convert to ISO day format (1-7, Monday-Sunday)
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Check if this day is enabled in the doctor's schedule
    const dayAvailability =
      weeklySchedule[dayOfWeek as keyof typeof weeklySchedule];

    if (dayAvailability?.enabled && dayAvailability.slots.length > 0) {
      // Day is available, proceed to appointment creation
      router.push(`/doctor/appointment/new?date=${info.dateStr}`);
    } else {
      // Day is not available, show error message
      toast.error(
        "You don't have availability set for this day. Please choose another day or update your availability."
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
        />
      </CardContent>
    </Card>
  );
}

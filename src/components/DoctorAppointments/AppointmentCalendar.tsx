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

type AppointmentCalendarProps = {
  appointments: Appointment[];
};

export function AppointmentCalendar({
  appointments = [],
}: AppointmentCalendarProps) {
  const calendarRef = useRef<FullCalendar | null>(null);
  const router = useRouter();
  const { openDetailsDialog } = useAppointmentStore();

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

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps
      .appointment as Appointment;
    openDetailsDialog(appointment);
  };

  const handleDateClick = (info: DateClickArg) => {
    router.push(`/doctor/appointment/new?date=${info.dateStr}`);
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
          businessHours={{
            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
            startTime: "09:00",
            endTime: "17:00",
          }}
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

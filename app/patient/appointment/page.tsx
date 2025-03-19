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
    return <div className="p-8">Loading your appointments...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view your appointments</div>;
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
        throw new Error("Failed to cancel appointment");
      }

      toast.success("Appointment cancelled successfully");
      setCancelDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to cancel appointment");
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

  // Format appointments for FullCalendar
  const calendarEvents =
    patient?.appointments?.map((apt) => {
      const startDate = new Date(apt.date);
      const endDate = new Date(startDate.getTime() + apt.duration * 60000);

      // Define color based on status
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

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps
      .appointment as Appointment;
    openDetailsDialog(appointment);
  };

  // Handle date click (for booking)
  const handleDateClick = (info: DateClickArg) => {
    // Navigate to booking page with selected date
    router.push(`/patient/appointment/new?date=${info.dateStr}`);
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button asChild>
          <Link href="/patient/appointment/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Book New Appointment
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
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: "09:00",
              endTime: "17:00",
            }}
            nowIndicator={true}
            dayMaxEvents={true}
            // Custom styles
            eventDidMount={(info) => {
              // Add custom class for cancelled appointments
              if (
                info.event.extendedProps.appointment?.status === "cancelled"
              ) {
                info.el.classList.add("line-through", "opacity-60");
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
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
                    {selectedAppointment.status}
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
                        Cancel
                      </Button>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-[20px_1fr] gap-x-4 gap-y-3 items-start">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {new Date(selectedAppointment.date).toLocaleDateString(
                      undefined,
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
                    {new Date(selectedAppointment.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" to "}
                    {new Date(
                      new Date(selectedAppointment.date).getTime() +
                        selectedAppointment.duration * 60000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Duration: {selectedAppointment.duration} minutes
                  </p>
                </div>

                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    Dr. {selectedAppointment.doctor.user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.doctor.specialty ||
                      "General Practitioner"}
                  </p>
                </div>

                {selectedAppointment.reason && (
                  <>
                    <div className="col-span-2 mt-2">
                      <h4 className="font-medium text-sm">Reason for Visit</h4>
                    </div>
                    <div className="col-span-2 bg-muted p-3 rounded text-sm">
                      {selectedAppointment.reason}
                    </div>
                  </>
                )}

                {selectedAppointment.notes && (
                  <>
                    <div className="col-span-2 mt-2">
                      <h4 className="font-medium text-sm">
                        Doctor&apos;s Notes
                      </h4>
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

      {/* Cancel Appointment Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(selectedAppointment.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(selectedAppointment.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
              Keep Appointment
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelAppointment}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  FileText,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { useDoctorData } from "@/hooks/useDoctorData";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment } from "@/lib/types/patient";

export default function DoctorAppointmentPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorData(session?.user?.id);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [addNotesDialogOpen, setAddNotesDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [calendarView, setCalendarView] = useState<
    "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  >("dayGridMonth");
  const calendarRef = useRef<FullCalendar | null>(null);
  const router = useRouter();

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Loading appointments...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view appointments</div>;
  }

  const handleUpdateAppointmentStatus = async () => {
    if (!selectedAppointment || !newStatus) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      toast.success(`Appointment marked as ${newStatus}`);
      setUpdateStatusDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error(error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNotes = async () => {
    if (!selectedAppointment || !notes.trim()) return;

    setIsSavingNotes(true);
    try {
      const response = await fetch(
        `/api/appointments/${selectedAppointment.id}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add notes");
      }

      toast.success("Notes added successfully");
      setAddNotesDialogOpen(false);
      refetch();
    } catch (error) {
      toast.error("Failed to add notes");
      console.error(error);
    } finally {
      setIsSavingNotes(false);
    }
  };

  const openDetailsDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || "");
    setDetailsDialogOpen(true);
  };

  const openUpdateStatusDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status);
    setUpdateStatusDialogOpen(true);
  };

  const openAddNotesDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNotes(appointment.notes || "");
    setAddNotesDialogOpen(true);
  };

  // Format appointments for FullCalendar
  const calendarEvents =
    doctor?.appointments?.map((apt) => {
      const startDate = new Date(apt.date);
      const endDate = new Date(startDate.getTime() + apt.duration * 60000);

      // Define color based on status
      let backgroundColor;
      let borderColor;

      if (apt.status === "cancelled") {
        backgroundColor = "var(--destructive-200)";
        borderColor = "var(--destructive-500)";
      } else if (apt.status === "completed") {
        backgroundColor = "var(--success-200)";
        borderColor = "var(--success-500)";
      } else if (apt.status === "confirmed") {
        backgroundColor = "var(--primary-200)";
        borderColor = "var(--primary-500)";
      } else {
        backgroundColor = "var(--secondary-200)";
        borderColor = "var(--secondary-500)";
      }

      return {
        id: apt.id,
        title: apt.patient?.user?.name || "Patient",
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        extendedProps: { appointment: apt },
        backgroundColor,
        borderColor,
        textColor:
          apt.status === "cancelled"
            ? "var(--destructive-700)"
            : apt.status === "completed"
            ? "var(--success-700)"
            : "var(--foreground)",
      };
    }) || [];

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps
      .appointment as Appointment;
    openDetailsDialog(appointment);
  };

  // Handle date click
  const handleDateClick = (info: DateClickArg) => {
    // Navigate to scheduling page with selected date
    router.push(`/doctor/appointment/new?date=${info.dateStr}`);
  };

  // Handle view change
  const handleViewChange = (
    view: "dayGridMonth" | "timeGridWeek" | "timeGridDay"
  ) => {
    setCalendarView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  // Get today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysAppointments = doctor?.appointments
    ?.filter((apt) => {
      const appointmentDate = new Date(apt.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/doctor/availability">Manage Availability</Link>
          </Button>
          <Button asChild>
            <Link href="/doctor/appointment/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Schedule Appointment
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calendar" className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <div className="mb-4 flex justify-end space-x-2">
            <Select
              defaultValue={calendarView}
              onValueChange={(val) =>
                handleViewChange(
                  val as "dayGridMonth" | "timeGridWeek" | "timeGridDay"
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dayGridMonth">Month</SelectItem>
                <SelectItem value="timeGridWeek">Week</SelectItem>
                <SelectItem value="timeGridDay">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-4 md:p-6 h-[70vh]">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={calendarView}
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
        </TabsContent>

        <TabsContent value="today">
          <Card>
            <CardContent className="p-4 md:p-6">
              {todaysAppointments && todaysAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todaysAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={appointment.patient?.user?.image || ""}
                            alt="Patient"
                          />
                          <AvatarFallback>
                            {appointment.patient?.user?.name
                              ?.charAt(0)
                              .toUpperCase() || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {appointment.patient?.user?.name || "Patient"}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(appointment.date).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            <span>•</span>
                            <span>{appointment.duration} mins</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                        <Badge
                          variant={
                            appointment.status === "confirmed"
                              ? "default"
                              : appointment.status === "cancelled"
                              ? "destructive"
                              : appointment.status === "completed"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {appointment.status}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetailsDialog(appointment)}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => openUpdateStatusDialog(appointment)}
                            disabled={appointment.status === "cancelled"}
                          >
                            Update Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No appointments today
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You have no scheduled appointments for today.
                  </p>
                  <Button asChild>
                    <Link href="/doctor/appointment/new">
                      Schedule New Appointment
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-md">
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
                        : selectedAppointment.status === "completed"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      setTimeout(
                        () => openAddNotesDialog(selectedAppointment),
                        100
                      );
                    }}
                    disabled={selectedAppointment.status === "cancelled"}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {selectedAppointment.notes ? "Edit" : "Add"} Notes
                  </Button>
                  {selectedAppointment.status !== "cancelled" &&
                    selectedAppointment.status !== "completed" && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setDetailsDialogOpen(false);
                          setTimeout(
                            () => openUpdateStatusDialog(selectedAppointment),
                            100
                          );
                        }}
                      >
                        Update Status
                      </Button>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-[20px_1fr] gap-x-4 gap-y-3 items-start">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {selectedAppointment.patient?.user?.name || "Patient"}
                  </p>
                </div>

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
                      <h4 className="font-medium text-sm">Clinical Notes</h4>
                    </div>
                    <div className="col-span-2 bg-muted p-3 rounded text-sm">
                      {selectedAppointment.notes}
                    </div>
                  </>
                )}
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    // Navigate to patient's medical record
                    if (selectedAppointment.patientId) {
                      router.push(
                        `/doctor/medical-records/${selectedAppointment.patientId}`
                      );
                    }
                  }}
                >
                  View Patient Record
                </Button>
                <Button
                  variant="default"
                  onClick={() => setDetailsDialogOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateStatusDialogOpen}
        onOpenChange={setUpdateStatusDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Appointment Status</DialogTitle>
            <DialogDescription>
              Change the status of this appointment.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{selectedAppointment.patient?.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(selectedAppointment.date).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAppointmentStatus}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Notes Dialog */}
      <Dialog open={addNotesDialogOpen} onOpenChange={setAddNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clinical Notes</DialogTitle>
            <DialogDescription>
              Add or edit notes for this appointment.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{selectedAppointment.patient?.user?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter clinical notes here..."
                  className="min-h-32"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddNotesDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNotes} disabled={isSavingNotes}>
              {isSavingNotes && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

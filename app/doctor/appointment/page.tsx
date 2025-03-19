"use client";

import { useRef } from "react";
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
import useAppointmentStore from "@/lib/store/useAppointmentStore";
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
import { Appointment } from "@/lib/types/core-entities";

export default function DoctorAppointmentPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorData(session?.user?.id);

  // Use the appointment store instead of local state
  const {
    detailsDialogOpen,
    updateStatusDialogOpen,
    addNotesDialogOpen,
    selectedAppointment,
    isUpdatingStatus,
    isSavingNotes,
    notes,
    newStatus,
    openDetailsDialog,
    closeDetailsDialog,
    openUpdateStatusDialog,
    closeUpdateStatusDialog,
    openAddNotesDialog,
    closeAddNotesDialog,
    setNotes,
    setNewStatus,
    updateAppointmentStatus,
    addNotes: saveNotes,
  } = useAppointmentStore();

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

  // Handle after action completion
  const handleActionComplete = async () => {
    await refetch();
  };

  // Handle updating status with refetch after success
  const handleUpdateStatus = async () => {
    const success = await updateAppointmentStatus();
    if (success) {
      handleActionComplete();
    }
  };

  // Handle adding notes with refetch after success
  const handleAddNotes = async () => {
    const success = await saveNotes();
    if (success) {
      handleActionComplete();
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
      {/* Rest of your component - no changes to render output */}
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
      <Dialog open={detailsDialogOpen} onOpenChange={closeDetailsDialog}>
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
                      closeDetailsDialog();
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
                          closeDetailsDialog();
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

              {/* Rest of details dialog content - no changes */}
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
                    closeDetailsDialog();
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
                <Button variant="default" onClick={closeDetailsDialog}>
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
        onOpenChange={closeUpdateStatusDialog}
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
            <Button variant="outline" onClick={closeUpdateStatusDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus}>
              {isUpdatingStatus && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Notes Dialog */}
      <Dialog open={addNotesDialogOpen} onOpenChange={closeAddNotesDialog}>
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
            <Button variant="outline" onClick={closeAddNotesDialog}>
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

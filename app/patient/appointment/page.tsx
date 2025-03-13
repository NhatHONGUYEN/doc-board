"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, FileText, User, X, RefreshCw } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import { Appointment } from "@/lib/types/patient";
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
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
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

  const now = new Date();

  // Filter appointments
  const upcomingAppointments = patient?.appointments
    ?.filter(
      (apt: Appointment) =>
        new Date(apt.date) > now && apt.status !== "cancelled"
    )
    .sort(
      (a: Appointment, b: Appointment) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const pastAppointments = patient?.appointments
    ?.filter(
      (apt: Appointment) =>
        new Date(apt.date) <= now || apt.status === "cancelled"
    )
    .sort(
      (a: Appointment, b: Appointment) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

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

  const renderAppointmentCard = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.date);
    const isPast = appointmentDate <= now;
    const isCancelled = appointment.status === "cancelled";

    return (
      <Card key={appointment.id} className={isCancelled ? "opacity-70" : ""}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {appointmentDate.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>
                  {appointmentDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -
                  {new Date(
                    appointmentDate.getTime() + appointment.duration * 60000
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  <span className="text-muted-foreground ml-2">
                    ({appointment.duration} minutes)
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <span>Dr. {appointment.doctor.user.name}</span>
              </div>

              {appointment.reason && (
                <div className="flex items-start gap-2">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <span>{appointment.reason}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                  isCancelled
                    ? "bg-destructive/10 text-destructive"
                    : appointment.status === "confirmed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500"
                }`}
              >
                {appointment.status}
              </span>

              {!isPast && !isCancelled && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/patient/appointment/${appointment.id}/reschedule`
                      )
                    }
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openCancelDialog(appointment)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <Button asChild>
          <Link href="/patient/appointment/new">Book New Appointment</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastAppointments?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments?.length ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  No upcoming appointments
                </h3>
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have any upcoming appointments scheduled.
                </p>
                <Button asChild>
                  <Link href="/patient/appointment/new">
                    Book an Appointment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments?.length ? (
            pastAppointments.map(renderAppointmentCard)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold">No past appointments</h3>
                <p className="text-muted-foreground">
                  Your past appointments will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
                  <Calendar className="h-4 w-4" />
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

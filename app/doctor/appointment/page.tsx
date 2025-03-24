"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useDoctorData } from "@/hooks/useDoctorData";
import useSessionStore from "@/lib/store/useSessionStore";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCalendar } from "@/components/DoctorAppointments/AppointmentCalendar";
import { TodaysAppointments } from "@/components/DoctorAppointments/TodaysAppointments";
import { AppointmentDetailsDialog } from "@/components/DoctorAppointments/DoctorAppointmentDialog/AppointmentDetailsDialog";
import { UpdateStatusDialog } from "@/components/DoctorAppointments/DoctorAppointmentDialog/UpdateStatusDialog";
import { AddNotesDialog } from "@/components/DoctorAppointments/DoctorAppointmentDialog/AddNotesDialog";

export default function DoctorAppointmentPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorData(session?.user?.id);

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Loading appointments...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view appointments</div>;
  }

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

  // Handle action completion (refresh data)
  const handleActionComplete = async () => {
    await refetch();
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Manage your patient appointments, view your schedule, and update
            appointment statuses. Use the calendar view to see your full
            schedule or focus on today&apos;s upcoming appointments.
          </p>
        </div>
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
          <AppointmentCalendar
            appointments={doctor?.appointments || []}
            doctorId={doctor?.id} // Pass the doctor ID directly
          />
        </TabsContent>

        <TabsContent value="today">
          <TodaysAppointments appointments={todaysAppointments || []} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <AppointmentDetailsDialog />
      <UpdateStatusDialog onSuccessfulUpdate={handleActionComplete} />
      <AddNotesDialog onSuccessfulSave={handleActionComplete} />
    </div>
  );
}

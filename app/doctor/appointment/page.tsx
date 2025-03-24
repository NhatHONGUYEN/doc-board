"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { InfoNotice } from "@/components/InfoNotice";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, Clock, CalendarDays } from "lucide-react";
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

  // Add state to track the active tab
  const [activeTab, setActiveTab] = useState("calendar");

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
      {/* PageHeader component */}
      <PageHeader
        title="Appointments"
        icon={<Calendar className="h-5 w-5 text-primary" />}
        description="Manage your patient appointments, view your schedule, and update appointment statuses."
        actions={
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
        }
      />

      <Tabs
        defaultValue="calendar"
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="today">Today&apos;s Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <AppointmentCalendar
            appointments={doctor?.appointments || []}
            doctorId={doctor?.id}
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

      {/* InfoNotice components moved to the end */}
      <div className="mt-10">
        {activeTab === "calendar" && (
          <InfoNotice
            icon={<CalendarDays size={14} />}
            note="Note: Click on any date to view appointments or drag to create new appointment slots."
          >
            The calendar provides a comprehensive view of all your scheduled
            appointments. Different colors indicate different appointment
            statuses.
          </InfoNotice>
        )}

        {activeTab === "today" && (
          <InfoNotice
            icon={<Clock size={14} />}
            note="Note: You can update appointment status or add notes by clicking on an appointment."
          >
            Here are all your appointments scheduled for today. Manage them
            efficiently by updating their status as you complete each
            consultation.
          </InfoNotice>
        )}
      </div>
    </div>
  );
}

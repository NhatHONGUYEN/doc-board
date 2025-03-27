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
import { Loading } from "@/components/Loading";

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
    return <Loading />;
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
        title="Rendez-vous"
        icon={<Calendar className="h-5 w-5 text-primary" />}
        description="Gérez les rendez-vous de vos patients, consultez votre emploi du temps et mettez à jour les statuts des rendez-vous."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/doctor/availability">Gérer la disponibilité</Link>
            </Button>
            <Button asChild>
              <Link href="/doctor/appointment/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Planifier un rendez-vous
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
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="today">Rendez-vous du jour</TabsTrigger>
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
            note="Remarque : Cliquez sur une date pour voir les rendez-vous ou faites glisser pour créer de nouveaux créneaux."
          >
            Le calendrier offre une vue complète de tous vos rendez-vous
            programmés. Les différentes couleurs indiquent les différents
            statuts des rendez-vous.
          </InfoNotice>
        )}

        {activeTab === "today" && (
          <InfoNotice
            icon={<Clock size={14} />}
            note="Remarque : Vous pouvez mettre à jour le statut des rendez-vous ou ajouter des notes en cliquant sur un rendez-vous."
          >
            Voici tous vos rendez-vous programmés pour aujourd&apos;hui.
            Gérez-les efficacement en mettant à jour leur statut au fur et à
            mesure que vous terminez chaque consultation.
          </InfoNotice>
        )}
      </div>
    </div>
  );
}

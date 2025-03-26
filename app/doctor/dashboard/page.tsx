"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useSessionStore from "@/lib/store/useSessionStore";
import { useDoctorData } from "@/hooks/useDoctorData";
import useDoctorDashboardStore from "@/lib/store/useDoctorDashboardStore";
import { StatsOverview } from "@/components/Dashboard/StatsOverview";
import { WeeklyActivity } from "@/components/Dashboard/WeeklyActivity";
import { Clock, LayoutDashboard } from "lucide-react";
import { DashboardColumns } from "@/components/Dashboard/DashboardColumns/DashboardColumns";
import { PageHeader } from "@/components/PageHeader";

export default function DoctorDashboard() {
  const { session, status: sessionStatus } = useSessionStore();

  // Use TanStack Query for data fetching, loading and error states
  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useDoctorData(session?.user?.id);

  // Use Zustand just for derived state and actions
  const {
    stats,
    todaysAppointments,
    upcomingAppointments,
    updatingAppointmentId,
    setDoctorData,
    updateAppointmentStatus,
  } = useDoctorDashboardStore();

  // Update derived state when doctor data changes
  useEffect(() => {
    if (doctor) {
      setDoctorData(doctor);
    }
  }, [doctor, setDoctorData]);

  // Handle loading state - from TanStack Query
  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Chargement de votre tableau de bord...</div>;
  }

  // Handle error state - from TanStack Query
  if (isError) {
    return <div className="p-8 text-red-500">Erreur : {error.message}</div>;
  }

  // Handle no session
  if (!session) {
    return (
      <div className="p-8">
        Veuillez vous connecter pour voir votre tableau de bord
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="mb-8">
        {/* Top section with heading and action button */}
        <PageHeader
          title="Tableau de Bord"
          icon={<LayoutDashboard className="h-5 w-5 text-primary" />}
          actions={
            <Button asChild>
              <Link href="/doctor/availability" className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Gérer les Disponibilités
              </Link>
            </Button>
          }
          highlightedText={{
            prefix: "Bienvenue,",
            text: `Dr. ${doctor?.user?.name?.split(" ")[0]}`,
            suffix:
              ". Consultez vos rendez-vous et les statistiques des patients.",
          }}
        />
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Three equal columns layout - Now using the extracted component */}
      <DashboardColumns
        doctor={doctor || null} // Convert undefined to null
        todaysAppointments={todaysAppointments}
        upcomingAppointments={upcomingAppointments}
        updatingAppointmentId={updatingAppointmentId}
        updateAppointmentStatus={updateAppointmentStatus}
      />

      {/* Weekly Activity */}
      <WeeklyActivity
        stats={stats}
        todaysAppointments={todaysAppointments}
        upcomingAppointments={upcomingAppointments}
      />
    </div>
  );
}

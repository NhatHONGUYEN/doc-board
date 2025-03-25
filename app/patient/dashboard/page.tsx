"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Loader2, AlertTriangle } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { DashboardHeader } from "@/components/PatientDashboard/DashboardHeader";
import { NextAppointmentCard } from "@/components/PatientDashboard/NextAppointmentCard";
import { StatsOverview } from "@/components/PatientDashboard/StatsOverview";
import { UpcomingAppointments } from "@/components/PatientDashboard/UpcomingAppointments";
import { PersonalInfoCard } from "@/components/PatientDashboard/PersonalInfoCard";

export default function PatientDashboard() {
  const { session } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  // Calculate upcoming appointments
  const now = new Date();
  const upcomingAppointments = patient?.appointments
    ?.filter((apt) => new Date(apt.date) > now && apt.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Get the next appointment
  const nextAppointment =
    upcomingAppointments && upcomingAppointments.length > 0
      ? upcomingAppointments[0]
      : null;

  // Loading component to use with RoleAuthCheck
  const loadingComponent = (
    <div className="flex justify-center py-12">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );

  // Error handling component
  const ErrorDisplay = () => {
    if (!isError) return null;

    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-3 mx-auto mb-4 w-fit">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Error Loading Dashboard
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {error.message ||
              "There was a problem loading your dashboard. Please try again."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  };

  // Unauthenticated component
  const unauthenticatedComponent = (
    <div className="flex justify-center py-12">
      <div className="text-center max-w-md">
        <div className="bg-primary/10 rounded-full p-3 mx-auto mb-4 w-fit">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-1">
          Authentication Required
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Please sign in to view your personal dashboard.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/api/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <RoleAuthCheck
      allowedRoles="PATIENT"
      loadingComponent={isLoading ? loadingComponent : undefined}
      unauthenticatedComponent={unauthenticatedComponent}
    >
      {isError ? (
        <ErrorDisplay />
      ) : (
        <div className="container py-8">
          {/* Dashboard Header */}
          <DashboardHeader patientName={patient?.user?.name} />

          {/* Next Appointment Card (if exists) */}
          {nextAppointment && (
            <NextAppointmentCard appointment={nextAppointment} />
          )}

          {/* Stats Overview */}
          <StatsOverview
            upcomingAppointmentsCount={upcomingAppointments?.length || 0}
            hasMedicalHistory={!!patient?.medicalHistory}
            isProfileComplete={!!(patient?.phone && patient?.address)}
          />

          {/* Appointments and Personal Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Upcoming Appointments - Left Column (2/3 width) */}
            <div className="lg:col-span-2">
              <UpcomingAppointments appointments={upcomingAppointments || []} />
            </div>

            {/* Personal Information - Right Column (1/3 width) */}
            <div className="lg:col-span-1">
              <PersonalInfoCard patient={patient} />
            </div>
          </div>
        </div>
      )}
    </RoleAuthCheck>
  );
}

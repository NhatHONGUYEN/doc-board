"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { useDoctorData } from "@/hooks/useDoctorData";
import useSessionStore from "@/lib/store/useSessionStore";
import { PageHeader } from "@/components/PageHeader";
import { ProfessionalInformation } from "@/components/DoctorProfile/ProfessionalInformation";
import { PracticeInformation } from "@/components/DoctorProfile/PracticeInformation";
import { DoctorProfileCard } from "@/components/DoctorProfile/DoctorProfileCard";

export default function DoctorProfilePage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useDoctorData(session?.user?.id);

  // Calculate some stats
  const totalAppointments = doctor?.appointments?.length || 0;
  const upcomingAppointments =
    doctor?.appointments?.filter(
      (apt) => new Date(apt.date) > new Date() && apt.status !== "cancelled"
    ).length || 0;

  const totalPatients = new Set(
    doctor?.appointments?.map((apt) => apt.patientId) || []
  ).size;

  if (sessionStatus === "loading" || isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : undefined;
    return <ErrorState errorMessage={errorMessage} />;
  }

  if (!session) {
    return <NotAuthenticatedState />;
  }

  return (
    <div className="container py-12">
      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Info cards */}
        <div className="md:col-span-2 space-y-6">
          <PageHeader
            title="Doctor Profile"
            icon={<User className="h-5 w-5 text-primary" />}
            description="Manage your professional information and availability"
          />

          <ProfessionalInformation doctor={doctor} />

          <PracticeInformation
            totalPatients={totalPatients}
            totalAppointments={totalAppointments}
            upcomingAppointments={upcomingAppointments}
          />
        </div>

        {/* Right column - Profile card */}
        <DoctorProfileCard
          doctor={doctor}
          session={session}
          totalAppointments={totalAppointments}
          upcomingAppointments={upcomingAppointments}
        />
      </div>
    </div>
  );
}

// State components
function LoadingState() {
  return (
    <div className="flex justify-center py-12">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
        <p className="mt-4 text-muted-foreground text-sm">
          Loading your profile...
        </p>
      </div>
    </div>
  );
}

function ErrorState({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="flex justify-center py-12">
      <div className="text-center max-w-md">
        <div className="bg-destructive/10 rounded-full p-3 mx-auto mb-4 w-fit">
          <svg
            className="h-6 w-6 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-1">
          Error Loading Profile
        </h3>
        <p className="text-muted-foreground text-sm">
          {errorMessage ||
            "There was a problem loading your profile. Please try again."}
        </p>
      </div>
    </div>
  );
}

function NotAuthenticatedState() {
  return (
    <div className="flex justify-center py-12">
      <div className="text-center max-w-md">
        <div className="bg-muted rounded-full p-3 mx-auto mb-4 w-fit">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-1">
          Authentication Required
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Please sign in to view your doctor profile.
        </p>
        <Button asChild>
          <Link href="/api/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}

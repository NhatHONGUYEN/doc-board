"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Phone,
  User,
  Award,
  FileText,
  Mail,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import { useDoctorData } from "@/hooks/useDoctorData";
import useSessionStore from "@/lib/store/useSessionStore";
import { Badge } from "@/components/ui/badge";

import { Calendar, CalendarClock, Users, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import { Doctor } from "@/lib/types/core-entities";

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

  if (isError) {
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
            {error.message ||
              "There was a problem loading your profile. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
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

  return (
    <div className="container py-12">
      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Info cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-card-foreground">
              Doctor Profile
            </h1>
            <p className="text-muted-foreground">
              Manage your professional information and availability
            </p>
          </div>

          {/* Professional Information */}
          <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="bg-card border-b border-border">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2 text-primary/70" />
                    Professional Information
                  </CardTitle>
                  <CardDescription>
                    Your credentials and professional details
                  </CardDescription>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="h-9 hover:bg-primary/90 transition-colors"
                >
                  <Link href="/doctor/settings" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary/70" />
                    Full Name
                  </p>
                  <p className="font-medium text-card-foreground pl-6">
                    Dr. {doctor?.user?.name || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary/70" />
                    Email
                  </p>
                  <p className="font-medium text-card-foreground pl-6">
                    {doctor?.user?.email}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Award className="h-4 w-4 mr-2 text-primary/70" />
                    Specialty
                  </p>
                  <p className="font-medium text-card-foreground pl-6">
                    {doctor?.specialty || (
                      <span className="text-muted-foreground italic text-sm">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary/70" />
                    License Number
                  </p>
                  <p className="font-medium text-card-foreground pl-6">
                    {doctor?.licenseNumber || (
                      <span className="text-muted-foreground italic text-sm">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary/70" />
                    Phone Number
                  </p>
                  <p className="font-medium text-card-foreground pl-6">
                    {doctor?.phone || (
                      <span className="text-muted-foreground italic text-sm">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-sm text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                    Office Address
                  </p>
                  <p className="font-medium text-card-foreground pl-6">
                    {doctor?.officeAddress || (
                      <span className="text-muted-foreground italic text-sm">
                        Not provided
                      </span>
                    )}
                  </p>
                </div>

                <div className="md:col-span-2 space-y-1.5 mt-2 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">
                    Professional Description
                  </p>
                  <div className="px-4 py-3 bg-muted/20 rounded-md">
                    {doctor?.description ? (
                      <p className="text-card-foreground whitespace-pre-line">
                        {doctor.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No professional description provided. Add details about
                        your practice, experience, and specializations.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-card border-t border-border py-4 px-6">
              <div className="flex items-center text-sm text-primary/70">
                <span className="font-medium mr-2">Profile Completeness:</span>
                <div className="h-2 w-40 bg-muted rounded-full overflow-hidden mr-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${calculateProfileCompleteness(doctor)}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs">
                  {calculateProfileCompleteness(doctor)}%
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Practice Information Card */}
          <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="bg-card border-b border-border">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary/70" />
                    Practice Information
                  </CardTitle>
                  <CardDescription>
                    Your practice details and patient statistics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 bg-card">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatsCard
                  label="Total Patients"
                  value={totalPatients}
                  icon={<Users className="h-5 w-5 text-primary" />}
                  bgClass="bg-primary/5"
                />
                <StatsCard
                  label="Total Appointments"
                  value={totalAppointments}
                  icon={<Calendar className="h-5 w-5 text-primary" />}
                  bgClass="bg-primary/10"
                />
                <StatsCard
                  label="Upcoming Appointments"
                  value={upcomingAppointments}
                  icon={<CalendarClock className="h-5 w-5 text-primary" />}
                  bgClass="bg-primary/15"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Profile card */}
        <div className="md:col-span-1">
          <Card className="sticky top-20 overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardContent className="pt-6 relative">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative h-32 w-32 rounded-full border-4 border-background shadow-lg">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile picture"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-primary/5 flex items-center justify-center">
                      <User className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold text-card-foreground">
                      Dr. {doctor?.user?.name || "Doctor"}
                    </h2>
                    <Badge className="mt-1 bg-primary hover:bg-primary/90">
                      Doctor
                    </Badge>
                  </div>

                  {doctor?.specialty && (
                    <p className="text-primary font-medium">
                      {doctor.specialty}
                    </p>
                  )}

                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" />
                    {doctor?.user?.email}
                  </p>

                  {/* Quick Stats - Enhanced with consistent design */}
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-md text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="w-4 h-4 text-primary mr-1" />
                        <p className="text-xl font-bold text-card-foreground">
                          {totalAppointments}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total Appts
                      </p>
                    </div>
                    <div className="p-3 bg-primary/5 border border-primary/10 rounded-md text-center">
                      <div className="flex items-center justify-center mb-1">
                        <CalendarClock className="w-4 h-4 text-primary mr-1" />
                        <p className="text-xl font-bold text-card-foreground">
                          {upcomingAppointments}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                    </div>
                  </div>

                  <div className="pt-4 w-full">
                    <Button
                      asChild
                      className="w-full h-10 bg-primary hover:bg-primary/90"
                    >
                      <Link
                        href="/doctor/settings"
                        className="flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>

                  <div className="pt-2 w-full">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Link
                        href="/doctor/dashboard"
                        className="flex items-center justify-center gap-2"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        View Dashboard
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper components
function StatsCard({
  label,
  value,
  icon,
  bgClass,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgClass: string;
}) {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-md border border-border">
      <div className={cn("p-3 rounded-md", bgClass)}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-card-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// Helper function to calculate profile completeness
function calculateProfileCompleteness(doctor: Doctor | undefined) {
  if (!doctor) return 0;

  const fields = [
    doctor.user?.name,
    doctor.user?.email,
    doctor.specialty,
    doctor.licenseNumber,
    doctor.phone,
    doctor.officeAddress,
    doctor.description,
  ];

  const filledFields = fields.filter(
    (field) => field && field.trim().length > 0
  ).length;
  return Math.round((filledFields / fields.length) * 100);
}

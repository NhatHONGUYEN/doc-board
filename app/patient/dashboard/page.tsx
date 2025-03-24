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
  Calendar,
  Clock,
  FileText,
  User,
  Loader2,
  AlertTriangle,
  CalendarPlus,
  ArrowRight,
  CalendarClock,
  Shield,
  ExternalLink,
  Mail,
  Phone,
  Calendar as CalendarIcon,
} from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import { Appointment } from "@/lib/types/core-entities";
import useSessionStore from "@/lib/store/useSessionStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboard() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm">
            Loading your dashboard...
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
  }

  if (!session) {
    return (
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
  }

  // Calculate upcoming appointments
  const now = new Date();
  const upcomingAppointments = patient?.appointments
    ?.filter(
      (apt: Appointment) =>
        new Date(apt.date) > now && apt.status !== "cancelled"
    )
    .sort(
      (a: Appointment, b: Appointment) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .slice(0, 3);

  // Get the next appointment
  const nextAppointment =
    upcomingAppointments && upcomingAppointments.length > 0
      ? upcomingAppointments[0]
      : null;

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Patient Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {patient?.user?.name?.split(" ")[0] || "Patient"}
          </p>
        </div>

        <Button
          asChild
          className="h-10 bg-primary hover:bg-primary/90 transition-all self-start md:self-auto"
        >
          <Link href="/patient/appointment/new" className="flex items-center">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book New Appointment
          </Link>
        </Button>
      </div>

      {/* Next Appointment Card (if exists) */}
      {nextAppointment && (
        <Card className="mb-8 overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardHeader className="bg-card border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <CalendarClock className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Next Appointment
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your upcoming medical consultation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                  <AvatarImage src="" alt="Doctor" />
                  <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                    {nextAppointment.doctor?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "D"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                      {nextAppointment.status}
                    </Badge>
                    <span className="text-muted-foreground text-sm">•</span>
                    <span className="text-primary text-sm font-medium">
                      {nextAppointment.duration} minutes
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-card-foreground">
                    Dr. {nextAppointment.doctor?.user?.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {nextAppointment.doctor?.specialty ||
                      "General Practitioner"}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary/70" />
                    <span>
                      {new Date(nextAppointment.date).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                    <span className="text-muted-foreground mx-1">at</span>
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span>
                      {new Date(nextAppointment.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Link
                  href={`/patient/appointment/${nextAppointment.id}`}
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden  border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6  ">
            <div className="flex items-center gap-4 ">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Upcoming Appointments
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {upcomingAppointments?.length || 0}
                  </p>
                  <Link
                    href="/patient/appointment"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medical History</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {patient?.medicalHistory ? "Complete" : "Incomplete"}
                  </p>
                  <Link
                    href="/patient/medical-history"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Status</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {patient?.phone && patient?.address
                      ? "Complete"
                      : "Incomplete"}
                  </p>
                  <Link
                    href="/patient/profile"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
            <CardHeader className="bg-card border-b border-border">
              <div className="flex justify-between items-center pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">
                      Upcoming Appointments
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your scheduled medical consultations
                    </CardDescription>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-9 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <Link
                    href="/patient/appointment"
                    className="flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {upcomingAppointments && upcomingAppointments.length > 0 ? (
                <div className="divide-y divide-border">
                  {upcomingAppointments.map((apt: Appointment) => (
                    <div
                      key={apt.id}
                      className="p-4 hover:bg-primary/5 transition-colors"
                    >
                      <Link
                        href={`/patient/appointment/${apt.id}`}
                        className="block"
                      >
                        <div className="flex justify-between">
                          <div className="flex gap-3">
                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                              <AvatarImage src="" alt="Doctor" />
                              <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                                {apt.doctor?.user?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase() || "D"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-card-foreground">
                                Dr. {apt.doctor?.user?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {apt.doctor?.specialty ||
                                  "General Practitioner"}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <Calendar className="h-3.5 w-3.5 text-primary/70" />
                                <span>
                                  {new Date(apt.date).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </span>
                                <span className="text-border">•</span>
                                <Clock className="h-3.5 w-3.5 text-primary/70" />
                                <span>
                                  {new Date(apt.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary border-primary/20 self-start font-normal"
                          >
                            {apt.status}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center p-4">
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-full mb-4">
                    <CalendarIcon size={24} className="text-primary" />
                  </div>
                  <p className="text-card-foreground font-medium mb-1">
                    No upcoming appointments
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    You don&apos;t have any scheduled appointments
                  </p>
                  <Button
                    className="h-10 bg-primary hover:bg-primary/90 transition-all"
                    asChild
                  >
                    <Link
                      href="/patient/appointment/new"
                      className="flex items-center"
                    >
                      <CalendarPlus className="mr-2 h-4 w-4" />
                      Book an Appointment
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Personal Information Summary */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
            <CardHeader className="bg-card border-b border-border">
              <div className="flex justify-between items-center pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-card-foreground">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Your profile details
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex justify-center mb-6">
                <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                  <AvatarImage src={patient?.user?.image || ""} alt="Patient" />
                  <AvatarFallback className="bg-primary/5 text-primary text-xl font-semibold">
                    {patient?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium text-card-foreground">
                      {patient?.user?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-card-foreground">
                      {patient?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-card-foreground">
                      {patient?.phone || (
                        <span className="text-muted-foreground italic text-sm">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium text-card-foreground">
                      {patient?.birthDate ? (
                        new Date(patient.birthDate).toLocaleDateString()
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-card border-t border-border py-4 px-5">
              <Button
                asChild
                variant="outline"
                className="w-full h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Link
                  href="/patient/profile"
                  className="flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  UserPlus,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

import useSessionStore from "@/lib/store/useSessionStore";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { useDoctorData } from "@/hooks/useDoctorData";
import { Appointment } from "@/lib/types/patient";

export default function DoctorDashboard() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
    refetch,
  } = useDoctorData(session?.user?.id);

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [updatingAppointmentId, setUpdatingAppointmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (doctor?.appointments) {
      // Get unique patient IDs to count total patients
      const uniquePatientIds = new Set(
        doctor.appointments.map((apt: Appointment) => apt.patientId)
      );

      // Count different appointment statuses
      const completed = doctor.appointments.filter(
        (apt: Appointment) => apt.status === "completed"
      ).length;

      const cancelled = doctor.appointments.filter(
        (apt: Appointment) => apt.status === "cancelled"
      ).length;

      setStats({
        totalPatients: uniquePatientIds.size,
        totalAppointments: doctor.appointments.length,
        completedAppointments: completed,
        cancelledAppointments: cancelled,
      });
    }
  }, [doctor]);

  // Function to update appointment status
  const updateAppointmentStatus = async (
    appointmentId: string,
    newStatus: string
  ) => {
    setUpdatingAppointmentId(appointmentId);

    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment status");
      }

      toast.success(`Appointment marked as ${newStatus}`);
      refetch(); // Refresh doctor data to update UI
    } catch (error) {
      toast.error("Failed to update appointment status");
      console.error(error);
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Loading your dashboard...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view your dashboard</div>;
  }

  // Get today's date and format it
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate appointments for today
  const todaysAppointments = doctor?.appointments
    ?.filter((apt: Appointment) => {
      const appointmentDate = new Date(apt.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return (
        appointmentDate.getTime() === today.getTime() &&
        apt.status !== "cancelled"
      );
    })
    .sort(
      (a: Appointment, b: Appointment) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  // Calculate upcoming appointments (excluding today)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingAppointments = doctor?.appointments
    ?.filter(
      (apt: Appointment) =>
        new Date(apt.date) >= tomorrow && apt.status !== "cancelled"
    )
    .sort(
      (a: Appointment, b: Appointment) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    .slice(0, 5); // Show only next 5 upcoming appointments

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/doctor/availability">
            <Clock className="mr-2 h-4 w-4" />
            Manage Availability
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <Users size={24} className="text-primary" />
              <p className="text-2xl font-bold">{stats.totalPatients}</p>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <Calendar size={24} className="text-primary" />
              <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              <p className="text-sm text-muted-foreground">All Appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <CheckCircle size={24} className="text-green-500" />
              <p className="text-2xl font-bold">
                {stats.completedAppointments}
              </p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <XCircle size={24} className="text-destructive" />
              <p className="text-2xl font-bold">
                {stats.cancelledAppointments}
              </p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Today&apos;s Appointments</CardTitle>
                <CardDescription>
                  {today.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/doctor/appointment">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todaysAppointments && todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment: Appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-3">
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
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock size={14} />
                          <span>
                            {new Date(appointment.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>•</span>
                          <span>{appointment.duration} mins</span>
                        </div>
                        {appointment.reason && (
                          <p className="text-sm mt-2 text-muted-foreground line-clamp-1">
                            {appointment.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          appointment.status === "confirmed"
                            ? "default"
                            : appointment.status === "completed"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {appointment.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={updatingAppointmentId === appointment.id}
                          >
                            {updatingAppointmentId === appointment.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <MoreHorizontal size={16} />
                            )}
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/doctor/appointment/${appointment.id}`}
                            >
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/doctor/medical-records/${appointment.patientId}`}
                            >
                              View Patient Records
                            </Link>
                          </DropdownMenuItem>
                          {appointment.status !== "completed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "completed"
                                )
                              }
                            >
                              Mark as Completed
                            </DropdownMenuItem>
                          )}
                          {appointment.status !== "cancelled" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  "cancelled"
                                )
                              }
                              className="text-destructive"
                            >
                              Cancel Appointment
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CalendarIcon
                  size={40}
                  className="text-muted-foreground mb-4"
                />
                <p className="text-muted-foreground">
                  No appointments for today
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/doctor/availability">Update Availability</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info Panel */}
        <div className="space-y-6">
          {/* Doctor Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Doctor Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Specialty</p>
                <p className="font-medium">
                  {doctor?.specialty || "General Practice"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">License Number</p>
                <p className="font-medium">{doctor?.licenseNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Office</p>
                <p className="font-medium">{doctor?.officeAddress || "N/A"}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/doctor/profile">Edit Profile</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/doctor/patients">
                  <Users size={16} className="mr-2" />
                  View All Patients
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/doctor/appointment/new">
                  <UserPlus size={16} className="mr-2" />
                  Schedule Appointment
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/doctor/availability">
                  <Calendar size={16} className="mr-2" />
                  Update Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Appointments Preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments && upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment: Appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between text-sm border-b pb-2 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium">
                          {appointment.patient?.user?.name || "Patient"}
                        </p>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <CalendarIcon size={12} />
                          <span>
                            {new Date(appointment.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No upcoming appointments
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/doctor/appointment">View All</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

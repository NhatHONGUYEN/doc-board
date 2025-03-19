"use client";

import { useEffect } from "react";
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
  Calendar as CalendarIcon,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

import useSessionStore from "@/lib/store/useSessionStore";

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
import useDoctorDashboardStore from "@/lib/store/useDoctorDashboardStore";
import { StatsOverview } from "@/components/Dashboard/StatsOverview";

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
    return <div className="p-8">Loading your dashboard...</div>;
  }

  // Handle error state - from TanStack Query
  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  // Handle no session
  if (!session) {
    return <div className="p-8">Please sign in to view your dashboard</div>;
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header with gradient underline */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        </div>
        <Button asChild>
          <Link href="/doctor/availability">
            <Clock className="mr-2 h-4 w-4" />
            Manage Availability
          </Link>
        </Button>
      </div>

      {/* Stats Overview - Now using our extracted component */}
      <StatsOverview stats={stats} />

      {/* Three equal columns layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* First column - Today's Appointments */}
        <div>
          <Card className="h-[calc(80vh-230px)] flex flex-col backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Today&apos;s Appointments</CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/doctor/appointment">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-0">
              {/* Today's appointments content - keep unchanged */}
              {todaysAppointments && todaysAppointments.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {todaysAppointments.map((appointment: Appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="border-2 border-white dark:border-slate-800 shadow-sm">
                            <AvatarImage
                              src={appointment.patient?.user?.image || ""}
                              alt="Patient"
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
                              <Clock size={14} className="text-blue-500" />
                              <span>
                                {new Date(appointment.date).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">
                                •
                              </span>
                              <span>{appointment.duration} mins</span>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm mt-2 text-muted-foreground line-clamp-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                                {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            variant="outline"
                            className={
                              appointment.status === "confirmed"
                                ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                : appointment.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                : "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            }
                          >
                            {appointment.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                disabled={
                                  updatingAppointmentId === appointment.id
                                }
                              >
                                {updatingAppointmentId === appointment.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <MoreHorizontal size={16} />
                                )}
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl p-1"
                            >
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer rounded-lg"
                              >
                                <Link
                                  href={`/doctor/appointment/${appointment.id}`}
                                >
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer rounded-lg"
                              >
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
                                  className="cursor-pointer rounded-lg"
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
                                  className="text-destructive cursor-pointer rounded-lg"
                                >
                                  Cancel Appointment
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center p-4">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon size={32} className="text-blue-500" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No appointments for today
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your schedule is clear
                  </p>
                  <Button className="bg-blue-500 hover:bg-blue-600" asChild>
                    <Link href="/doctor/availability">Update Availability</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Second column - Upcoming Appointments */}
        <div>
          <Card className="h-[calc(80vh-230px)] flex flex-col backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <CalendarIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Next scheduled appointments
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/doctor/appointment">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-0">
              {/* Upcoming appointments content - keep unchanged */}
              {upcomingAppointments && upcomingAppointments.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {upcomingAppointments.map((appointment: Appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <Avatar className="border-2 border-white dark:border-slate-800 shadow-sm">
                            <AvatarImage
                              src={appointment.patient?.user?.image || ""}
                              alt="Patient"
                            />
                            <AvatarFallback className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
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
                              <CalendarIcon
                                size={14}
                                className="text-purple-500"
                              />
                              <span>
                                {new Date(appointment.date).toLocaleDateString(
                                  undefined,
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">
                                •
                              </span>
                              <span>
                                {new Date(appointment.date).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            {appointment.reason && (
                              <p className="text-sm mt-2 text-muted-foreground line-clamp-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-100 dark:border-slate-800">
                                {appointment.reason}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                        >
                          {appointment.duration} mins
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center p-4">
                  <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon size={32} className="text-purple-500" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No upcoming appointments
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your future schedule is clear
                  </p>
                  <Button className="bg-purple-500 hover:bg-purple-600" asChild>
                    <Link href="/doctor/availability">Update Availability</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Third column - Doctor Info + Quick Actions */}
        <div className="space-y-6">
          {/* Doctor Info Card */}
          <Card className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-white"
                    >
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                  </div>
                  Doctor Info
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                  >
                    <path d="m12 14.5 1.5 2.5 2-1 1.5 3h-9l1.5-3 2 1z"></path>
                    <path d="M9.5 9a2.5 2.5 0 0 1 5 0v7.5H9.5z"></path>
                    <path d="M6 6h1.5v4H6z"></path>
                    <path d="M16.5 6H18v4h-1.5z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Specialty</p>
                  <p className="font-medium">
                    {doctor?.specialty || "General Practice"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                  >
                    <rect
                      width="18"
                      height="11"
                      x="3"
                      y="11"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    License Number
                  </p>
                  <p className="font-medium">
                    {doctor?.licenseNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-amber-600 dark:text-amber-400"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Office</p>
                  <p className="font-medium">
                    {doctor?.officeAddress || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="/doctor/profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-2"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                  </svg>
                  Edit Profile
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Quick Actions */}
          <Card className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                  >
                    <path d="m3 2 2 5h14l2-5Z"></path>
                    <path d="M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
                    <path d="M12 12v5"></path>
                    <path d="M9.5 12v5"></path>
                    <path d="M14.5 12v5"></path>
                  </svg>
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start "
                asChild
              >
                <Link href="/doctor/patients">
                  <Users size={16} className="mr-2" />
                  View All Patients
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start "
                asChild
              >
                <Link href="/doctor/appointment/new">
                  <UserPlus size={16} className="mr-2" />
                  Schedule Appointment
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start "
                asChild
              >
                <Link href="/doctor/availability">
                  <Calendar size={16} className="mr-2" />
                  Update Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Activity - Full width at bottom */}
      <Card className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-white"
              >
                <path d="M12 20V10"></path>
                <path d="M18 20V4"></path>
                <path d="M6 20v-4"></path>
              </svg>
            </div>
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Completion rate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Completion Rate
                  </p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold mr-1">
                      {stats.totalAppointments > 0
                        ? Math.round(
                            (stats.completedAppointments /
                              stats.totalAppointments) *
                              100
                          )
                        : 0}
                      %
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-green-500"
                    >
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-green-100 dark:border-green-900/30 flex items-center justify-center">
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {stats.completedAppointments}/{stats.totalAppointments}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Today</span>
                    <span className="font-medium">
                      {todaysAppointments?.length || 0} appointments
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          todaysAppointments?.length
                            ? Math.min(100, todaysAppointments.length * 10)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="font-medium">
                      {upcomingAppointments?.length || 0} upcoming
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${
                          upcomingAppointments?.length
                            ? Math.min(100, upcomingAppointments.length * 10)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle column - Days of Week Activity */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium mb-2">Daily Activity</h3>
              <div className="flex-grow flex items-end justify-between">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="h-24 w-full rounded-md flex items-end mb-1">
                        <div
                          className={`w-full ${
                            i === new Date().getDay() - 1
                              ? "bg-green-500"
                              : "bg-slate-200 dark:bg-slate-700"
                          } rounded-md`}
                          style={{
                            height: `${Math.max(
                              15,
                              Math.floor(Math.random() * 100)
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {day}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right column - Activity Distribution */}
            <div>
              <h3 className="text-sm font-medium mb-2">
                Distribution by Status
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      Confirmed
                    </span>
                    <span className="font-medium">
                      {stats.totalAppointments -
                        stats.completedAppointments -
                        stats.cancelledAppointments}{" "}
                      appointments
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          stats.totalAppointments
                            ? Math.min(
                                100,
                                ((stats.totalAppointments -
                                  stats.completedAppointments -
                                  stats.cancelledAppointments) /
                                  stats.totalAppointments) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Completed
                    </span>
                    <span className="font-medium">
                      {stats.completedAppointments} appointments
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          stats.totalAppointments
                            ? Math.min(
                                100,
                                (stats.completedAppointments /
                                  stats.totalAppointments) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      Cancelled
                    </span>
                    <span className="font-medium">
                      {stats.cancelledAppointments} appointments
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${
                          stats.totalAppointments
                            ? Math.min(
                                100,
                                (stats.cancelledAppointments /
                                  stats.totalAppointments) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

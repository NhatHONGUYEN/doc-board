import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Calendar as CalendarIcon,
  Clock,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment, AppointmentStatus } from "@/lib/types/core-entities";

type TodaysAppointmentsProps = {
  appointments: Appointment[];
  updatingAppointmentId: string | null;
  updateAppointmentStatus: (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => Promise<void>;
};

export function TodaysAppointmentsColumn({
  appointments,
  updatingAppointmentId,
  updateAppointmentStatus,
}: TodaysAppointmentsProps) {
  return (
    <Card className="flex flex-col backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md h-full">
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
        {appointments && appointments.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {appointments.map((appointment) => (
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
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
                      <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-xl p-1"
                      >
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-lg"
                        >
                          <Link href={`/doctor/appointment/${appointment.id}`}>
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
  );
}

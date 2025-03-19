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
import { Calendar as CalendarIcon } from "lucide-react";
import { Appointment } from "@/lib/types/core-entities";

type UpcomingAppointmentsProps = {
  appointments: Appointment[];
};

export function UpcomingAppointmentsColumn({
  appointments,
}: UpcomingAppointmentsProps) {
  return (
    <Card className="flex flex-col backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md h-full">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Next scheduled appointments</CardDescription>
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
                        <CalendarIcon size={14} className="text-purple-500" />
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
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
  );
}

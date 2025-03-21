import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { Appointment } from "@/lib/types/core-entities";
import Link from "next/link";
import useAppointmentStore from "@/lib/store/useAppointmentStore";

type TodaysAppointmentsProps = {
  appointments: Appointment[];
};

export function TodaysAppointments({
  appointments = [],
}: TodaysAppointmentsProps) {
  const { openDetailsDialog, openUpdateStatusDialog } = useAppointmentStore();

  // Group appointments by time slot
  const sortAppointments = (appts: Appointment[]) => {
    return [...appts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  const sortedAppointments = sortAppointments(appointments);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40 py-3 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Today&apos;s Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {sortedAppointments && sortedAppointments.length > 0 ? (
          <div className="divide-y">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : appointment.status === "completed"
                        ? "outline"
                        : "secondary"
                    }
                    className="w-[80px] justify-center"
                  >
                    {appointment.status}
                  </Badge>

                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={appointment.patient?.user?.image || ""}
                        alt="Patient"
                      />
                      <AvatarFallback className="text-xs">
                        {appointment.patient?.user?.name
                          ?.charAt(0)
                          .toUpperCase() || "P"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">
                      {appointment.patient?.user?.name || "Patient"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>•</span>
                      <span>{appointment.duration} mins</span>
                      {appointment.appointmentType && (
                        <>
                          <span>•</span>
                          <span>{appointment.appointmentType}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openDetailsDialog(appointment)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 py-0"
                      onClick={() => openUpdateStatusDialog(appointment)}
                      disabled={appointment.status === "cancelled"}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center">
            <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground opacity-30 mb-3" />
            <h3 className="text-base font-medium mb-1">
              No appointments today
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              You have no scheduled appointments for today.
            </p>
            <Button asChild size="sm">
              <Link href="/doctor/appointment/new">
                <PlusCircle className="mr-1 h-3.5 w-3.5" />
                Schedule New Appointment
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

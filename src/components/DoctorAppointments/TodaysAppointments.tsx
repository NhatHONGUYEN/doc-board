import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock, PlusCircle } from "lucide-react";
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

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        {appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-md gap-4"
              >
                <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(appointment.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>•</span>
                      <span>{appointment.duration} mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
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
                  >
                    {appointment.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailsDialog(appointment)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openUpdateStatusDialog(appointment)}
                      disabled={appointment.status === "cancelled"}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-lg font-medium mb-2">No appointments today</h3>
            <p className="text-muted-foreground mb-4">
              You have no scheduled appointments for today.
            </p>
            <Button asChild>
              <Link href="/doctor/appointment/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule New Appointment
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

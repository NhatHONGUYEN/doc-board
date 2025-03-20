import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

type AppointmentsTabProps = {
  patient: Patient;
  onScheduleAppointment: (patientId: string) => void;
};

export function AppointmentsTab({ patient }: AppointmentsTabProps) {
  return (
    <TabsContent value="appointments">
      {patient.appointments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No appointment history for this patient.
        </div>
      ) : (
        <div className="space-y-4">
          {patient.appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">
                        {format(
                          new Date(appointment.date),
                          "EEEE, MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(new Date(appointment.date), "h:mm a")} •{" "}
                        {appointment.duration} minutes
                      </span>
                    </div>
                    {appointment.appointmentType && (
                      <Badge className="mb-2" variant="outline">
                        {appointment.appointmentType.charAt(0).toUpperCase() +
                          appointment.appointmentType.slice(1)}
                      </Badge>
                    )}
                    {appointment.reason && (
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-muted-foreground">Reason:</p>
                        <p className="text-sm border-l-2 pl-3 py-1 border-muted">
                          {appointment.reason}
                        </p>
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "default"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}

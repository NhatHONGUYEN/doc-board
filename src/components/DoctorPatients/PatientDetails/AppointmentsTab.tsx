import { format } from "date-fns";
import {
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type AppointmentsTabProps = {
  patient: Patient;
  onScheduleAppointment: (patientId: string) => void;
};

export function AppointmentsTab({
  patient,
  onScheduleAppointment,
}: AppointmentsTabProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20";
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-3.5 w-3.5 mr-1.5" />;
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5 mr-1.5" />;
      case "completed":
        return <CheckCircle className="h-3.5 w-3.5 mr-1.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5 mr-1.5" />;
    }
  };

  // Fonction pour traduire le statut du rendez-vous
  const translateStatus = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "cancelled":
        return "Annulé";
      case "completed":
        return "Terminé";
      default:
        return "En attente";
    }
  };

  return (
    <TabsContent value="appointments">
      {patient.appointments.length === 0 ? (
        <div className="text-center py-12 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm font-medium text-card-foreground mb-1">
            Aucun historique de rendez-vous
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Ce patient n&apos;a pas encore eu de rendez-vous
          </p>
          <Button
            onClick={() => onScheduleAppointment(patient.id)}
            className="bg-primary hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" />
            Planifier le premier rendez-vous
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {patient.appointments.map((appointment) => (
            <Card
              key={appointment.id}
              className="overflow-hidden border-border"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium text-card-foreground">
                          {format(
                            new Date(appointment.date),
                            "EEEE d MMMM yyyy"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Heure</p>
                        <p className="text-sm font-medium text-card-foreground">
                          {format(new Date(appointment.date), "HH:mm")}
                          {" à "}
                          {format(
                            new Date(
                              new Date(appointment.date).getTime() +
                                appointment.duration * 60000
                            ),
                            "HH:mm"
                          )}
                          <span className="text-xs text-muted-foreground ml-1.5">
                            ({appointment.duration} min)
                          </span>
                        </p>
                      </div>
                    </div>

                    {appointment.appointmentType && (
                      <div className="flex items-center ml-11">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/20"
                        >
                          {appointment.appointmentType.charAt(0).toUpperCase() +
                            appointment.appointmentType.slice(1)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Badge
                    variant="outline"
                    className={cn(
                      getStatusBadgeVariant(appointment.status),
                      "capitalize flex items-center px-2.5 py-1"
                    )}
                  >
                    {getStatusIcon(appointment.status)}
                    {translateStatus(appointment.status)}
                  </Badge>
                </div>

                {appointment.reason && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium flex items-center text-card-foreground ml-0.5">
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                        <FileText className="h-3 w-3 text-primary" />
                      </div>
                      Motif de la visite
                    </h4>
                    <div className="bg-card/50 border rounded-md p-3 ml-7">
                      <p className="text-sm text-card-foreground">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium flex items-center text-card-foreground ml-0.5">
                      <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                        <FileText className="h-3 w-3 text-primary" />
                      </div>
                      Notes cliniques
                    </h4>
                    <div className="bg-card/50 border rounded-md p-3 ml-7">
                      <p
                        className="text-sm text-card-foreground"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </TabsContent>
  );
}

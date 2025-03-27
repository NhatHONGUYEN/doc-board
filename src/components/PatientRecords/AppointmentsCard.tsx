// src/components/PatientRecords/AppointmentsCard.tsx

import { useRouter } from "next/navigation";
import { Calendar, CalendarPlus, Clock, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { PatientRecord } from "@/lib/types/medical-records";
import { InfoNotice } from "@/components/InfoNotice";

type AppointmentsCardProps = {
  patient: PatientRecord;
};

export function AppointmentsCard({ patient }: AppointmentsCardProps) {
  const router = useRouter();

  // Fonction pour planifier un nouveau rendez-vous
  const scheduleAppointment = () => {
    router.push(`/doctor/appointment/new?patientId=${patient.id}`);
  };

  // Obtenir uniquement les rendez-vous en attente (statut programmé)
  const appointments = patient.appointments || [];
  const pendingAppointments = appointments
    .filter(
      (apt) =>
        apt.status.toLowerCase() === "scheduled" &&
        new Date(apt.date) >= new Date()
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 p-2.5 bg-primary/10 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Rendez-vous en attente</CardTitle>
                <CardDescription>
                  Prochaines visites programmées pour ce patient
                </CardDescription>
              </div>
            </div>

            <Button onClick={scheduleAppointment} className="h-9" size="sm">
              <CalendarPlus className="h-4 w-4 mr-2" />
              Planifier
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {pendingAppointments.length > 0 ? (
            <div className="space-y-4">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start space-x-4"
                >
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-md mt-1">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {format(new Date(appointment.date), "d MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                      <Badge variant="outline">Programmé</Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {format(new Date(appointment.date), "HH'h'mm", {
                        locale: fr,
                      })}
                    </p>
                    {appointment.reason && (
                      <p className="text-sm text-muted-foreground">
                        Motif : {appointment.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() =>
                  router.push(`/doctor/appointment?patientId=${patient.id}`)
                }
              >
                <span>Voir tous les rendez-vous</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 rounded-full bg-primary/10 mb-3">
                <CalendarPlus className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-2">
                Aucun rendez-vous en attente
              </p>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                Ce patient n&apos;a aucun rendez-vous programmé avec vous.
              </p>
              <Button onClick={scheduleAppointment}>
                <CalendarPlus className="h-4 w-4 mr-2" />
                Planifier un rendez-vous
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <InfoNotice icon={<Calendar size={14} />}>
        Vous pouvez rapidement planifier un nouveau rendez-vous pour ce patient
        en utilisant le bouton Planifier. Seuls les rendez-vous à venir avec le
        statut « Programmé » sont affichés ici.
      </InfoNotice>
    </div>
  );
}

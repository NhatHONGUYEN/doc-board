// src/components/PatientDashboard/UpcomingAppointments.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  CalendarPlus,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Appointment } from "@/lib/types/core-entities";
import { InfoNotice } from "@/components/InfoNotice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type UpcomingAppointmentsProps = {
  appointments: Appointment[];
};

export function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  // Traduire le statut du rendez-vous
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
    <div className="space-y-3">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
        <CardHeader className="bg-card border-b border-border">
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Prochains rendez-vous
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vos consultations médicales programmées
                </CardDescription>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Link href="/patient/appointment" className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-1" />
                Voir tout
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {appointments.length > 0 ? (
            <div className="divide-y divide-border">
              {appointments.map((apt) => (
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
                          <AvatarImage src="" alt="Médecin" />
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
                            {apt.doctor?.specialty || "Médecin généraliste"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5 text-primary/70" />
                            <span>
                              {format(new Date(apt.date), "d MMM", {
                                locale: fr,
                              })}
                            </span>
                            <span className="text-border">•</span>
                            <Clock className="h-3.5 w-3.5 text-primary/70" />
                            <span>
                              {format(new Date(apt.date), "HH'h'mm", {
                                locale: fr,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 self-start font-normal"
                      >
                        {translateStatus(apt.status)}
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
                Aucun rendez-vous à venir
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Vous n&apos;avez aucun rendez-vous programmé
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
                  Prendre un rendez-vous
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* InfoNotice en dehors de la carte */}
      <InfoNotice
        icon={<AlertCircle size={14} />}
        note="Veuillez arriver 15 minutes avant l'heure prévue de votre rendez-vous."
      >
        Cliquez sur n&apos;importe quel rendez-vous pour obtenir des
        informations détaillées. Vous pouvez consulter vos dossiers médicaux,
        mettre à jour vos informations, ou annuler si nécessaire au moins 24
        heures à l&apos;avance.
      </InfoNotice>
    </div>
  );
}

// src/components/PatientDashboard/NextAppointmentCard.tsx
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
import { Calendar, Clock, CalendarClock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Appointment, Patient } from "@/lib/types/core-entities";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type NextAppointmentCardProps = {
  appointment: Appointment;
  patient: Patient | undefined;
};

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
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
    <Card className="mb-8 overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
      <CardHeader className="bg-card border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
            <CalendarClock className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-card-foreground">
              Prochain rendez-vous
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Votre consultation médicale à venir
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src="" alt="Médecin" />
              <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                {appointment.doctor?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "D"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-1 mb-1">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  {translateStatus(appointment.status)}
                </Badge>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-primary text-sm font-medium">
                  {appointment.duration} minutes
                </span>
              </div>

              <h3 className="text-lg font-semibold text-card-foreground">
                Dr. {appointment.doctor?.user?.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {appointment.doctor?.specialty || "Médecin généraliste"}
              </p>

              <div className="flex items-center gap-1 mt-2 text-sm">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span>
                  {format(new Date(appointment.date), "EEEE d MMMM yyyy", {
                    locale: fr,
                  })}
                </span>
                <span className="text-muted-foreground mx-1">à</span>
                <Clock className="h-4 w-4 text-primary/70" />
                <span>
                  {format(new Date(appointment.date), "HH'h'mm", {
                    locale: fr,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Link
              href={`/patient/appointment/${appointment.id}`}
              className="flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Voir les détails
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

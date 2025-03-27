"use client";

import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Import French locale
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentStatus } from "@/lib/types/core-entities";
import { useAppointmentById } from "@/hooks/useAppointmentById";
import { PageHeader } from "@/components/PageHeader";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Stethoscope,
  CalendarClock,
  Info,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Helper function to get badge variant based on status
function getBadgeVariant(
  status: AppointmentStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "confirmed":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "completed":
      return "default";
    case "no-show":
      return "destructive";
    default:
      return "outline";
  }
}

// Translate appointment status to French
function translateStatus(status: string): string {
  switch (status) {
    case "confirmed":
      return "Confirmé";
    case "cancelled":
      return "Annulé";
    case "completed":
      return "Terminé";
    case "pending":
      return "En attente";
    case "no-show":
      return "Absence";
    default:
      return status;
  }
}

// Translate appointment type to French
function translateType(type: string): string {
  switch (type?.toLowerCase()) {
    case "consultation":
      return "Consultation";
    case "follow-up":
      return "Suivi";
    case "emergency":
      return "Urgence";
    case "routine":
      return "Routine";
    case "checkup":
      return "Contrôle";
    default:
      return type;
  }
}

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const appointmentId = params.id;

  const {
    data: appointment,
    isLoading,
    error,
  } = useAppointmentById(appointmentId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse">
          Chargement des détails du rendez-vous...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">Erreur</h2>
        <p>
          {error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite"}
        </p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="p-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-2">Non trouvé</h2>
        <p>
          Rendez-vous introuvable ou vous n&apos;avez pas la permission de le
          consulter
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Détails du rendez-vous"
        icon={<Calendar className="h-5 w-5 text-primary" />}
        description="Consultez les informations et détails de votre rendez-vous"
        highlightedText={
          appointment?.doctor?.user?.name
            ? {
                prefix: "avec Dr.",
                text: appointment.doctor.user.name,
              }
            : undefined
        }
      />

      <Card className="shadow-md max-w-2xl mx-auto border-primary/10 overflow-hidden">
        <CardHeader className="border-b border-primary/10 pb-3">
          <CardTitle className="flex justify-between items-center text-lg">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-primary" />
              </div>
              <span>Dr. {appointment.doctor?.user?.name}</span>
            </div>
            <Badge
              variant={getBadgeVariant(appointment.status as AppointmentStatus)}
              className="capitalize text-xs px-2.5 py-0.5"
            >
              {translateStatus(appointment.status)}
            </Badge>
          </CardTitle>
          {appointment.doctor?.specialty && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/60"></span>
              <span>Spécialité: {appointment.doctor.specialty}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="p-5">
          <div className="space-y-5">
            {/* Primary Information Section - 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <CalendarClock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Date et heure</p>
                    <p className="text-muted-foreground">
                      {format(new Date(appointment.date), "PPP", {
                        locale: fr,
                      })}{" "}
                      à{" "}
                      {format(new Date(appointment.date), "p", { locale: fr })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Durée</p>
                    <p className="text-muted-foreground">
                      {appointment.duration} minutes
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Type</p>
                    <p className="capitalize text-muted-foreground">
                      {translateType(appointment.appointmentType || "")}
                    </p>
                  </div>
                </div>

                {appointment.doctor?.officeAddress && (
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Lieu</p>
                      <p className="text-muted-foreground">
                        {appointment.doctor.officeAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-muted/10">
              {/* Reason Section */}
              <div className={appointment.reason ? "" : "hidden sm:block"}>
                {appointment.reason ? (
                  <div className="flex gap-3 h-full">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">Motif</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.reason}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Notes Section */}
              <div>
                {appointment.notes ? (
                  <div className="flex gap-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">Notes</p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Footer/Metadata Section */}
            {appointment.createdAt && (
              <div className="flex flex-col space-y-3 mt-3">
                <div className="flex justify-end text-xs text-muted-foreground  pt-3">
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex items-center gap-1"
                    >
                      <Link href="/patient/appointment">
                        <ChevronLeft className="h-4 w-4" />
                        Retour à la liste
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useState } from "react";
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
  FileText,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Appointment, AppointmentStatus } from "@/lib/types/core-entities";
import { cn } from "@/lib/utils";

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
  // Add state to control the dialog and track which appointment to show
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Handler for viewing appointment details
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  // Helper function to get badge variant based on status
  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-primary/10 text-primary border-primary/20";
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] flex flex-col h-full">
        <CardHeader className="bg-card border-b border-border p-5 pb-3">
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Rendez-vous d&apos;aujourd&apos;hui
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              asChild
              className="h-9 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Link href="/doctor/appointment" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Voir tout
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-grow overflow-auto p-0 bg-card">
          {appointments && appointments.length > 0 ? (
            <div className="divide-y divide-border">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 hover:bg-primary/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage
                          src={appointment.patient?.user?.image || ""}
                          alt="Patient"
                        />
                        <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                          {appointment.patient?.user?.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "P"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {appointment.patient?.user?.name || "Patient"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Clock size={14} className="text-primary/70" />
                          <span>
                            {new Date(appointment.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-border">•</span>
                          <span>{appointment.duration} mins</span>
                        </div>
                        {appointment.reason && (
                          <p className="text-xs mt-2 text-muted-foreground line-clamp-1 bg-muted p-2 rounded-md border border-border">
                            {appointment.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          getStatusBadgeClass(appointment.status)
                        )}
                      >
                        {appointment.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
                            disabled={updatingAppointmentId === appointment.id}
                          >
                            {updatingAppointmentId === appointment.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <MoreHorizontal size={16} />
                            )}
                            <span className="sr-only">Ouvrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-md border-border"
                        >
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(appointment)}
                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                          >
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                          >
                            <Link
                              href={`/doctor/medical-records/${appointment.patientId}`}
                            >
                              Voir dossier médical
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
                              className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            >
                              Marquer comme terminé
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
                              className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                            >
                              Annuler rendez-vous
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
            <div className="flex flex-col items-center justify-center py-12 text-center p-4">
              <div className="p-3 bg-primary/5 border border-primary/10 rounded-full mb-4">
                <CalendarIcon size={24} className="text-primary" />
              </div>
              <p className="text-card-foreground font-medium mb-1">
                Pas de rendez-vous aujourd&apos;hui
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Votre emploi du temps est libre pour la journée
              </p>
              <Button
                className="h-10 bg-primary hover:bg-primary/90 transition-all"
                asChild
              >
                <Link href="/doctor/availability" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Mettre à jour disponibilités
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md border-border bg-card">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-card-foreground">
              Détails du rendez-vous
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedAppointment &&
                new Date(selectedAppointment.date).toLocaleDateString(
                  undefined,
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-5 pt-2">
              {/* Patient information */}
              <div className="flex items-center space-x-4 pb-4 border-b border-border">
                <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                  <AvatarImage
                    src={selectedAppointment.patient?.user?.image || ""}
                    alt="Patient"
                  />
                  <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                    {selectedAppointment.patient?.user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {selectedAppointment.patient?.user?.name || "Patient"}
                  </h3>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>

              {/* Appointment details */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock size={18} className="text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Heure</p>
                    <p className="text-card-foreground">
                      {new Date(selectedAppointment.date).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      {" - "}
                      {new Date(
                        new Date(selectedAppointment.date).getTime() +
                          selectedAppointment.duration * 60000
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar size={18} className="text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="text-card-foreground">
                      {selectedAppointment.duration} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <FileText size={18} className="text-primary/70 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Motif de la visite
                    </p>
                    <p className="text-card-foreground">
                      {selectedAppointment.reason || "Non spécifié"}
                    </p>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="flex items-start p-3 bg-muted rounded-md border border-border">
                    <FileText size={18} className="text-primary/70 mr-2 mt-0" />
                    <div>
                      <p className="text-sm font-medium text-card-foreground mb-1">
                        Notes du médecin
                      </p>
                      <p className="whitespace-pre-wrap text-muted-foreground text-sm">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <User size={18} className="text-primary/70 mr-2" />
                  <div>
                    <p className="text-sm text-muted-foreground">Statut</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        getStatusBadgeClass(selectedAppointment.status)
                      )}
                    >
                      {selectedAppointment.status === "confirmed"
                        ? "Confirmé"
                        : selectedAppointment.status === "completed"
                        ? "Terminé"
                        : selectedAppointment.status === "cancelled"
                        ? "Annulé"
                        : selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <DialogFooter className="flex justify-end space-x-2 pt-4 border-t border-border mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className="h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
                >
                  Fermer
                </Button>
                <Button
                  className="h-10 bg-primary hover:bg-primary/90 transition-all"
                  asChild
                >
                  <Link
                    href={`/doctor/medical-records/${selectedAppointment.patientId}`}
                    className="flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir dossier médical
                  </Link>
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

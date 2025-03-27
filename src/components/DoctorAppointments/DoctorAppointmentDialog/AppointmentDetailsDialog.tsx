import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  User,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useAppointmentStore from "@/lib/store/useAppointmentStore";
import { cn } from "@/lib/utils";

export function AppointmentDetailsDialog() {
  const router = useRouter();
  const {
    detailsDialogOpen,
    selectedAppointment,
    closeDetailsDialog,
    openAddNotesDialog,
    openUpdateStatusDialog,
  } = useAppointmentStore();

  if (!selectedAppointment) return null;

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
    <Dialog open={detailsDialogOpen} onOpenChange={closeDetailsDialog}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/90 rounded-md flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">Détails du rendez-vous</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge
                variant="outline"
                className={cn(
                  getStatusBadgeVariant(selectedAppointment.status),
                  "capitalize text-xs px-3 py-1"
                )}
              >
                {translateStatus(selectedAppointment.status)}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  closeDetailsDialog();
                  setTimeout(
                    () => openAddNotesDialog(selectedAppointment),
                    100
                  );
                }}
                disabled={selectedAppointment.status === "cancelled"}
                className="border-border bg-card hover:bg-primary/10 hover:text-primary transition-all"
              >
                <FileText className="mr-2 h-4 w-4" />
                {selectedAppointment.notes ? "Modifier" : "Ajouter"} des notes
              </Button>
              {selectedAppointment.status !== "cancelled" &&
                selectedAppointment.status !== "completed" && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => {
                      closeDetailsDialog();
                      setTimeout(
                        () => openUpdateStatusDialog(selectedAppointment),
                        100
                      );
                    }}
                    className="bg-primary hover:bg-primary/90 transition-all"
                  >
                    Mettre à jour le statut
                  </Button>
                )}
            </div>
          </div>

          <div className="space-y-4 rounded-lg border bg-card/50 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="text-sm font-medium text-card-foreground">
                  {selectedAppointment.patient?.user?.name || "Patient inconnu"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-card-foreground">
                  {new Date(selectedAppointment.date).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
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
                  {new Date(selectedAppointment.date).toLocaleTimeString(
                    "fr-FR",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                  {" à "}
                  {new Date(
                    new Date(selectedAppointment.date).getTime() +
                      selectedAppointment.duration * 60000
                  ).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  Durée : {selectedAppointment.duration} minutes
                </p>
              </div>
            </div>
          </div>

          {selectedAppointment.reason && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                  <ClipboardList className="h-3 w-3 text-primary" />
                </div>
                <span className="text-card-foreground">Motif de la visite</span>
              </h4>
              <div className="bg-card/50 border p-3 rounded-md text-sm text-card-foreground">
                {selectedAppointment.reason}
              </div>
            </div>
          )}

          {selectedAppointment.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                  <FileText className="h-3 w-3 text-primary" />
                </div>
                <span className="text-card-foreground">Notes cliniques</span>
              </h4>
              <div
                className="bg-card/50 border p-3 rounded-md text-sm text-card-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {selectedAppointment.notes}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              closeDetailsDialog();
              if (selectedAppointment.patient?.id) {
                router.push(
                  `/doctor/medical-records/${selectedAppointment.patient.id}`
                );
              }
            }}
            className="border-border bg-card hover:bg-primary/10 hover:text-primary transition-all"
          >
            <FileText className="mr-2 h-4 w-4" />
            Voir le dossier patient
          </Button>
          <Button
            variant="default"
            onClick={closeDetailsDialog}
            className="bg-primary hover:bg-primary/90 transition-all"
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

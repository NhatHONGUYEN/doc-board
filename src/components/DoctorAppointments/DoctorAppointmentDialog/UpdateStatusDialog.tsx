import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  ClipboardCheck,
  User,
} from "lucide-react";
import useAppointmentStore from "@/lib/store/useAppointmentStore";
import { Label } from "@/components/ui/label";

type UpdateStatusDialogProps = {
  onSuccessfulUpdate: () => Promise<void>;
};

export function UpdateStatusDialog({
  onSuccessfulUpdate,
}: UpdateStatusDialogProps) {
  const {
    updateStatusDialogOpen,
    selectedAppointment,
    closeUpdateStatusDialog,
    newStatus,
    setNewStatus,
    isUpdatingStatus,
    updateAppointmentStatus,
  } = useAppointmentStore();

  const handleUpdateStatus = async () => {
    const success = await updateAppointmentStatus();
    if (success) {
      await onSuccessfulUpdate();
    }
  };

  if (!selectedAppointment) return null;

  return (
    <Dialog
      open={updateStatusDialogOpen}
      onOpenChange={closeUpdateStatusDialog}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/90 rounded-md flex items-center justify-center">
              <ClipboardCheck className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">
              Modifier le statut du rendez-vous
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Changez le statut de ce rendez-vous.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-4 rounded-lg border bg-card/50 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {selectedAppointment.patient?.user?.name ||
                      "Patient inconnu"}
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
                      undefined,
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
                    {new Date(selectedAppointment.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {" à "}
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
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="flex items-center text-sm font-medium"
              >
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                  <CheckCircle className="h-3 w-3 text-primary" />
                </div>
                <span className="text-card-foreground">Nouveau statut</span>
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger id="status" className="border-border bg-card">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmé</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                  <SelectItem value="no-show">Absence</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeUpdateStatusDialog}
            className="border-border bg-card hover:bg-muted-foreground/10"
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={isUpdatingStatus}
            className="bg-primary hover:bg-primary/90 transition-all"
          >
            {isUpdatingStatus ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Mise à jour...
              </>
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

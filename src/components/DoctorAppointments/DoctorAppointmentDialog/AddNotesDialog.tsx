import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, User, FileText, Clock } from "lucide-react";
import useAppointmentStore from "@/lib/store/useAppointmentStore";

type AddNotesDialogProps = {
  onSuccessfulSave: () => Promise<void>;
};

export function AddNotesDialog({ onSuccessfulSave }: AddNotesDialogProps) {
  const {
    addNotesDialogOpen,
    selectedAppointment,
    closeAddNotesDialog,
    notes,
    setNotes,
    isSavingNotes,
    addNotes,
  } = useAppointmentStore();

  const handleAddNotes = async () => {
    const success = await addNotes();
    if (success) {
      await onSuccessfulSave();
    }
  };

  if (!selectedAppointment) return null;

  return (
    <Dialog open={addNotesDialogOpen} onOpenChange={closeAddNotesDialog}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/90 rounded-md flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">Notes Cliniques</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Ajoutez ou modifiez les notes cliniques pour ce rendez-vous.
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
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notes"
                className="text-sm font-medium flex items-center"
              >
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                  <FileText className="h-3 w-3 text-primary" />
                </div>
                <span className="text-card-foreground">Notes</span>
              </label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Entrez ici les observations cliniques, diagnostics et plans de traitement..."
                className="min-h-[200px] font-mono text-sm border-border bg-card"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={closeAddNotesDialog}
            className="border-border bg-card hover:bg-muted-foreground/10"
          >
            Annuler
          </Button>
          <Button
            onClick={handleAddNotes}
            disabled={isSavingNotes}
            className="bg-primary hover:bg-primary/90 transition-all"
          >
            {isSavingNotes ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

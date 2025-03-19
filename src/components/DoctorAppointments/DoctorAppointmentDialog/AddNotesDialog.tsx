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
import { Calendar as CalendarIcon, Loader2, User } from "lucide-react";
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clinical Notes</DialogTitle>
          <DialogDescription>
            Add or edit notes for this appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{selectedAppointment.patient?.user?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {new Date(selectedAppointment.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter clinical notes here..."
              className="min-h-32"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeAddNotesDialog}>
            Cancel
          </Button>
          <Button onClick={handleAddNotes} disabled={isSavingNotes}>
            {isSavingNotes && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSavingNotes ? "Saving..." : "Save Notes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

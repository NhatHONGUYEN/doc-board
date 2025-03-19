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
import { Calendar as CalendarIcon, Clock, Loader2, User } from "lucide-react";
import useAppointmentStore from "@/lib/store/useAppointmentStore";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Appointment Status</DialogTitle>
          <DialogDescription>
            Change the status of this appointment.
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
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(selectedAppointment.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>

            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={closeUpdateStatusDialog}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} disabled={isUpdatingStatus}>
            {isUpdatingStatus && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isUpdatingStatus ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

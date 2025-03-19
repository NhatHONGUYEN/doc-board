import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, FileText, User } from "lucide-react";
import { useRouter } from "next/navigation";
import useAppointmentStore from "@/lib/store/useAppointmentStore";

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

  return (
    <Dialog open={detailsDialogOpen} onOpenChange={closeDetailsDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <Badge
                variant={
                  selectedAppointment.status === "confirmed"
                    ? "default"
                    : selectedAppointment.status === "cancelled"
                    ? "destructive"
                    : selectedAppointment.status === "completed"
                    ? "outline"
                    : "secondary"
                }
              >
                {selectedAppointment.status}
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
              >
                <FileText className="mr-2 h-4 w-4" />
                {selectedAppointment.notes ? "Edit" : "Add"} Notes
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
                  >
                    Update Status
                  </Button>
                )}
            </div>
          </div>

          <div className="grid grid-cols-[20px_1fr] gap-x-4 gap-y-3 items-start">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                {selectedAppointment.patient?.user?.name || "Patient"}
              </p>
            </div>

            <CalendarIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
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

            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">
                {new Date(selectedAppointment.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" to "}
                {new Date(
                  new Date(selectedAppointment.date).getTime() +
                    selectedAppointment.duration * 60000
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-muted-foreground">
                Duration: {selectedAppointment.duration} minutes
              </p>
            </div>

            {selectedAppointment.reason && (
              <>
                <div className="col-span-2 mt-2">
                  <h4 className="font-medium text-sm">Reason for Visit</h4>
                </div>
                <div className="col-span-2 bg-muted p-3 rounded text-sm">
                  {selectedAppointment.reason}
                </div>
              </>
            )}

            {selectedAppointment.notes && (
              <>
                <div className="col-span-2 mt-2">
                  <h4 className="font-medium text-sm">Clinical Notes</h4>
                </div>
                <div className="col-span-2 bg-muted p-3 rounded text-sm">
                  {selectedAppointment.notes}
                </div>
              </>
            )}
          </div>

          <div className="pt-2 flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                closeDetailsDialog();
                if (selectedAppointment.patientId) {
                  router.push(
                    `/doctor/medical-records/${selectedAppointment.patientId}`
                  );
                }
              }}
            >
              View Patient Record
            </Button>
            <Button variant="default" onClick={closeDetailsDialog}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

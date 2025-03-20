// src/components/MedicalRecords/RecordDetailDialog.tsx
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { User, FileText, PlusSquare, Calendar, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientRecord } from "@/lib/types/medical-records";

type RecordDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord | null;
  isEditing: boolean;
  editableNotes: string;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onNotesChange: (notes: string) => void;
};

export default function RecordDetailDialog({
  isOpen,
  onClose,
  patient,
  isEditing,
  editableNotes,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onNotesChange,
}: RecordDetailDialogProps) {
  const router = useRouter();

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 mr-2" />
            <span>Medical Record: {patient.user.name}</span>
          </DialogTitle>
          <DialogDescription>
            View and update patient medical history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="record">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="record">Medical History</TabsTrigger>
            <TabsTrigger value="info">Patient Info</TabsTrigger>
          </TabsList>

          {/* Medical Record Tab */}
          <TabsContent value="record" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Medical History
              </h3>
              {!isEditing ? (
                <Button onClick={onEdit}>Edit Record</Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button onClick={onSave} disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <Textarea
                value={editableNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Enter medical history, conditions, allergies, medications, etc."
              />
            ) : (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                {patient.medicalHistory ? (
                  <div style={{ whiteSpace: "pre-line" }}>
                    {patient.medicalHistory}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <PlusSquare className="h-12 w-12 mb-2" />
                    <p>No medical history recorded for this patient</p>
                    <Button variant="outline" className="mt-4" onClick={onEdit}>
                      Add Medical Record
                    </Button>
                  </div>
                )}
              </ScrollArea>
            )}
          </TabsContent>

          {/* Patient Info Tab */}
          <TabsContent value="info">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={patient.user.image || undefined} />
                  <AvatarFallback className="text-lg">
                    {(patient.user?.name ?? "Unknown User")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{patient.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {patient.user.email}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Patient info section */}
                <div>
                  <h4 className="font-medium mb-2">Personal Information</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Birth Date
                      </p>
                      <p>
                        {patient.birthDate
                          ? format(new Date(patient.birthDate), "MMMM d, yyyy")
                          : "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p>{patient.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Social Security
                      </p>
                      <p>{patient.socialSecurityNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p>{patient.address || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Appointments section */}
                <div>
                  <h4 className="font-medium mb-2">Recent Appointments</h4>
                  {patient.appointments.length > 0 ? (
                    <div className="space-y-2">
                      {patient.appointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center p-2 rounded-md border"
                        >
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>
                            {format(new Date(appointment.date), "MMMM d, yyyy")}{" "}
                            at {format(new Date(appointment.date), "h:mm a")}
                          </span>
                        </div>
                      ))}
                      {patient.appointments.length > 3 && (
                        <p className="text-sm text-muted-foreground">
                          and {patient.appointments.length - 3} more
                          appointments
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No appointments found
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      router.push(
                        `/doctor/appointment/new?patientId=${patient.id}`
                      )
                    }
                  >
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

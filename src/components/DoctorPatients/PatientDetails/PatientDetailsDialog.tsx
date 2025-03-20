import { Patient } from "@/lib/types/core-entities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PersonalInfoTab } from "./PersonalInfoTab";
import { AppointmentsTab } from "./AppointmentsTab";
import { MedicalHistoryTab } from "./MedicalHistoryTab";

type PatientDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onScheduleAppointment: (patientId: string) => void;
};

export function PatientDetailsDialog({
  isOpen,
  onOpenChange,
  patient,
  onScheduleAppointment,
}: PatientDetailsDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Patient Details: {patient.user.name}</span>
          </DialogTitle>
          <DialogDescription>
            Complete patient information and medical history
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
          </TabsList>

          {/* Tabs content */}
          <PersonalInfoTab patient={patient} />
          <AppointmentsTab
            patient={patient}
            onScheduleAppointment={onScheduleAppointment}
          />
          <MedicalHistoryTab patient={patient} />
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onScheduleAppointment(patient.id)}>
            Schedule Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

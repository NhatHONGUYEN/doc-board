import { Patient } from "@/lib/types/core-entities";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PersonalInfoTab } from "./PersonalInfoTab";
import { AppointmentsTab } from "./AppointmentsTab";
import { MedicalHistoryTab } from "./MedicalHistoryTab";
import { User, Calendar, FileText } from "lucide-react";

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
          <DialogTitle className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary/90 rounded-md flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">
              Détails du patient : {patient.user.name}
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Informations complètes et historique médical du patient
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Infos personnelles
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="medical" className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Historique médical
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <PersonalInfoTab patient={patient} />
          <AppointmentsTab
            patient={patient}
            onScheduleAppointment={onScheduleAppointment}
          />
          <MedicalHistoryTab patient={patient} />
        </Tabs>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border bg-card hover:bg-muted-foreground/10"
          >
            Fermer
          </Button>
          <Button
            onClick={() => onScheduleAppointment(patient.id)}
            className="bg-primary hover:bg-primary/90 transition-all flex items-center gap-1.5"
          >
            <Calendar className="h-4 w-4" />
            Planifier un rendez-vous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

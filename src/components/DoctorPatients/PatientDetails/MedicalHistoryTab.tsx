import { FileText } from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { TabsContent } from "@/components/ui/tabs";

type MedicalHistoryTabProps = {
  patient: Patient;
};

export function MedicalHistoryTab({ patient }: MedicalHistoryTabProps) {
  return (
    <TabsContent value="medical">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Medical History</h3>
          </div>
          {patient.medicalHistory ? (
            <div className="p-4 rounded-lg bg-muted">
              <p style={{ whiteSpace: "pre-line" }}>{patient.medicalHistory}</p>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted text-center">
              <p className="text-muted-foreground italic">
                No medical history recorded
              </p>
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
}

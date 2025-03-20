// src/components/PatientRecords/MedicalHistoryCard.tsx
import { FileText, Edit, Save, X, PlusSquare, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientRecord } from "@/lib/types/medical-records";

type MedicalHistoryCardProps = {
  patient: PatientRecord;
  isEditing: boolean;
  editableNotes: string;
  isSaving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onNotesChange: (notes: string) => void;
};

export function MedicalHistoryCard({
  patient,
  isEditing,
  editableNotes,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onNotesChange,
}: MedicalHistoryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Medical History
            </CardTitle>
            <CardDescription>
              Patient&apos;s medical background and conditions
            </CardDescription>
          </div>

          {!isEditing ? (
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Record
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={editableNotes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="min-h-[300px] font-mono"
            placeholder="Enter medical history details such as:

ALLERGIES:
• List allergies and reactions

MEDICATIONS:
• Current medications and dosages

PAST MEDICAL HISTORY:
• Chronic conditions
• Previous surgeries
• Significant illnesses

FAMILY HISTORY:
• Relevant family medical conditions

NOTES:
• Additional observations or concerns"
          />
        ) : (
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {patient.medicalHistory ? (
              <div className="whitespace-pre-wrap">
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
      </CardContent>
    </Card>
  );
}

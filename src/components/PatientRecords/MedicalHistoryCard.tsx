// src/components/PatientRecords/MedicalHistoryCard.tsx
import {
  FileText,
  Edit,
  Save,
  X,
  PlusSquare,
  Loader2,
  AlertTriangle,
} from "lucide-react";
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
import { InfoNotice } from "@/components/InfoNotice";

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
    <div className="space-y-3">
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-3 p-2.5 bg-primary/10 rounded-full">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Historique médical</CardTitle>
                <CardDescription>
                  Antécédents médicaux et pathologies du patient
                </CardDescription>
              </div>
            </div>

            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border hover:bg-muted transition-colors"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-border hover:bg-muted transition-colors"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  size="sm"
                  className="h-9"
                  onClick={onSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Enregistrer
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
              className="min-h-40 font-mono"
              placeholder="ALLERGIES :
• Allergies aux médicaments, aliments ou environnementales

MÉDICAMENTS :
• Médicaments actuels et posologies

ANTÉCÉDENTS MÉDICAUX :
• Maladies chroniques
• Interventions chirurgicales antérieures

ANTÉCÉDENTS FAMILIAUX :
• Pathologies héréditaires significatives

NOTES :
• Observations supplémentaires"
            />
          ) : (
            <ScrollArea className="h-40 rounded-md border p-4">
              {patient.medicalHistory ? (
                <div className="whitespace-pre-wrap">
                  {patient.medicalHistory}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 h-full text-muted-foreground">
                  <div className="p-3 rounded-full bg-primary/10 mb-3">
                    <PlusSquare className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-2">
                    Aucun historique médical enregistré
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                    Ajoutez des informations d&apos;historique médical pour
                    aider à suivre les pathologies et traitements de ce patient.
                  </p>
                  <Button onClick={onEdit}>
                    <PlusSquare className="h-4 w-4 mr-2" />
                    Ajouter un dossier médical
                  </Button>
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* InfoNotice placée en dehors de la Card */}
      <InfoNotice icon={<AlertTriangle size={14} />}>
        Les informations d&apos;historique médical sont essentielles pour un
        diagnostic et un traitement appropriés. Maintenez cette section à jour
        avec toutes les pathologies et allergies pertinentes du patient.
      </InfoNotice>
    </div>
  );
}

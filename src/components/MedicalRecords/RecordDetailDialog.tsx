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
            <div className="w-7 h-7 bg-primary/90 rounded-md flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">
              Dossier médical : {patient.user.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Consulter et mettre à jour l&apos;historique médical du patient
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="record">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="record">Historique médical</TabsTrigger>
            <TabsTrigger value="info">Infos patient</TabsTrigger>
          </TabsList>

          {/* Onglet Historique médical */}
          <TabsContent value="record" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-card-foreground">
                  Antécédents médicaux
                </span>
              </h3>
              {!isEditing ? (
                <Button onClick={onEdit}>Modifier le dossier</Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={onCancel}>
                    Annuler
                  </Button>
                  <Button onClick={onSave} disabled={isSaving}>
                    {isSaving && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>

            {isEditing ? (
              <Textarea
                value={editableNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Saisissez l'historique médical, les pathologies, allergies, médicaments, etc."
              />
            ) : (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                {patient.medicalHistory ? (
                  <div className="text-sm" style={{ whiteSpace: "pre-line" }}>
                    {patient.medicalHistory}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-muted-foreground">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <PlusSquare className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium">
                      Aucun antécédent médical enregistré pour ce patient
                    </p>
                    <Button variant="outline" className="mt-4" onClick={onEdit}>
                      Ajouter un dossier médical
                    </Button>
                  </div>
                )}
              </ScrollArea>
            )}
          </TabsContent>

          {/* Onglet Infos patient */}
          <TabsContent value="info">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-md">
                  <AvatarImage src={patient.user.image || undefined} />
                  <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                    {(patient.user?.name ?? "Utilisateur inconnu")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {patient.user.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {patient.user.email}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Section infos patient */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-card-foreground">
                      Informations personnelles
                    </span>
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Date de naissance
                      </p>
                      <p className="text-sm font-medium text-card-foreground">
                        {patient.birthDate ? (
                          format(new Date(patient.birthDate), "d MMMM yyyy")
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            Non renseignée
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-medium text-card-foreground">
                        {patient.phone || (
                          <span className="text-muted-foreground italic text-xs">
                            Non renseigné
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Numéro de sécurité sociale
                      </p>
                      <p className="text-sm font-medium text-card-foreground">
                        {patient.socialSecurityNumber || (
                          <span className="text-muted-foreground italic text-xs">
                            Non renseigné
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Adresse</p>
                      <p className="text-sm font-medium text-card-foreground">
                        {patient.address || (
                          <span className="text-muted-foreground italic text-xs">
                            Non renseignée
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section rendez-vous */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                      <Calendar className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-card-foreground">
                      Rendez-vous récents
                    </span>
                  </h4>
                  {patient.appointments.length > 0 ? (
                    <div className="space-y-2">
                      {patient.appointments.slice(0, 3).map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center p-2 rounded-md border text-sm"
                        >
                          <div className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center mr-2">
                            <Calendar className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-card-foreground">
                            {format(new Date(appointment.date), "d MMMM yyyy")}{" "}
                            à {format(new Date(appointment.date), "HH:mm")}
                          </span>
                        </div>
                      ))}
                      {patient.appointments.length > 3 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          et {patient.appointments.length - 3} autres
                          rendez-vous
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Aucun rendez-vous trouvé
                    </p>
                  )}

                  <Button
                    variant="outline"
                    className="mt-4 bg-card hover:bg-primary/10 hover:text-primary transition-all"
                    onClick={() =>
                      router.push(
                        `/doctor/appointment/new?patientId=${patient.id}`
                      )
                    }
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier un rendez-vous
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

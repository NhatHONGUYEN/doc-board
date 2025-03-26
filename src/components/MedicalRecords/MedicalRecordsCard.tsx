// src/components/MedicalRecords/MedicalRecordsCard.tsx
import { Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PatientRecord } from "@/lib/types/medical-records";
import PatientCard from "./PatientCard";
import { SearchHeader } from "../Search-header";
import { InfoNotice } from "@/components/InfoNotice";

type MedicalRecordsCardProps = {
  patients: PatientRecord[];
  filteredPatients: PatientRecord[];
  searchTerm: string;
  isLoading: boolean;
  isError: boolean;
  setSearchTerm: (term: string) => void;
  onViewRecord: (patient: PatientRecord) => void;
};

export default function MedicalRecordsCard({
  patients,
  filteredPatients,
  searchTerm,
  isLoading,
  isError,
  setSearchTerm,
  onViewRecord,
}: MedicalRecordsCardProps) {
  return (
    <div className="space-y-3">
      <Card>
        <SearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          label="Rechercher des dossiers"
          placeholder="Rechercher par nom de patient, condition, ou date du dossier..."
          id="patient-records-search"
        />

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Échec du chargement des dossiers médicaux
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "Aucun dossier ne correspond à votre recherche."
                : "Aucun dossier médical de patient trouvé."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onViewRecord={onViewRecord}
                />
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Affichage de {filteredPatients.length} sur {patients.length}{" "}
            patients
          </p>
        </CardFooter>
      </Card>

      {/* InfoNotice added outside the Card */}
      <InfoNotice
        icon={<FileText size={14} />}
        note="Les données des patients sont confidentielles et protégées par la réglementation sur la protection des données de santé."
      >
        Les dossiers médicaux ne doivent être consultés qu&apos;à des fins
        cliniques légitimes. Tous les accès aux dossiers des patients sont
        enregistrés et surveillés à des fins de conformité aux réglementations
        en vigueur.
      </InfoNotice>
    </div>
  );
}

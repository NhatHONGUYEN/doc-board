// src/components/MedicalRecords/MedicalRecordsCard.tsx
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { PatientRecord } from "@/lib/types/medical-records";
import PatientCard from "./PatientCard";
import { SearchHeader } from "../Search-header";

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
    <Card>
      <SearchHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        label="Search Records"
        placeholder="Search by patient name, condition, or record date..."
        id="patient-records-search"
      />

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-destructive">
            Failed to load patient records
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm
              ? "No records match your search."
              : "No patient medical records found."}
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
          Showing {filteredPatients.length} of {patients.length} patients
        </p>
      </CardFooter>
    </Card>
  );
}

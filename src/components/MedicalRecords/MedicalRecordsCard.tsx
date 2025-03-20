// src/components/MedicalRecords/MedicalRecordsCard.tsx
import { Loader2, Search, FilterX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientRecord } from "@/lib/types/medical-records";
import PatientCard from "./PatientCard";

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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Medical Records</CardTitle>
            <CardDescription>
              View and manage patient medical histories
            </CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search records..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1"
                onClick={() => setSearchTerm("")}
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

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

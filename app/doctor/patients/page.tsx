"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import your components
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Users, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { toast } from "sonner";

// Import types from core-entities
import { Patient } from "@/lib/types/core-entities";
import { usePatients } from "@/hooks/usePatients";
import { usePatientsStore } from "@/lib/store/usePatientsStore";

// Import custom components
import { PatientHeader } from "@/components/DoctorPatients/PatientHeader";
import { PatientContent } from "@/components/DoctorPatients/PatientContent";
import { PatientDetailsDialog } from "@/components/DoctorPatients/PatientDetails/PatientDetailsDialog";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { InfoNotice } from "@/components/InfoNotice";

export default function DoctorPatientsPage() {
  const router = useRouter();

  // Patient data from API
  const {
    data: patients = [],
    isLoading: isLoadingPatients,
    isError,
    error,
  } = usePatients();

  // Get state and actions from Zustand store
  const {
    filteredPatients,
    searchTerm,
    sortConfig,
    setSearchTerm,
    setSortConfig,
    updateFilteredPatients,
  } = usePatientsStore();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Show error message if query fails
  useEffect(() => {
    if (isError && error instanceof Error) {
      console.error(error);
      toast.error(`Échec du chargement des patients : ${error.message}`);
    }
  }, [isError, error]);

  // Update filtered patients when data, search, or sort changes
  useEffect(() => {
    if (patients && patients.length > 0) {
      updateFilteredPatients(patients);
    }
  }, [patients, searchTerm, sortConfig, updateFilteredPatients]);

  // Simplified handler functions
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key: string) => {
    setSortConfig(key as typeof sortConfig.key);
  };

  // View patient details
  const viewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  // Schedule appointment for patient
  const scheduleAppointment = (patientId: string) => {
    router.push(`/doctor/appointment/new?patientId=${patientId}`);
  };

  return (
    <RoleAuthCheck allowedRoles="DOCTOR">
      <div className="container py-10">
        {/* Replace simple heading with PageHeader */}
        <PageHeader
          title="Mes Patients"
          icon={<Users className="h-5 w-5 text-primary" />}
          description="Consultez et gérez tous les patients sous votre responsabilité. Recherchez, filtrez ou sélectionnez un patient pour voir son historique médical complet."
          actions={
            <Button asChild>
              <Link href="/doctor/patients/add" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un Patient
              </Link>
            </Button>
          }
        />

        <Card className="mb-8">
          <PatientHeader searchTerm={searchTerm} handleSearch={handleSearch} />
          <PatientContent
            isLoading={isLoadingPatients}
            isError={isError}
            searchTerm={searchTerm}
            patients={patients}
            filteredPatients={filteredPatients}
            sortConfig={sortConfig}
            handleSort={handleSort}
            viewPatientDetails={viewPatientDetails}
            scheduleAppointment={scheduleAppointment}
          />
        </Card>

        {/* InfoNotice with note removed */}
        <div className="mt-6">
          <InfoNotice icon={<FileText size={14} />}>
            Ce tableau affiche tous les patients sous votre responsabilité. Vous
            pouvez trier la liste en cliquant sur les en-têtes de colonnes et
            filtrer les patients à l&apos;aide de la barre de recherche.
            Utilisez les boutons d&apos;action pour consulter les détails ou
            planifier des rendez-vous. Cliquez sur l&apos;
            <span className="text-blue-200">icône utilisateur</span> pour voir
            les détails du patient ou sur l&apos;
            <span className="text-blue-200">icône calendrier</span> pour
            planifier directement un rendez-vous.
          </InfoNotice>
        </div>

        {/* Use our PatientDetailsDialog component */}
        <PatientDetailsDialog
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          patient={selectedPatient}
          onScheduleAppointment={scheduleAppointment}
        />
      </div>
    </RoleAuthCheck>
  );
}

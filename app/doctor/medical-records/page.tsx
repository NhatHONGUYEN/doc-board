"use client";

import { useEffect } from "react";
import { Loader2, FileText } from "lucide-react";
import useSessionStore from "@/lib/store/useSessionStore";
import { useMedicalRecordsListStore } from "@/hooks/useMedicalRecordsListStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { PageHeader } from "@/components/PageHeader";

// Import our components
import MedicalRecordsCard from "@/components/MedicalRecords/MedicalRecordsCard";
import RecordDetailDialog from "@/components/MedicalRecords/RecordDetailDialog";

export default function MedicalRecordsPage() {
  const { session, status } = useSessionStore();

  // Utiliser le store Zustand amélioré
  const {
    patients,
    filteredPatients,
    selectedPatient,
    isLoading,
    isError,
    isEditing,
    editableNotes,
    isSaving,
    isDetailOpen,
    searchTerm,
    fetchPatients,
    setSearchTerm,
    viewPatientRecord,
    closePatientRecord,
    startEditing,
    cancelEditing,
    setEditableNotes,
    updateMedicalRecord,
    resetStore,
    initialLoadAttempted,
  } = useMedicalRecordsListStore();

  // Récupérer les patients au montage du composant - maintenant avec mise en cache !
  useEffect(() => {
    if (session?.user?.id) {
      fetchPatients(session.user.id);
    }

    // Retourner une fonction de nettoyage pour réinitialiser le store lors du démontage
    return () => resetStore();
  }, [session?.user?.id, fetchPatients, resetStore]);

  // Composant de chargement personnalisé
  const loadingComponent = (
    <div className="container py-10">
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );

  // Afficher l'état de chargement uniquement si :
  // 1. Nous n'avons pas encore tenté de charger les données, OU
  // 2. Nous chargeons ET il n'y a pas de données existantes à afficher
  const showLoading =
    !initialLoadAttempted || (isLoading && patients.length === 0);

  return (
    <RoleAuthCheck
      allowedRoles="DOCTOR"
      loadingComponent={status === "loading" ? loadingComponent : undefined}
    >
      <div className="container py-10">
        <PageHeader
          title="Dossiers Médicaux des Patients"
          icon={<FileText className="h-5 w-5 text-primary" />}
          description="Consultez et gérez les dossiers médicaux, l'historique et les notes de traitement de vos patients."
        />

        <MedicalRecordsCard
          patients={patients}
          filteredPatients={filteredPatients}
          searchTerm={searchTerm}
          isLoading={showLoading} // Utiliser notre logique de chargement intelligente
          isError={isError}
          setSearchTerm={setSearchTerm}
          onViewRecord={viewPatientRecord}
        />

        <RecordDetailDialog
          isOpen={isDetailOpen}
          onClose={closePatientRecord}
          patient={selectedPatient}
          isEditing={isEditing}
          editableNotes={editableNotes}
          isSaving={isSaving}
          onEdit={startEditing}
          onCancel={cancelEditing}
          onSave={updateMedicalRecord}
          onNotesChange={setEditableNotes}
        />
      </div>
    </RoleAuthCheck>
  );
}

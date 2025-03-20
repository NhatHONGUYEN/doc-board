"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSessionStore from "@/lib/store/useSessionStore";
import { useMedicalRecordsListStore } from "@/hooks/useMedicalRecordsListStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";

// Import our components
import MedicalRecordsCard from "@/components/MedicalRecords/MedicalRecordsCard";
import RecordDetailDialog from "@/components/MedicalRecords/RecordDetailDialog";

export default function MedicalRecordsPage() {
  const { session, status } = useSessionStore();

  // Use the Zustand store
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
  } = useMedicalRecordsListStore();

  // Fetch patients when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      fetchPatients(session.user.id);
    }

    // Return a cleanup function to reset the store when unmounting
    return () => useMedicalRecordsListStore.getState().resetStore();
  }, [session?.user?.id, fetchPatients]);

  // Custom loading component
  const loadingComponent = (
    <div className="container py-10">
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );

  return (
    <RoleAuthCheck
      allowedRoles="DOCTOR"
      loadingComponent={status === "loading" ? loadingComponent : undefined}
    >
      <div className="container py-10">
        {/* Keep the page header simple and in the main component */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Patient Medical Records</h1>
        </div>

        <MedicalRecordsCard
          patients={patients}
          filteredPatients={filteredPatients}
          searchTerm={searchTerm}
          isLoading={isLoading}
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

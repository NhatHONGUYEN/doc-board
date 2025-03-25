"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSessionStore from "@/lib/store/useSessionStore";
import { useMedicalRecordsListStore } from "@/hooks/useMedicalRecordsListStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { PageHeader } from "@/components/PageHeader";
import { FileText } from "lucide-react";

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
        {/* Replace the simple header with PageHeader component */}
        <PageHeader
          title="Patient Medical Records"
          icon={<FileText className="h-5 w-5 text-primary" />}
          description="View and manage your patients' medical records, history, and treatment notes."
        />

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

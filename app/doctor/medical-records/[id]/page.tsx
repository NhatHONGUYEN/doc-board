// app/doctor/medical-records/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSessionStore from "@/lib/store/useSessionStore";
import { useMedicalRecordsStore } from "@/lib/store/useMedicalRecordsStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { PatientNotFound } from "@/components/PatientRecords/PatientNotFound";
import { PatientInfoCard } from "@/components/PatientRecords/PatientInfoCard";
import { MedicalHistoryCard } from "@/components/PatientRecords/MedicalHistoryCard";
import { PageHeader } from "@/components/PageHeader";
import { useDebounce } from "@/hooks/useDebounce";
import { Loading } from "@/components/Loading";

export default function PatientMedicalRecordsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const router = useRouter();
  const { session } = useSessionStore();

  // State to track if we've completed the initial loading attempt
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Get store state and actions
  const {
    patient,
    isLoading,
    isError,
    error,
    isEditing,
    editableNotes,
    isSaving,
    fetchPatientRecord,
    updateMedicalHistory,
    setIsEditing,
    setEditableNotes,
    resetStore,
  } = useMedicalRecordsStore();

  // Debounce the "no patient" state to avoid flashing PatientNotFound
  const shouldShowNotFound = useDebounce(!patient && initialLoadComplete, 1500);

  // Fetch patient data when component mounts
  useEffect(() => {
    let isMounted = true;

    if (session?.user?.id) {
      fetchPatientRecord(patientId, session.user.id).finally(() => {
        // Mark initial load as complete after fetch completes (success or error)
        if (isMounted) {
          setInitialLoadComplete(true);
        }
      });
    }

    // Reset store when component unmounts
    return () => {
      isMounted = false;
      resetStore();
      setInitialLoadComplete(false);
    };
  }, [patientId, session?.user?.id, fetchPatientRecord, resetStore]);

  // Display error toast if query fails
  useEffect(() => {
    if (isError && error) {
      toast.error(`Error: ${error.message}`);
    }
  }, [isError, error]);

  // Handle medical history actions
  const handleEdit = () => {
    setEditableNotes(patient?.medicalHistory || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditableNotes(patient?.medicalHistory || "");
    setIsEditing(false);
  };

  const handleSave = () => {
    if (patient) {
      updateMedicalHistory(patientId, editableNotes).then(() =>
        toast.success("Medical record updated successfully")
      );
    }
  };

  // Custom loading component with more details
  const loadingComponent = <Loading />;

  // Determine if we should show loading
  const showLoading = isLoading || !initialLoadComplete;

  return (
    <RoleAuthCheck
      allowedRoles="DOCTOR"
      loadingComponent={showLoading ? loadingComponent : undefined}
    >
      {shouldShowNotFound ? (
        <PatientNotFound />
      ) : patient ? (
        <div className="container py-10">
          <PageHeader
            title="Patient Medical Records"
            icon={<ClipboardList className="h-5 w-5 text-primary" />}
            description={`View and manage medical history for ${patient.user.name}`}
            actions={
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            }
          />

          <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
            {/* Patient Information */}
            <div className="h-full flex flex-col">
              <PatientInfoCard patient={patient} />
            </div>

            {/* Medical History */}
            <div className="md:col-span-2 h-full flex flex-col">
              <MedicalHistoryCard
                patient={patient}
                isEditing={isEditing}
                editableNotes={editableNotes}
                isSaving={isSaving}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSave={handleSave}
                onNotesChange={setEditableNotes}
              />
            </div>
          </div>
        </div>
      ) : null}
    </RoleAuthCheck>
  );
}

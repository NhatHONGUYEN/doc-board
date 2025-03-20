// app/doctor/medical-records/[id]/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import useSessionStore from "@/lib/store/useSessionStore";
import { useMedicalRecordsStore } from "@/lib/store/useMedicalRecordsStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { PatientNotFound } from "@/components/PatientRecords/PatientNotFound";
import { PatientInfoCard } from "@/components/PatientRecords/PatientInfoCard";
import { MedicalHistoryCard } from "@/components/PatientRecords/MedicalHistoryCard";
import { AppointmentsCard } from "@/components/PatientRecords/AppointmentsCard";

export default function PatientMedicalRecordsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const router = useRouter();
  const { session } = useSessionStore();

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

  // Fetch patient data when component mounts
  useEffect(() => {
    if (session?.user?.id) {
      fetchPatientRecord(patientId, session.user.id);
    }

    // Reset store when component unmounts
    return () => resetStore();
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
      loadingComponent={isLoading ? loadingComponent : undefined}
    >
      {!patient ? (
        <PatientNotFound />
      ) : (
        <div className="container py-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Patient Medical Records</h1>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Patient Information */}
            <PatientInfoCard patient={patient} />

            {/* Medical History and Appointments */}
            <div className="md:col-span-2 space-y-6">
              {/* Medical History */}
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

              {/* Appointments */}
              <AppointmentsCard patient={patient} />
            </div>
          </div>
        </div>
      )}
    </RoleAuthCheck>
  );
}

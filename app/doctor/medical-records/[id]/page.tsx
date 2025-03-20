"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Phone,
  MapPin,
  FileText,
  ClipboardList,
  Loader2,
  Save,
  X,
  Edit,
  PlusSquare,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import useSessionStore from "@/lib/store/useSessionStore";
import { useMedicalRecordsStore } from "@/lib/store/useMedicalRecordsStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";

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
        <div className="container py-10">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
              <p>
                The requested patient record doesn&apos;t exist or you
                don&apos;t have permission to view it.
              </p>
              <Button
                className="mt-4"
                onClick={() => router.push("/doctor/dashboard")}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
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
            <Card className="md:col-span-1">
              {/* Patient card content... */}
              <CardHeader className="pb-3">
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={patient.user.image || undefined} />
                    <AvatarFallback>
                      {patient.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {patient.user.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {patient.user.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {/* Rest of patient info... */}
                  {patient.birthDate && (
                    <div className="flex gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Date of Birth
                        </p>
                        <p>
                          {format(new Date(patient.birthDate), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  )}

                  {patient.phone && (
                    <div className="flex gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{patient.phone}</p>
                      </div>
                    </div>
                  )}

                  {patient.address && (
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p>{patient.address}</p>
                      </div>
                    </div>
                  )}

                  {patient.socialSecurityNumber && (
                    <div className="flex gap-2">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">SSN</p>
                        <p>•••••{patient.socialSecurityNumber.slice(-4)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Medical History and Appointments */}
            <div className="md:col-span-2 space-y-6">
              {/* Medical History */}
              <Card>
                {/* Rest of the component... */}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Medical History
                      </CardTitle>
                      <CardDescription>
                        Patient&apos;s medical background and conditions
                      </CardDescription>
                    </div>

                    {!isEditing ? (
                      <Button
                        onClick={() => {
                          setEditableNotes(patient.medicalHistory || "");
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Record
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditableNotes(patient.medicalHistory || "");
                            setIsEditing(false);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={() =>
                            updateMedicalHistory(patientId, editableNotes).then(
                              () =>
                                toast.success(
                                  "Medical record updated successfully"
                                )
                            )
                          }
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={editableNotes}
                      onChange={(e) => setEditableNotes(e.target.value)}
                      className="min-h-[300px] font-mono"
                      placeholder="Enter medical history details such as:

ALLERGIES:
• List allergies and reactions

MEDICATIONS:
• Current medications and dosages

PAST MEDICAL HISTORY:
• Chronic conditions
• Previous surgeries
• Significant illnesses

FAMILY HISTORY:
• Relevant family medical conditions

NOTES:
• Additional observations or concerns"
                    />
                  ) : (
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      {patient.medicalHistory ? (
                        <div className="whitespace-pre-wrap">
                          {patient.medicalHistory}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <PlusSquare className="h-12 w-12 mb-2" />
                          <p>No medical history recorded for this patient</p>
                          <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setIsEditing(true)}
                          >
                            Add Medical Record
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Appointments Card - all content remains the same */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Appointments</CardTitle>
                  <CardDescription>
                    Patient&apos;s appointment history
                  </CardDescription>
                </CardHeader>
                {/* Card content - Tabs, appointments, etc. */}
                {/* ... your existing appointments code ... */}
              </Card>
            </div>
          </div>
        </div>
      )}
    </RoleAuthCheck>
  );
}

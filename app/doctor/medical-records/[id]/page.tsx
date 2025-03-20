"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Phone,
  MapPin,
  FileText,
  Clock,
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
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

import useSessionStore from "@/lib/store/useSessionStore";

type PatientRecord = {
  id: string;
  userId: string;
  birthDate: string | null;
  address: string | null;
  phone: string | null;
  socialSecurityNumber: string | null;
  medicalHistory: string | null;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  appointments: Array<{
    id: string;
    date: string;
    duration: number;
    reason: string | null;
    notes: string | null;
    status: string;
    appointmentType: string | null;
  }>;
};

export default function PatientMedicalRecordsPage() {
  const params = useParams();
  const patientId = params.id as string;
  const router = useRouter();
  const { session, status: sessionStatus } = useSessionStore();

  const [patient, setPatient] = useState<PatientRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Medical history editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editableNotes, setEditableNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchPatientRecords = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/patients/${patientId}/records`);

        if (!response.ok) {
          throw new Error("Failed to fetch patient records");
        }

        const data = await response.json();
        setPatient(data);
        setEditableNotes(data.medicalHistory || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to load patient records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientRecords();
  }, [patientId, session?.user?.id]);

  // Update medical record
  const updateMedicalRecord = async () => {
    if (!patient) return;

    setIsSaving(true);
    try {
      // First get the full patient data
      const patientResponse = await fetch(
        `/api/patient?userId=${patient.userId}`
      );

      if (!patientResponse.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const patientData = await patientResponse.json();

      // Then update with the new medical history
      const response = await fetch(`/api/patient?userId=${patient.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...patientData,
          medicalHistory: editableNotes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update medical record");
      }

      // Update local state
      setPatient({
        ...patient,
        medicalHistory: editableNotes,
      });

      setIsEditing(false);
      toast.success("Medical record updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update medical record");
    } finally {
      setIsSaving(false);
    }
  };

  // Authentication and loading states
  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "DOCTOR") {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Restricted</h1>
            <p>Only doctors can view patient medical records.</p>
            <Button className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
            <p>
              The requested patient record doesn&apos;t exist or you don&apos;t
              have permission to view it.
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
    );
  }

  // Sort appointments by date (newest first)
  const sortedAppointments = [...patient.appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const pastAppointments = sortedAppointments.filter(
    (apt) => new Date(apt.date) < new Date()
  );

  const upcomingAppointments = sortedAppointments.filter(
    (apt) => new Date(apt.date) >= new Date()
  );

  return (
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
                <h3 className="font-semibold text-lg">{patient.user.name}</h3>
                <p className="text-muted-foreground">{patient.user.email}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              {patient.birthDate && (
                <div className="flex gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date of Birth
                    </p>
                    <p>{format(new Date(patient.birthDate), "MMMM d, yyyy")}</p>
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
                    <Button onClick={updateMedicalRecord} disabled={isSaving}>
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

          {/* Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Appointments</CardTitle>
              <CardDescription>
                Patient&apos;s appointment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="past">
                <TabsList className="mb-4">
                  <TabsTrigger value="past">
                    Past Appointments ({pastAppointments.length})
                  </TabsTrigger>
                  <TabsTrigger value="upcoming">
                    Upcoming ({upcomingAppointments.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="past">
                  {pastAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {pastAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="border rounded-md p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(
                                    new Date(appointment.date),
                                    "MMMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(new Date(appointment.date), "h:mm a")}
                                  {" • "}
                                  {appointment.duration} minutes
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                appointment.status === "completed"
                                  ? "outline"
                                  : appointment.status === "cancelled"
                                  ? "destructive"
                                  : "default"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>

                          {appointment.reason && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground mb-1">
                                Reason:
                              </p>
                              <p className="text-sm">{appointment.reason}</p>
                            </div>
                          )}

                          {appointment.notes && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground mb-1">
                                Clinical Notes:
                              </p>
                              <p className="text-sm bg-muted p-2 rounded">
                                {appointment.notes}
                              </p>
                            </div>
                          )}

                          <div className="mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/doctor/appointment/${appointment.id}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No past appointments</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="upcoming">
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="border rounded-md p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(
                                    new Date(appointment.date),
                                    "MMMM d, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(new Date(appointment.date), "h:mm a")}
                                  {" • "}
                                  {appointment.duration} minutes
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant={
                                appointment.status === "confirmed"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>

                          {appointment.reason && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground mb-1">
                                Reason:
                              </p>
                              <p className="text-sm">{appointment.reason}</p>
                            </div>
                          )}

                          <div className="mt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/doctor/appointment/${appointment.id}`
                                )
                              }
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No upcoming appointments</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                          router.push(
                            `/doctor/appointment/new?patientId=${patientId}`
                          )
                        }
                      >
                        Schedule New Appointment
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() =>
                  router.push(`/doctor/appointment/new?patientId=${patientId}`)
                }
              >
                Schedule New Appointment
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

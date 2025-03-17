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
      } catch (error) {
        console.error(error);
        toast.error("Failed to load patient records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientRecords();
  }, [patientId, session?.user?.id]);

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
              <CardTitle>Medical History</CardTitle>
              <CardDescription>
                Patient&apos;s medical background and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patient.medicalHistory ? (
                <div className="whitespace-pre-wrap">
                  {patient.medicalHistory}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No medical history recorded</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Implement edit medical history functionality
                  toast.info("Medical history editing not implemented yet");
                }}
              >
                Edit Medical History
              </Button>
            </CardFooter>
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

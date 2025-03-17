"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Loader2,
  Search,
  FileText,
  User,
  Calendar,
  FilterX,
  PlusSquare,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSessionStore from "@/lib/store/useSessionStore";

type Patient = {
  id: string;
  userId: string;
  birthDate: string | null;
  address: string | null;
  phone: string | null;
  socialSecurityNumber: string | null;
  medicalHistory: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  appointments: Array<{
    id: string;
    date: string;
  }>;
};

export default function MedicalRecordsPage() {
  const router = useRouter();
  const { session, status } = useSessionStore();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // For record detail dialog
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editableNotes, setEditableNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch patients with their medical records
  useEffect(() => {
    const fetchPatientsWithRecords = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/patients");

        if (!response.ok) {
          throw new Error("Failed to fetch patient records");
        }

        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load patient medical records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientsWithRecords();
  }, [session?.user?.id]);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient) => {
      const searchString = searchTerm.toLowerCase();

      // Search in patient name, ID, and medical history
      return (
        patient.user.name.toLowerCase().includes(searchString) ||
        patient.socialSecurityNumber?.toLowerCase().includes(searchString) ||
        patient.medicalHistory?.toLowerCase().includes(searchString)
      );
    });

    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // View patient medical record
  const viewMedicalRecord = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditableNotes(patient.medicalHistory || "");
    setIsEditing(false);
    setIsDetailOpen(true);
  };

  // Update medical record
  const updateMedicalRecord = async () => {
    if (!selectedPatient) return;

    setIsSaving(true);
    try {
      // First get the full patient data
      const patientResponse = await fetch(
        `/api/patient?userId=${selectedPatient.userId}`
      );

      if (!patientResponse.ok) {
        throw new Error("Failed to fetch patient data");
      }

      const patientData = await patientResponse.json();

      // Then update with the new medical history
      const response = await fetch(
        `/api/patient?userId=${selectedPatient.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...patientData,
            medicalHistory: editableNotes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update medical record");
      }

      // Update local state
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === selectedPatient.id
            ? { ...p, medicalHistory: editableNotes }
            : p
        )
      );

      setSelectedPatient({
        ...selectedPatient,
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

  // Auth check
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
        <p>Please sign in to view patient medical records.</p>
        <Button className="mt-4" onClick={() => router.push("/auth/login")}>
          Sign In
        </Button>
      </div>
    );
  }

  if (session.user.role !== "DOCTOR") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Not authorized</h1>
        <p>Only doctors can access medical records.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Patient Medical Records</h1>
      </div>

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
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No records match your search."
                : "No patient medical records found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map((patient) => (
                <Card
                  key={patient.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
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
                          <h3 className="font-semibold">{patient.user.name}</h3>
                          {patient.birthDate && (
                            <p className="text-xs text-muted-foreground">
                              DOB:{" "}
                              {format(
                                new Date(patient.birthDate),
                                "MMM d, yyyy"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={patient.medicalHistory ? "default" : "outline"}
                        className="ml-2"
                      >
                        {patient.medicalHistory ? "Has Records" : "No Records"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="h-24 overflow-hidden text-sm text-muted-foreground">
                      {patient.medicalHistory ? (
                        <div className="line-clamp-4">
                          {patient.medicalHistory}
                        </div>
                      ) : (
                        <p className="italic">
                          No medical history recorded for this patient.
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => viewMedicalRecord(patient)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Medical Record
                    </Button>
                  </CardFooter>
                </Card>
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

      {/* Medical Record Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 mr-2" />
                  <span>Medical Record: {selectedPatient.user.name}</span>
                </DialogTitle>
                <DialogDescription>
                  View and update patient medical history
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="record">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="record">Medical History</TabsTrigger>
                  <TabsTrigger value="info">Patient Info</TabsTrigger>
                </TabsList>

                {/* Medical Record Tab */}
                <TabsContent value="record" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Medical History
                    </h3>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>
                        Edit Record
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditableNotes(
                              selectedPatient.medicalHistory || ""
                            );
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={updateMedicalRecord}
                          disabled={isSaving}
                        >
                          {isSaving && (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <Textarea
                      value={editableNotes}
                      onChange={(e) => setEditableNotes(e.target.value)}
                      className="min-h-[300px] font-mono"
                      placeholder="Enter medical history, conditions, allergies, medications, etc."
                    />
                  ) : (
                    <ScrollArea className="h-[300px] rounded-md border p-4">
                      {selectedPatient.medicalHistory ? (
                        <div style={{ whiteSpace: "pre-line" }}>
                          {selectedPatient.medicalHistory}
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
                </TabsContent>

                {/* Patient Info Tab */}
                <TabsContent value="info">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={selectedPatient.user.image || undefined}
                        />
                        <AvatarFallback className="text-lg">
                          {selectedPatient.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {selectedPatient.user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedPatient.user.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">
                          Personal Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Birth Date
                            </p>
                            <p>
                              {selectedPatient.birthDate
                                ? format(
                                    new Date(selectedPatient.birthDate),
                                    "MMMM d, yyyy"
                                  )
                                : "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Phone
                            </p>
                            <p>{selectedPatient.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Social Security
                            </p>
                            <p>
                              {selectedPatient.socialSecurityNumber ||
                                "Not provided"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Address
                            </p>
                            <p>{selectedPatient.address || "Not provided"}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">
                          Recent Appointments
                        </h4>
                        {selectedPatient.appointments.length > 0 ? (
                          <div className="space-y-2">
                            {selectedPatient.appointments
                              .slice(0, 3)
                              .map((appointment) => (
                                <div
                                  key={appointment.id}
                                  className="flex items-center p-2 rounded-md border"
                                >
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>
                                    {format(
                                      new Date(appointment.date),
                                      "MMMM d, yyyy"
                                    )}{" "}
                                    at{" "}
                                    {format(
                                      new Date(appointment.date),
                                      "h:mm a"
                                    )}
                                  </span>
                                </div>
                              ))}
                            {selectedPatient.appointments.length > 3 && (
                              <p className="text-sm text-muted-foreground">
                                and {selectedPatient.appointments.length - 3}{" "}
                                more appointments
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">
                            No appointments found
                          </p>
                        )}

                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() =>
                            router.push(
                              `/doctor/appointment/new?patientId=${selectedPatient.id}`
                            )
                          }
                        >
                          Schedule Appointment
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  User,
  Phone,
  Mail,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import useSessionStore from "@/lib/store/useSessionStore";
import { toast } from "sonner";

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
    role: string;
    createdAt: string;
  };
  appointments: Array<{
    id: string;
    date: string;
    duration: number;
    reason?: string;
    status: string;
    appointmentType?: string;
    createdAt: string;
  }>;
};

export default function DoctorPatientsPage() {
  const router = useRouter();
  const { session, status } = useSessionStore();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Patient["user"] | "appointments" | "birthDate";
    direction: "ascending" | "descending";
  }>({ key: "name", direction: "ascending" });

  // For patient details dialog
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/patients");

        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }

        const data = await response.json();
        setPatients(data);
        setFilteredPatients(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [session?.user?.id]);

  // Filter patients based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter((patient) => {
      const searchString = searchTerm.toLowerCase();
      return (
        patient.user.name.toLowerCase().includes(searchString) ||
        patient.user.email.toLowerCase().includes(searchString) ||
        patient.phone?.toLowerCase().includes(searchString) ||
        patient.address?.toLowerCase().includes(searchString) ||
        patient.socialSecurityNumber?.toLowerCase().includes(searchString)
      );
    });

    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Sort patients
  const sortPatients = (key: typeof sortConfig.key) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });

    setFilteredPatients((prev) => {
      return [...prev].sort((a, b) => {
        if (key === "appointments") {
          return direction === "ascending"
            ? a.appointments.length - b.appointments.length
            : b.appointments.length - a.appointments.length;
        }

        if (key === "birthDate") {
          if (!a.birthDate) return direction === "ascending" ? 1 : -1;
          if (!b.birthDate) return direction === "ascending" ? -1 : 1;

          return direction === "ascending"
            ? new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime()
            : new Date(b.birthDate).getTime() - new Date(a.birthDate).getTime();
        }

        // For user properties
        if (!a.user[key]) return direction === "ascending" ? 1 : -1;
        if (!b.user[key]) return direction === "ascending" ? -1 : 1;

        return direction === "ascending"
          ? a.user[key].localeCompare(b.user[key])
          : b.user[key].localeCompare(a.user[key]);
      });
    });
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
        <p>Please sign in to view your patients.</p>
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
        <p>Only doctors can access the patient list.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Patients</h1>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                View and manage all your patients
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search patients..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                ? "No patients match your search."
                : "No patients found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => sortPatients("name")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => sortPatients("birthDate")}
                    >
                      <div className="flex items-center">
                        Age
                        {sortConfig.key === "birthDate" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => sortPatients("appointments")}
                    >
                      <div className="flex items-center">
                        Appointments
                        {sortConfig.key === "appointments" &&
                          (sortConfig.direction === "ascending" ? (
                            <ChevronDown className="ml-1 h-4 w-4" />
                          ) : (
                            <ChevronUp className="ml-1 h-4 w-4" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => {
                    // Calculate age if birthDate is available
                    let age = null;
                    if (patient.birthDate) {
                      const birthDate = new Date(patient.birthDate);
                      const today = new Date();
                      age = today.getFullYear() - birthDate.getFullYear();

                      // Check if birthday has occurred this year
                      if (
                        today.getMonth() < birthDate.getMonth() ||
                        (today.getMonth() === birthDate.getMonth() &&
                          today.getDate() < birthDate.getDate())
                      ) {
                        age--;
                      }
                    }

                    // Find last appointment
                    const lastAppointment = patient.appointments[0];

                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage
                                src={patient.user.image || undefined}
                              />
                              <AvatarFallback>
                                {patient.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{patient.user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {patient.user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.phone ? (
                            <div className="flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                              <span>{patient.phone}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Not provided
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {age !== null ? (
                            <span>{age} years</span>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Not provided
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {patient.appointments.length}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lastAppointment ? (
                            <div>
                              <p>
                                {format(
                                  new Date(lastAppointment.date),
                                  "MMM d, yyyy"
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(lastAppointment.date),
                                  "h:mm a"
                                )}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">
                              Never
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewPatientDetails(patient)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => scheduleAppointment(patient.id)}
                            >
                              Schedule
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
        </CardFooter>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>Patient Details: {selectedPatient.user.name}</span>
                </DialogTitle>
                <DialogDescription>
                  Complete patient information and medical history
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="medical">Medical History</TabsTrigger>
                </TabsList>

                {/* Personal Info Tab */}
                <TabsContent value="info" className="space-y-4">
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
                        Member since{" "}
                        {format(
                          new Date(selectedPatient.user.createdAt),
                          "MMMM yyyy"
                        )}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Email
                        </p>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>{selectedPatient.user.email}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Phone
                        </p>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>
                            {selectedPatient.phone || (
                              <span className="text-muted-foreground italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Birth Date
                        </p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>
                            {selectedPatient.birthDate ? (
                              format(
                                new Date(selectedPatient.birthDate),
                                "MMMM d, yyyy"
                              )
                            ) : (
                              <span className="text-muted-foreground italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Social Security
                        </p>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p>
                            {selectedPatient.socialSecurityNumber || (
                              <span className="text-muted-foreground italic">
                                Not provided
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Address
                      </p>
                      <p>
                        {selectedPatient.address || (
                          <span className="text-muted-foreground italic">
                            No address provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Appointments Tab */}
                <TabsContent value="appointments">
                  {selectedPatient.appointments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No appointment history for this patient.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedPatient.appointments.map((appointment) => (
                        <Card key={appointment.id}>
                          <CardContent className="py-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center mb-2">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <span className="font-medium">
                                    {format(
                                      new Date(appointment.date),
                                      "EEEE, MMMM d, yyyy"
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center mb-2">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>
                                    {format(
                                      new Date(appointment.date),
                                      "h:mm a"
                                    )}{" "}
                                    •{" " + appointment.duration} minutes
                                  </span>
                                </div>
                                {appointment.appointmentType && (
                                  <Badge className="mb-2" variant="outline">
                                    {appointment.appointmentType
                                      .charAt(0)
                                      .toUpperCase() +
                                      appointment.appointmentType.slice(1)}
                                  </Badge>
                                )}
                                {appointment.reason && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                      Reason:
                                    </p>
                                    <p className="text-sm border-l-2 pl-3 py-1 border-muted">
                                      {appointment.reason}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <Badge
                                variant={
                                  appointment.status === "confirmed"
                                    ? "default"
                                    : appointment.status === "cancelled"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {appointment.status.charAt(0).toUpperCase() +
                                  appointment.status.slice(1)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => scheduleAppointment(selectedPatient.id)}
                    >
                      Schedule New Appointment
                    </Button>
                  </div>
                </TabsContent>

                {/* Medical History Tab */}
                <TabsContent value="medical">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        <h3 className="font-medium">Medical History</h3>
                      </div>
                      {selectedPatient.medicalHistory ? (
                        <div className="p-4 rounded-lg bg-muted">
                          <p style={{ whiteSpace: "pre-line" }}>
                            {selectedPatient.medicalHistory}
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-muted-foreground italic">
                            No medical history recorded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                >
                  Close
                </Button>
                <Button onClick={() => scheduleAppointment(selectedPatient.id)}>
                  Schedule Appointment
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

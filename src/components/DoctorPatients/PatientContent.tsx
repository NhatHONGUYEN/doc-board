import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Phone,
  User,
} from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent, CardFooter } from "@/components/ui/card";
import { SortConfig } from "@/lib/types/sorting";

type PatientContentProps = {
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  patients: Patient[];
  filteredPatients: Patient[];
  sortConfig: SortConfig;
  // Update handleSort to accept the string type that page.tsx is providing
  handleSort: (key: string) => void;
  viewPatientDetails: (patient: Patient) => void;
  scheduleAppointment: (patientId: string) => void;
};

export function PatientContent({
  isLoading,
  isError,
  searchTerm,
  patients,
  filteredPatients,
  sortConfig,
  handleSort,
  viewPatientDetails,
  scheduleAppointment,
}: PatientContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8 text-destructive">
        Error loading patients. Please try again.
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {searchTerm ? "No patients match your search." : "No patients found."}
      </div>
    );
  }

  return (
    <>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
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
                  onClick={() => handleSort("birthDate")}
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
                  onClick={() => handleSort("appointments")}
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
                          <AvatarImage src={patient.user.image || undefined} />
                          <AvatarFallback>
                            {(patient.user.name || "User")
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
                            {format(new Date(lastAppointment.date), "h:mm a")}
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
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => viewPatientDetails(patient)}
                          title="View Patient Details"
                        >
                          <User className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => scheduleAppointment(patient.id)}
                          title="Schedule Appointment"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPatients.length} of {patients.length} patients
        </p>
      </CardFooter>
    </>
  );
}

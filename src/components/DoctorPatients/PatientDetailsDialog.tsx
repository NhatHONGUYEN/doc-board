import { format } from "date-fns";
import { User, Phone, Mail, Calendar, FileText, Clock } from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type PatientDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onScheduleAppointment: (patientId: string) => void;
};

export function PatientDetailsDialog({
  isOpen,
  onOpenChange,
  patient,
  onScheduleAppointment,
}: PatientDetailsDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Patient Details: {patient.user.name}</span>
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
                <AvatarImage src={patient.user.image || undefined} />
                <AvatarFallback className="text-lg">
                  {(patient.user.name || "User")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{patient.user.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Member since{" "}
                  {patient.createdAt
                    ? format(new Date(patient.createdAt), "MMMM yyyy")
                    : "Unknown date"}
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
                    <p>{patient.user.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p>
                      {patient.phone || (
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
                      {patient.birthDate ? (
                        format(new Date(patient.birthDate), "MMMM d, yyyy")
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
                      {patient.socialSecurityNumber || (
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
                  {patient.address || (
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
            {patient.appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No appointment history for this patient.
              </div>
            ) : (
              <div className="space-y-4">
                {patient.appointments.map((appointment) => (
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
                              {format(new Date(appointment.date), "h:mm a")} •
                              {" " + appointment.duration} minutes
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
              <Button onClick={() => onScheduleAppointment(patient.id)}>
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
                {patient.medicalHistory ? (
                  <div className="p-4 rounded-lg bg-muted">
                    <p style={{ whiteSpace: "pre-line" }}>
                      {patient.medicalHistory}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={() => onScheduleAppointment(patient.id)}>
            Schedule Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

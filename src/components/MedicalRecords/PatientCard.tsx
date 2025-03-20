// src/components/MedicalRecords/PatientCard.tsx
import { format } from "date-fns";
import { FileText } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientRecord } from "@/lib/types/medical-records";

type PatientCardProps = {
  patient: PatientRecord;
  onViewRecord: (patient: PatientRecord) => void;
};

export default function PatientCard({
  patient,
  onViewRecord,
}: PatientCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={patient.user.image || undefined} />
              <AvatarFallback>
                {(patient.user?.name || "User")
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
                  DOB: {format(new Date(patient.birthDate), "MMM d, yyyy")}
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
            <div className="line-clamp-4">{patient.medicalHistory}</div>
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
          onClick={() => onViewRecord(patient)}
        >
          <FileText className="h-4 w-4 mr-2" />
          View Medical Record
        </Button>
      </CardFooter>
    </Card>
  );
}

// src/components/PatientRecords/PatientInfoCard.tsx
import { format } from "date-fns";
import { Calendar, Phone, MapPin, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientRecord } from "@/lib/types/medical-records";

type PatientInfoCardProps = {
  patient: PatientRecord;
};

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
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
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-muted-foreground" />}
              label="Date of Birth"
              value={format(new Date(patient.birthDate), "MMMM d, yyyy")}
            />
          )}

          {patient.phone && (
            <InfoItem
              icon={<Phone className="h-5 w-5 text-muted-foreground" />}
              label="Phone"
              value={patient.phone}
            />
          )}

          {patient.address && (
            <InfoItem
              icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
              label="Address"
              value={patient.address}
            />
          )}

          {patient.socialSecurityNumber && (
            <InfoItem
              icon={<ClipboardList className="h-5 w-5 text-muted-foreground" />}
              label="SSN"
              value={`•••••${patient.socialSecurityNumber.slice(-4)}`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for information items
type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="flex gap-2">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}

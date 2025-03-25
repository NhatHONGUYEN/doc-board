// src/components/PatientRecords/PatientInfoCard.tsx
import { format } from "date-fns";
import {
  Calendar,
  Phone,
  MapPin,
  ClipboardList,
  UserRound,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientRecord } from "@/lib/types/medical-records";
import { InfoNotice } from "@/components/InfoNotice";

type PatientInfoCardProps = {
  patient: PatientRecord;
};

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center">
            <div className="mr-3 p-2.5 bg-primary/10 rounded-full">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Personal and contact details</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={patient.user.image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {patient.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">
                {patient.user.name}
              </h3>
              <p className="text-muted-foreground">{patient.user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-primary" />}
              label="Date of Birth"
              value={
                patient.birthDate
                  ? format(new Date(patient.birthDate), "MMMM d, yyyy")
                  : "Not provided"
              }
              isMissing={!patient.birthDate}
            />

            <InfoItem
              icon={<Phone className="h-5 w-5 text-primary" />}
              label="Phone"
              value={patient.phone || "Not provided"}
              isMissing={!patient.phone}
            />

            <InfoItem
              icon={<MapPin className="h-5 w-5 text-primary" />}
              label="Address"
              value={patient.address || "Not provided"}
              isMissing={!patient.address}
            />

            <InfoItem
              icon={<ClipboardList className="h-5 w-5 text-primary" />}
              label="SSN"
              value={
                patient.socialSecurityNumber
                  ? `•••••${patient.socialSecurityNumber.slice(-4)}`
                  : "Not recorded"
              }
              isMissing={!patient.socialSecurityNumber}
            />
          </div>
        </CardContent>
      </Card>

      {/* InfoNotice moved outside the Card */}
      <InfoNotice icon={<Calendar size={14} />}>
        Patient information is displayed as recorded in their profile. Missing
        information is marked as &quot;Not provided&quot;. Please verify and
        update during appointments.
      </InfoNotice>
    </div>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  isMissing?: boolean;
};

function InfoItem({ icon, label, value, isMissing = false }: InfoItemProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p
          className={`${
            isMissing ? "text-muted-foreground italic" : "text-card-foreground"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// src/components/PatientRecords/AppointmentsCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PatientRecord } from "@/lib/types/medical-records";

type AppointmentsCardProps = {
  patient: PatientRecord;
};

export function AppointmentsCard({}: AppointmentsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Appointments</CardTitle>
        <CardDescription>Patient&apos;s appointment history</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Your appointments code here */}
        <p>Appointments will be displayed here</p>
      </CardContent>
    </Card>
  );
}

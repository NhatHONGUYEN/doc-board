"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CalendarPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import AppointmentForm from "@/components/AppointmentForm/AppointmentForm";
import { PageHeader } from "@/components/PageHeader";

export default function NewDoctorAppointmentPage() {
  const router = useRouter();

  return (
    <RoleAuthCheck allowedRoles="DOCTOR">
      <div className="container py-10">
        <PageHeader
          title="Planifier un Nouveau Rendez-vous"
          icon={<CalendarPlus className="h-5 w-5 text-primary" />}
          description="Créez un nouveau rendez-vous pour un patient. Sélectionnez le patient, la date, l'heure et ajoutez des notes pertinentes."
        />

        <Suspense
          fallback={
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              </CardContent>
            </Card>
          }
        >
          <AppointmentForm router={router} />
        </Suspense>
      </div>
    </RoleAuthCheck>
  );
}

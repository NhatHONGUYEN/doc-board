"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";

import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import AppointmentForm from "@/components/AppointmentForm/AppointmentForm";
import { PageHeader } from "@/components/PageHeader";
import { Loading } from "@/components/Loading";

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

        <Suspense fallback={<Loading />}>
          <AppointmentForm router={router} />
        </Suspense>
      </div>
    </RoleAuthCheck>
  );
}

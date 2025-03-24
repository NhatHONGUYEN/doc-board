"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import AppointmentForm from "@/components/AppointmentForm/AppointmentForm";

export default function NewDoctorAppointmentPage() {
  const router = useRouter();

  return (
    <RoleAuthCheck allowedRoles="DOCTOR">
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Schedule New Appointment</h1>

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

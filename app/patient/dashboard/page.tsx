"use client";

import SideBarPatient from "@/components/SideBarPatient";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function PatientDashboard() {
  const { data: session, status } = useSession();

  useEffect(() => {}, [session, status]);

  return (
    <div>
      <SideBarPatient></SideBarPatient>
    </div>
  );
}

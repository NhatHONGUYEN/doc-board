// src/components/PatientProfile/PatientPageHeader.tsx
import { PageHeader } from "@/components/PageHeader";
import { User } from "lucide-react";

export function PatientPageHeader() {
  return (
    <PageHeader
      title="Mon Profil"
      icon={<User className="h-5 w-5 text-primary" />}
      description="Consultez et gérez vos informations personnelles"
    />
  );
}

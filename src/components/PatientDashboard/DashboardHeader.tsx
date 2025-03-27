// src/components/PatientDashboard/DashboardHeader.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarPlus, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

type DashboardHeaderProps = {
  patientName?: string | null;
};

export function DashboardHeader({ patientName }: DashboardHeaderProps) {
  // Extraire en toute sécurité le prénom, en gérant null et undefined
  const firstName = patientName?.split(" ")[0] || "Patient";

  // Définir le bouton d'action pour PageHeader
  const actionButton = (
    <Button
      asChild
      className="h-10 bg-primary hover:bg-primary/90 transition-all"
    >
      <Link href="/patient/appointment/new" className="flex items-center">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Prendre un rendez-vous
      </Link>
    </Button>
  );

  return (
    <PageHeader
      title="Tableau de bord Patient"
      icon={<UserCircle className="h-5 w-5 text-primary" />}
      actions={actionButton}
      highlightedText={{
        prefix: "Bienvenue,",
        text: firstName,
      }}
    />
  );
}

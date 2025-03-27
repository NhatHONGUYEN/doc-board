// src/components/PatientSettings/SettingsPageHeader.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function SettingsPageHeader() {
  // Définir le bouton d'action pour PageHeader
  const actionButton = (
    <Button
      variant="outline"
      asChild
      className="h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
    >
      <Link href="/patient/profile" className="flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au Profil
      </Link>
    </Button>
  );

  return (
    <PageHeader
      title="Paramètres du Profil"
      icon={<Settings className="h-5 w-5 text-primary" />}
      description="Mettez à jour vos informations personnelles et médicales"
      actions={actionButton}
    />
  );
}

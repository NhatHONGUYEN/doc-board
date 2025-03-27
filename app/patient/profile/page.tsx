"use client";

import { Loader2, AlertTriangle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { PatientPageHeader } from "@/components/PatientProfile/PatientPageHeader";
import { ProfileOverview } from "@/components/PatientProfile/ProfileOverview";
import { PatientPersonalInformation } from "@/components/PatientProfile/PatientPersonalInformation";

export default function PatientProfilePage() {
  const { session } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  // Composant de chargement à utiliser avec RoleAuthCheck
  const loadingComponent = (
    <div className="flex justify-center py-12">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">
          Chargement de votre profil...
        </p>
      </div>
    </div>
  );

  // Composant de gestion d'erreur
  const ErrorDisplay = () => {
    if (!isError) return null;

    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-3 mx-auto mb-4 w-fit">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Erreur de chargement du profil
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {error.message ||
              "Un problème est survenu lors du chargement de votre profil. Veuillez réessayer."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  };

  // Composant pour utilisateur non authentifié
  const unauthenticatedComponent = (
    <div className="flex justify-center py-12">
      <div className="text-center max-w-md">
        <div className="bg-primary/10 rounded-full p-3 mx-auto mb-4 w-fit">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-1">
          Authentification requise
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Veuillez vous connecter pour consulter votre profil.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/api/auth/signin">Se connecter</Link>
        </Button>
      </div>
    </div>
  );

  // Calcul du taux de complétude du profil
  const requiredFields = [
    "phone",
    "address",
    "birthDate",
    "socialSecurityNumber",
  ];
  const completedFields = requiredFields.filter(
    (field) => !!patient?.[field as keyof typeof patient]
  ).length;
  const completionPercentage = Math.round(
    (completedFields / requiredFields.length) * 100
  );

  return (
    <RoleAuthCheck
      allowedRoles="PATIENT"
      loadingComponent={isLoading ? loadingComponent : undefined}
      unauthenticatedComponent={unauthenticatedComponent}
    >
      {isError ? (
        <ErrorDisplay />
      ) : (
        <div className="container max-w-3xl py-10">
          <PatientPageHeader />

          <ProfileOverview
            patient={patient}
            session={session}
            completionPercentage={completionPercentage}
          />

          <PatientPersonalInformation patient={patient} />
        </div>
      )}
    </RoleAuthCheck>
  );
}

// app/doctor/availability/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSessionStore from "@/lib/store/useSessionStore";
import { useDoctorData } from "@/hooks/useDoctorData";
import { useAvailabilityData } from "@/hooks/useAvailabilityData";
import { useSaveAvailability } from "@/hooks/useSaveAvailability";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { useAvailabilityStore } from "@/lib/store/useAvailabilityStore";
import WeeklyScheduleCard from "@/components/DoctorAvailability/WeeklyScheduleCard";
import SpecialDatesCard from "@/components/DoctorAvailability/SpecialDatesCard";
import { PageHeader } from "@/components/PageHeader";

export default function DoctorAvailabilityPage() {
  const router = useRouter();
  const { session, status } = useSessionStore();

  // Récupérer les données du médecin
  const { data: doctor, isLoading: isLoadingDoctor } = useDoctorData(
    session?.user?.id
  );

  // Utiliser TanStack Query pour récupérer les données de disponibilité
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useAvailabilityData(doctor?.id);

  // Utiliser TanStack Query pour sauvegarder la disponibilité
  const { mutate: saveAvailabilityMutation, isPending: isSaving } =
    useSaveAvailability();

  // Utiliser notre store Zustand (uniquement les fonctions dont nous avons besoin dans ce composant)
  const { initializeFromApiData, resetStore, saveAvailability } =
    useAvailabilityStore();

  // Initialiser le store avec les données de l'API
  useEffect(() => {
    if (availabilityData) {
      initializeFromApiData(availabilityData);
    }
  }, [availabilityData, initializeFromApiData]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => resetStore();
  }, [resetStore]);

  // État de chargement (combiné de toutes les sources)
  const isLoading =
    status === "loading" || isLoadingDoctor || isLoadingAvailability;

  // Composant de chargement personnalisé
  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  // Composant de vérification du profil du médecin
  const doctorProfileCheck = (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Profil médecin non trouvé</h1>
      <p>Veuillez d&apos;abord compléter votre profil médecin.</p>
      <Button className="mt-4" onClick={() => router.push("/doctor/profile")}>
        Compléter le Profil
      </Button>
    </div>
  );

  // Gestionnaire pour sauvegarder la disponibilité - encapsule la fonction saveAvailability du store avec doctorId
  const handleSaveAvailability = () => {
    if (!doctor?.id) return;
    saveAvailability(doctor.id, saveAvailabilityMutation);
  };

  return (
    <RoleAuthCheck
      allowedRoles="DOCTOR"
      loadingComponent={
        status === "loading" || isLoadingDoctor ? loadingComponent : undefined
      }
    >
      {!doctor ? (
        doctorProfileCheck
      ) : (
        <div className="container py-10">
          {/* Remplacement de l'en-tête manuel par le composant PageHeader */}
          <PageHeader
            title="Gérer la Disponibilité"
            icon={<Calendar className="h-5 w-5 text-primary" />}
            description="Définissez vos heures de travail hebdomadaires et gérez les dates spéciales où vous n'êtes pas disponible pour des rendez-vous."
            actions={
              <Button
                onClick={handleSaveAvailability}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isSaving
                  ? "Enregistrement..."
                  : "Enregistrer les Modifications"}
              </Button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Les composants existants restent inchangés */}
            <WeeklyScheduleCard isLoading={isLoading} />
            <SpecialDatesCard isLoading={isLoading} />
          </div>
        </div>
      )}
    </RoleAuthCheck>
  );
}

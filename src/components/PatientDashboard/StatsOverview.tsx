// src/components/PatientDashboard/StatsOverview.tsx
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Shield, User, ArrowRight, Info } from "lucide-react";
import { InfoNotice } from "@/components/InfoNotice";

type StatsOverviewProps = {
  upcomingAppointmentsCount: number;
  hasMedicalHistory: boolean;
  isProfileComplete: boolean;
};

export function StatsOverview({
  upcomingAppointmentsCount,
  hasMedicalHistory,
  isProfileComplete,
}: StatsOverviewProps) {
  return (
    <div className="space-y-3 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Rendez-vous à venir
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {upcomingAppointmentsCount}
                  </p>
                  <Link
                    href="/patient/appointment"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Historique médical
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {hasMedicalHistory ? "Complet" : "Incomplet"}
                  </p>
                  <Link
                    href="/patient/medical-history"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Statut du profil
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {isProfileComplete ? "Complet" : "Incomplet"}
                  </p>
                  <Link
                    href="/patient/profile"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* InfoNotice ajouté en dessous des cartes de statistiques */}
      <InfoNotice
        icon={<Info size={14} />}
        note="Complétez votre profil et votre historique médical pour aider les médecins à fournir de meilleurs soins."
      >
        Ces statistiques fournissent un aperçu rapide de l&apos;état de votre
        compte. Cliquez sur n&apos;importe quelle carte pour gérer les
        informations correspondantes.
      </InfoNotice>
    </div>
  );
}

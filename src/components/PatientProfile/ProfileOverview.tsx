// src/components/PatientProfile/ProfileOverview.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Mail, Phone, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Patient } from "@/lib/types/core-entities";
import { Session } from "next-auth";
import { InfoNotice } from "@/components/InfoNotice";

type ProfileOverviewProps = {
  patient?: Patient;
  session?: Session | null;
  completionPercentage: number;
};

export function ProfileOverview({
  patient,
  session,
  completionPercentage,
}: ProfileOverviewProps) {
  return (
    <div className="space-y-3 mb-8">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <CardHeader className="bg-card border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Aperçu du profil
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Informations et statut de votre compte
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl mb-2">
                <AvatarImage
                  src={session?.user?.image || ""}
                  alt="Photo de profil"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-4xl font-semibold">
                  {patient?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <Badge
                variant="outline"
                className={cn(
                  completionPercentage === 100
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                    : "bg-primary/10 text-primary border-primary/20"
                )}
              >
                {completionPercentage === 100 ? "Complet" : "Incomplet"}
              </Badge>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="space-y-2 mb-4">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {patient?.user?.name || "Patient"}
                </h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 text-muted-foreground">
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <span>{patient?.user?.email}</span>
                  </div>
                  {patient?.phone && (
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <span className="hidden md:inline text-border">•</span>
                      <Phone className="h-4 w-4 text-primary/70" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-1">
                <div
                  className={cn(
                    "h-full rounded-full",
                    completionPercentage === 100
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-primary"
                  )}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Niveau de complétion du profil : {completionPercentage}%
              </p>
            </div>
          </div>
        </CardContent>

        {/* Le CardFooter avec bouton Modifier a été supprimé */}
      </Card>

      {/* Note d'information sur la complétion du profil */}
      <InfoNotice
        icon={<Info size={14} />}
        note="Complétez votre profil pour aider les médecins à fournir de meilleurs soins."
      >
        Un profil complet permet d&apos;assurer un diagnostic et un traitement
        précis. Des informations manquantes peuvent affecter votre expérience de
        soins et limiter les fonctionnalités disponibles.
      </InfoNotice>
    </div>
  );
}

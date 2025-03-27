// src/components/PatientDashboard/PersonalInfoCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  FileText,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { Patient } from "@/lib/types/core-entities";
import { InfoNotice } from "@/components/InfoNotice";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type PersonalInfoCardProps = {
  patient?: Patient;
};

export function PersonalInfoCard({ patient }: PersonalInfoCardProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
        <CardHeader className="bg-card border-b border-border">
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Informations personnelles
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Détails de votre profil
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex justify-center mb-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
              <AvatarImage src={patient?.user?.image || ""} alt="Patient" />
              <AvatarFallback className="bg-primary/5 text-primary text-xl font-semibold">
                {patient?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Nom complet</p>
                <p className="font-medium text-card-foreground">
                  {patient?.user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-card-foreground">
                  {patient?.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Téléphone</p>
                <p className="font-medium text-card-foreground">
                  {patient?.phone || (
                    <span className="text-muted-foreground italic text-sm">
                      Non renseigné
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Date de naissance
                </p>
                <p className="font-medium text-card-foreground">
                  {patient?.birthDate ? (
                    format(new Date(patient.birthDate), "d MMMM yyyy", {
                      locale: fr,
                    })
                  ) : (
                    <span className="text-muted-foreground italic text-sm">
                      Non renseignée
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-card border-t border-border py-4 px-5">
          <Button
            asChild
            variant="outline"
            className="w-full h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Link
              href="/patient/profile"
              className="flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Modifier le profil
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Note d'information sous la carte */}
      <InfoNotice
        icon={<LockKeyhole size={14} />}
        note="Vos informations sont uniquement partagées avec vos professionnels de santé."
      >
        Maintenir votre profil à jour permet à vos médecins de disposer
        d&apos;informations précises pour le diagnostic et le traitement.
      </InfoNotice>
    </div>
  );
}

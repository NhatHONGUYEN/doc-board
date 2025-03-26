import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Phone,
  User,
  Award,
  FileText,
  Mail,
  Stethoscope,
} from "lucide-react";
import { Doctor } from "@/lib/types/core-entities";
import { InfoNotice } from "@/components/InfoNotice";
import { calculateProfileCompleteness } from "@/lib/utils/profileUtils";

type ProfessionalInformationProps = {
  doctor?: Doctor;
};

export function ProfessionalInformation({
  doctor,
}: ProfessionalInformationProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <CardHeader className="bg-card border-b border-border">
          <div className="flex justify-between items-center pb-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-primary/70" />
                Informations Professionnelles
              </CardTitle>
              <CardDescription>
                Vos qualifications et détails professionnels
              </CardDescription>
            </div>
            <Button
              asChild
              size="sm"
              className="h-9 hover:bg-primary/90 transition-colors"
            >
              <Link href="/doctor/settings" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Modifier
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-2 text-primary/70" />
                Nom Complet
              </p>
              <p className="font-medium text-card-foreground pl-6">
                Dr. {doctor?.user?.name || "Non renseigné"}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary/70" />
                Email
              </p>
              <p className="font-medium text-card-foreground pl-6">
                {doctor?.user?.email}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center">
                <Award className="h-4 w-4 mr-2 text-primary/70" />
                Spécialité
              </p>
              <p className="font-medium text-card-foreground pl-6">
                {doctor?.specialty || (
                  <span className="text-muted-foreground italic text-sm">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary/70" />
                Numéro de Licence
              </p>
              <p className="font-medium text-card-foreground pl-6">
                {doctor?.licenseNumber || (
                  <span className="text-muted-foreground italic text-sm">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary/70" />
                Numéro de Téléphone
              </p>
              <p className="font-medium text-card-foreground pl-6">
                {doctor?.phone || (
                  <span className="text-muted-foreground italic text-sm">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                Adresse du Cabinet
              </p>
              <p className="font-medium text-card-foreground pl-6">
                {doctor?.officeAddress || (
                  <span className="text-muted-foreground italic text-sm">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1.5 mt-2 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Description Professionnelle
              </p>
              <div className="px-4 py-3 bg-muted/20 rounded-md">
                {doctor?.description ? (
                  <p className="text-card-foreground whitespace-pre-line">
                    {doctor.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    Aucune description professionnelle fournie. Ajoutez des
                    détails sur votre pratique, votre expérience et vos
                    spécialisations.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-card border-t border-border py-4 px-6">
          <div className="flex items-center text-sm text-primary/70">
            <span className="font-medium mr-2">Complétude du Profil :</span>
            <div className="h-2 w-40 bg-muted rounded-full overflow-hidden mr-2">
              <div
                className="h-full bg-primary rounded-full"
                style={{
                  width: `${calculateProfileCompleteness(doctor)}%`,
                }}
              ></div>
            </div>
            <span className="text-xs">
              {calculateProfileCompleteness(doctor)}%
            </span>
          </div>
        </CardFooter>
      </Card>

      {/* InfoNotice for Professional Information */}
      <InfoNotice icon={<FileText size={14} />}>
        Maintenir vos informations professionnelles précises et à jour permet
        aux patients de prendre des décisions éclairées.
        <span className="font-medium block mt-1 text-blue-200">
          Vos qualifications sont affichées sur votre profil public et lors des
          prises de rendez-vous.
        </span>
      </InfoNotice>
    </div>
  );
}

import { format } from "date-fns";
import { FileText, Calendar, Phone, Mail, Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientRecord } from "@/lib/types/medical-records";
import { cn } from "@/lib/utils";

type PatientCardProps = {
  patient: PatientRecord;
  onViewRecord: (patient: PatientRecord) => void;
};

export default function PatientCard({
  patient,
  onViewRecord,
}: PatientCardProps) {
  // Obtenir le rendez-vous le plus récent si disponible
  const lastAppointment = patient.appointments?.[0];

  // Déterminer le style du badge selon que des dossiers existent ou non
  const hasMedicalHistory = !!patient.medicalHistory?.trim();

  // Calculer l'âge si la date de naissance est disponible
  let age = null;
  if (patient.birthDate) {
    const birthDate = new Date(patient.birthDate);
    const today = new Date();
    age = today.getFullYear() - birthDate.getFullYear();

    // Ajuster l'âge si l'anniversaire n'a pas encore eu lieu cette année
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] flex flex-col h-[500px]">
      <CardHeader className="p-5 pb-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-md">
              <AvatarImage src={patient.user.image || undefined} />
              <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                {(patient.user?.name || "Utilisateur")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">
                {patient.user.name}
              </h3>
              {/* Supprimer l'affichage de l'âge et de la date de naissance ici */}
            </div>
          </div>

          <Badge
            variant={hasMedicalHistory ? "default" : "outline"}
            className={cn(
              "ml-2 px-2 py-1 font-normal",
              hasMedicalHistory
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "border-primary/20 bg-background text-muted-foreground"
            )}
          >
            {hasMedicalHistory ? "Dossier existant" : "Aucun dossier"}
          </Badge>
        </div>

        {/* Section des informations de contact modifiée avec date de naissance séparée */}
        <div className="mt-4 pt-3 border-t border-border grid grid-cols-1 gap-2">
          {age !== null && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-2 text-primary" />
              {age} ans
            </div>
          )}

          {patient.birthDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-2 text-primary" />
              Naissance: {format(new Date(patient.birthDate), "d MMM yyyy")}
            </div>
          )}

          {patient.phone && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Phone className="h-3 w-3 mr-2 text-primary" />
              {patient.phone}
            </div>
          )}

          {patient.user.email && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-2 text-primary" />
              {patient.user.email}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4 bg-card flex-1 overflow-y-auto">
        <div className="mb-2 flex items-center">
          <div className="h-4 w-1 rounded-r-full bg-primary/70 mr-2"></div>
          <h4 className="font-medium text-sm text-card-foreground">
            Antécédents médicaux
          </h4>
        </div>

        <div className="text-sm text-muted-foreground">
          {hasMedicalHistory ? (
            <div className="line-clamp-4 whitespace-pre-line">
              {(patient.medicalHistory || "")
                .split("\n")
                .slice(0, 4)
                .map((line, i) => {
                  // Mettre les en-têtes en gras
                  if (
                    line.toUpperCase() === line &&
                    line.endsWith(":") &&
                    line.length > 1
                  ) {
                    return (
                      <p key={i} className="font-semibold text-primary my-1">
                        {line}
                      </p>
                    );
                  }
                  // Formater les puces
                  else if (line.trim().startsWith("•")) {
                    return (
                      <p key={i} className="ml-3 mb-1">
                        <span className="text-primary mr-1">•</span>
                        {line.substring(1).trim()}
                      </p>
                    );
                  }
                  // Lignes normales
                  return (
                    <p key={i} className="mb-1">
                      {line}
                    </p>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 px-2 text-center bg-muted rounded-md">
              <div className="bg-primary/5 p-2 rounded-full mb-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-card-foreground mb-0.5">
                Aucun antécédent médical enregistré
              </p>
              <p className="text-xs text-muted-foreground">
                Consultez le dossier complet pour ajouter des informations
              </p>
            </div>
          )}
        </div>

        {lastAppointment && (
          <div className="mt-4 pt-3 border-t border-border flex items-start">
            <Clock className="h-3.5 w-3.5 mt-0.5 mr-2 text-primary" />
            <div>
              <p className="text-xs font-medium text-card-foreground">
                Dernière visite:{" "}
                {format(new Date(lastAppointment.date), "d MMM yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {lastAppointment.reason?.substring(0, 40) || "Contrôle général"}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-3 bg-card border-t border-border mt-auto">
        <Button
          variant="outline"
          className="w-full h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
          onClick={() => onViewRecord(patient)}
        >
          <FileText className="h-4 w-4 mr-2" />
          Voir le dossier médical complet
        </Button>
      </CardFooter>
    </Card>
  );
}

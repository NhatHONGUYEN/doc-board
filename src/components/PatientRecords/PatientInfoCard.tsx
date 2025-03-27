// src/components/PatientRecords/PatientInfoCard.tsx
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Phone,
  MapPin,
  ClipboardList,
  UserRound,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientRecord } from "@/lib/types/medical-records";
import { InfoNotice } from "@/components/InfoNotice";

type PatientInfoCardProps = {
  patient: PatientRecord;
};

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center">
            <div className="mr-3 p-2.5 bg-primary/10 rounded-full">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Informations patient</CardTitle>
              <CardDescription>
                Coordonnées et informations personnelles
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={patient.user.image || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {patient.user.name
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
              <p className="text-muted-foreground">{patient.user.email}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-primary" />}
              label="Date de naissance"
              value={
                patient.birthDate
                  ? format(new Date(patient.birthDate), "d MMMM yyyy", {
                      locale: fr,
                    })
                  : "Non renseignée"
              }
              isMissing={!patient.birthDate}
            />

            <InfoItem
              icon={<Phone className="h-5 w-5 text-primary" />}
              label="Téléphone"
              value={patient.phone || "Non renseigné"}
              isMissing={!patient.phone}
            />

            <InfoItem
              icon={<MapPin className="h-5 w-5 text-primary" />}
              label="Adresse"
              value={patient.address || "Non renseignée"}
              isMissing={!patient.address}
            />

            <InfoItem
              icon={<ClipboardList className="h-5 w-5 text-primary" />}
              label="N° Sécurité sociale"
              value={
                patient.socialSecurityNumber
                  ? `•••••${patient.socialSecurityNumber.slice(-4)}`
                  : "Non enregistré"
              }
              isMissing={!patient.socialSecurityNumber}
            />
          </div>
        </CardContent>
      </Card>

      {/* InfoNotice en dehors de la Card */}
      <InfoNotice icon={<Calendar size={14} />}>
        Les informations du patient sont affichées telles qu&apos;enregistrées
        dans son profil. Les informations manquantes sont indiquées comme
        &quot;Non renseignées&quot;. Veuillez vérifier et mettre à jour lors des
        consultations.
      </InfoNotice>
    </div>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  isMissing?: boolean;
};

function InfoItem({ icon, label, value, isMissing = false }: InfoItemProps) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p
          className={`${
            isMissing ? "text-muted-foreground italic" : "text-card-foreground"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoNotice } from "@/components/InfoNotice";
import {
  Calendar,
  CalendarClock,
  FileText,
  LayoutGrid,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Doctor } from "@/lib/types/core-entities";
import { Session } from "next-auth";

type DoctorProfileCardProps = {
  doctor?: Doctor;
  session: Session;
  totalAppointments: number;
  upcomingAppointments: number;
};

export function DoctorProfileCard({
  doctor,
  session,
  totalAppointments,
  upcomingAppointments,
}: DoctorProfileCardProps) {
  return (
    <div className="md:col-span-1">
      <div className="space-y-3 sticky top-20">
        <Card className="border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="pt-6 relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative h-32 w-32 rounded-full border-4 border-background shadow-lg">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="Photo de profil"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-primary/5 flex items-center justify-center">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-bold text-card-foreground">
                    Dr. {doctor?.user?.name || "Médecin"}
                  </h2>
                  <Badge className="mt-1 bg-primary hover:bg-primary/90">
                    Médecin
                  </Badge>
                </div>

                {doctor?.specialty && (
                  <p className="text-primary font-medium">{doctor.specialty}</p>
                )}

                <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                  <Mail className="w-4 h-4" />
                  {doctor?.user?.email}
                </p>

                {/* Statistiques rapides - Design cohérent */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-md text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Calendar className="w-4 h-4 text-primary mr-1" />
                      <p className="text-xl font-bold text-card-foreground">
                        {totalAppointments}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">Total RDV</p>
                  </div>
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-md text-center">
                    <div className="flex items-center justify-center mb-1">
                      <CalendarClock className="w-4 h-4 text-primary mr-1" />
                      <p className="text-xl font-bold text-card-foreground">
                        {upcomingAppointments}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">À venir</p>
                  </div>
                </div>

                <div className="pt-4 w-full">
                  <Button
                    asChild
                    className="w-full h-10 bg-primary hover:bg-primary/90"
                  >
                    <Link
                      href="/doctor/settings"
                      className="flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Modifier le Profil
                    </Link>
                  </Button>
                </div>

                <div className="pt-2 w-full">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    <Link
                      href="/doctor/dashboard"
                      className="flex items-center justify-center gap-2"
                    >
                      <LayoutGrid className="w-4 h-4" />
                      Voir le Tableau de Bord
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* InfoNotice pour la Carte de Profil */}
        <InfoNotice
          icon={<User size={14} />}
          note="Un profil complet améliore la confiance et l'engagement des patients."
        >
          Cette carte de profil montre comment les patients verront vos
          informations lors de la prise de rendez-vous.
        </InfoNotice>
      </div>
    </div>
  );
}

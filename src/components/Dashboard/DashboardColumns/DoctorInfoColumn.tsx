import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  UserPlus,
  Stethoscope,
  Award,
  MapPin,
  FileText,
  ClipboardList,
} from "lucide-react";
import { Doctor } from "@/lib/types/core-entities";

type DoctorInfoColumnProps = {
  doctor: Doctor | null;
};

export function DoctorInfoColumn({ doctor }: DoctorInfoColumnProps) {
  return (
    <div className="space-y-6">
      {/* Doctor Info Card */}
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="bg-card border-b border-border p-5 pb-3">
          <div className="flex justify-between items-center pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-white" />
              </div>
              <span className="text-card-foreground">Informations Médecin</span>
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-5 pt-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Spécialité</p>
              <p className="text-sm font-medium text-card-foreground">
                {doctor?.specialty || (
                  <span className="text-muted-foreground italic text-xs">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Numéro de licence</p>
              <p className="text-sm font-medium text-card-foreground">
                {doctor?.licenseNumber || (
                  <span className="text-muted-foreground italic text-xs">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cabinet</p>
              <p className="text-sm font-medium text-card-foreground">
                {doctor?.officeAddress || (
                  <span className="text-muted-foreground italic text-xs">
                    Non renseigné
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-card border-t border-border py-4 px-5">
          <Button
            className="w-full h-10 bg-primary hover:bg-primary/90 transition-all"
            asChild
          >
            <Link
              href="/doctor/profile"
              className="flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Modifier Profil
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="bg-card border-b border-border p-5 pb-3">
          <CardTitle className="flex items-center gap-2 pb4">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">Actions Rapides</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 p-5 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
            asChild
          >
            <Link href="/doctor/patients">
              <Users size={16} className="mr-2" />
              Voir tous les patients
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
            asChild
          >
            <Link href="/doctor/appointment/new">
              <UserPlus size={16} className="mr-2" />
              Planifier un rendez-vous
            </Link>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
            asChild
          >
            <Link href="/doctor/availability">
              <Calendar size={16} className="mr-2" />
              Mettre à jour l&apos;agenda
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

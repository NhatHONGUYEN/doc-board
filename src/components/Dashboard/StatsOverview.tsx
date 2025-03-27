import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import type { Stats } from "@/lib/types/dashboard";
import { cn } from "@/lib/utils";
import { InfoNotice } from "@/components/InfoNotice";

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgClass: string;
  textClass: string;
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  bgClass,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] transition-all duration-300">
      <CardContent className="p-5 relative">
        <div className="flex items-center">
          <div className="relative">
            <div
              className={cn(
                "w-12 h-12 rounded-md flex items-center justify-center",
                bgClass
              )}
            >
              {icon}
            </div>
          </div>
          <div className="ml-4">
            <p className="text-2xl font-bold text-card-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>

        {trend && (
          <div
            className={cn(
              "absolute bottom-5 right-5 flex items-center text-xs font-medium",
              trend.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
            )}
          >
            <ArrowUpRight
              className={cn(
                "h-3.5 w-3.5 mr-0.5",
                !trend.isPositive && "rotate-180"
              )}
            />
            {trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsOverview({ stats }: { stats: Stats }) {
  return (
    <div className="space-y-6 py-10">
      {/* Component Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-card-foreground flex items-center">
          <div className="mr-2 bg-primary/10 p-1.5 rounded">
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </div>
          Indicateurs de Performance
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Patients */}
        <StatCard
          title="Tous les patients"
          value={stats.totalPatients}
          icon={<Users size={24} className="text-primary" />}
          bgClass="bg-primary/10"
          textClass="text-primary"
          // Ne pas passer de trend pour l'instant
        />

        {/* All Appointments */}
        <StatCard
          title="Tous les rendez-vous"
          value={stats.totalAppointments}
          icon={<Calendar size={24} className="text-primary" />}
          bgClass="bg-primary/15"
          textClass="text-primary"
          // Ne pas passer de trend pour l'instant
        />

        {/* Completed Appointments */}
        <StatCard
          title="Rendez-vous terminés"
          value={stats.completedAppointments}
          icon={
            <CheckCircle
              size={24}
              className="text-emerald-600 dark:text-emerald-400"
            />
          }
          bgClass="bg-emerald-100 dark:bg-emerald-900/30"
          textClass="text-emerald-600 dark:text-emerald-400"
          // Ne pas passer de trend pour l'instant
        />

        {/* Cancelled Appointments */}
        <StatCard
          title="Rendez-vous annulés"
          value={stats.cancelledAppointments}
          icon={<XCircle size={24} className="text-destructive" />}
          bgClass="bg-destructive/10"
          textClass="text-destructive"
          // Ne pas passer de trend pour l'instant
        />
      </div>

      {/* Remplacer la notice pour indiquer que les tendances seront disponibles prochainement */}
      <InfoNotice
        icon={<Calendar size={14} />}
        note="Les tendances statistiques comparatives seront disponibles prochainement."
      >
        Ces statistiques représentent votre activité globale actuelle.
      </InfoNotice>
    </div>
  );
}

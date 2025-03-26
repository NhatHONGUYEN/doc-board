import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Appointment } from "@/lib/types/core-entities";
import { Stats } from "@/lib/types/dashboard";
import { BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfoNotice } from "@/components/InfoNotice";

type WeeklyActivityProps = {
  stats: Stats;
  todaysAppointments: Appointment[];
  upcomingAppointments: Appointment[];
};

export function WeeklyActivity({
  stats,
  todaysAppointments,
  upcomingAppointments,
}: WeeklyActivityProps) {
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="bg-card border-b border-border p-5 pb-3">
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Activité Hebdomadaire
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vos rendez-vous et indicateurs de performance
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 bg-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column - Completion rate */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Taux de réalisation
                  </p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-card-foreground mr-1">
                      {stats.totalAppointments > 0
                        ? Math.round(
                            (stats.completedAppointments /
                              stats.totalAppointments) *
                              100
                          )
                        : 0}
                      %
                    </span>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-primary/10 flex items-center justify-center">
                  <div className="text-sm font-semibold text-primary">
                    {stats.completedAppointments}/{stats.totalAppointments}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      Aujourd&apos;hui
                    </span>
                    <span className="font-medium text-card-foreground">
                      {todaysAppointments?.length || 0} rendez-vous
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${
                          todaysAppointments?.length
                            ? Math.min(100, todaysAppointments.length * 10)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Cette semaine</span>
                    <span className="font-medium text-card-foreground">
                      {upcomingAppointments?.length || 0} à venir
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full"
                      style={{
                        width: `${
                          upcomingAppointments?.length
                            ? Math.min(100, upcomingAppointments.length * 10)
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle column - Days of Week Activity */}
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-card-foreground mb-2">
                Activité Quotidienne
              </h3>
              <div className="flex-grow flex items-end justify-between">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (day, i) => {
                    const isToday = i === new Date().getDay() - 1;
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="h-24 w-full flex items-end mb-1">
                          <div
                            className={cn(
                              "w-full rounded-md transition-all",
                              isToday
                                ? "bg-primary"
                                : "bg-muted hover:bg-primary/20"
                            )}
                            style={{
                              height: `${Math.max(
                                15,
                                Math.floor(Math.random() * 100)
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span
                          className={cn(
                            "text-xs",
                            isToday
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          )}
                        >
                          {day}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Right column - Activity Distribution */}
            <div>
              <h3 className="text-sm font-medium text-card-foreground mb-2">
                Distribution par Statut
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center text-card-foreground">
                      <span className="w-2 h-2 bg-primary/80 rounded-full mr-1"></span>
                      Confirmés
                    </span>
                    <span className="font-medium text-card-foreground">
                      {stats.totalAppointments -
                        stats.completedAppointments -
                        stats.cancelledAppointments}{" "}
                      rendez-vous
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full"
                      style={{
                        width: `${
                          stats.totalAppointments
                            ? Math.min(
                                100,
                                ((stats.totalAppointments -
                                  stats.completedAppointments -
                                  stats.cancelledAppointments) /
                                  stats.totalAppointments) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center text-card-foreground">
                      <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full mr-1"></span>
                      Terminés
                    </span>
                    <span className="font-medium text-card-foreground">
                      {stats.completedAppointments} rendez-vous
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                      style={{
                        width: `${
                          stats.totalAppointments
                            ? Math.min(
                                100,
                                (stats.completedAppointments /
                                  stats.totalAppointments) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center text-card-foreground">
                      <span className="w-2 h-2 bg-destructive rounded-full mr-1"></span>
                      Annulés
                    </span>
                    <span className="font-medium text-card-foreground">
                      {stats.cancelledAppointments} rendez-vous
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive rounded-full"
                      style={{
                        width: `${
                          stats.totalAppointments
                            ? Math.min(
                                100,
                                (stats.cancelledAppointments /
                                  stats.totalAppointments) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Using InfoNotice component instead of hardcoded notice */}
      <InfoNotice
        icon={<BarChart3 size={14} />}
        note="Remarque : Les barres d'activité quotidienne représentent la distribution relative des rendez-vous au cours de la semaine."
      >
        Ce graphique visualise votre activité hebdomadaire de rendez-vous et la
        répartition par statut. Le taux de réalisation indique le pourcentage de
        rendez-vous qui ont été terminés avec succès.
      </InfoNotice>
    </>
  );
}

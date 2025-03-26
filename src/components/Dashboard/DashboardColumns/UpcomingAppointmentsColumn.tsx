import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Appointment } from "@/lib/types/core-entities";

type UpcomingAppointmentsProps = {
  appointments: Appointment[];
};

export function UpcomingAppointmentsColumn({
  appointments,
}: UpcomingAppointmentsProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] flex flex-col h-full">
      <CardHeader className="bg-card border-b border-border py-5 pb-3">
        <div className="flex justify-between items-center pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground line-clamp-1">
                Prochains Rendez-vous
              </CardTitle>
              <CardDescription className="text-muted-foreground line-clamp-1">
                Rendez-vous planifiés à venir
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="h-9 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Link href="/doctor/appointment" className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Voir tout
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto p-0 bg-card">
        {appointments && appointments.length > 0 ? (
          <div className="divide-y divide-border">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 hover:bg-primary/5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage
                        src={appointment.patient?.user?.image || ""}
                        alt="Patient"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                        {appointment.patient?.user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {appointment.patient?.user?.name || "Patient"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <CalendarIcon size={14} className="text-primary/70" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-border">•</span>
                        <span>
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {appointment.reason && (
                        <p className="text-xs mt-2 text-muted-foreground line-clamp-1 bg-muted p-2 rounded-md border border-border">
                          {appointment.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20 font-normal"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    {appointment.duration} mins
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center p-4">
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-full mb-4">
              <CalendarIcon size={24} className="text-primary" />
            </div>
            <p className="text-card-foreground font-medium mb-1">
              Aucun rendez-vous à venir
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Votre agenda futur est libre
            </p>
            <Button
              className="h-10 bg-primary hover:bg-primary/90 transition-all"
              asChild
            >
              <Link href="/doctor/availability" className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Mettre à jour disponibilités
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

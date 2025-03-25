// src/components/PatientDashboard/NextAppointmentCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, CalendarClock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Appointment } from "@/lib/types/core-entities";

type NextAppointmentCardProps = {
  appointment: Appointment;
};

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
  return (
    <Card className="mb-8 overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
      <CardHeader className="bg-card border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
            <CalendarClock className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-card-foreground">
              Next Appointment
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Your upcoming medical consultation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <Avatar className="h-16 w-16 border-2 border-background shadow-md">
              <AvatarImage src="" alt="Doctor" />
              <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                {appointment.doctor?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "D"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-1 mb-1">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  {appointment.status}
                </Badge>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-primary text-sm font-medium">
                  {appointment.duration} minutes
                </span>
              </div>

              <h3 className="text-lg font-semibold text-card-foreground">
                Dr. {appointment.doctor?.user?.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {appointment.doctor?.specialty || "General Practitioner"}
              </p>

              <div className="flex items-center gap-1 mt-2 text-sm">
                <Calendar className="h-4 w-4 text-primary/70" />
                <span>
                  {new Date(appointment.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-muted-foreground mx-1">at</span>
                <Clock className="h-4 w-4 text-primary/70" />
                <span>
                  {new Date(appointment.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Link
              href={`/patient/appointment/${appointment.id}`}
              className="flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

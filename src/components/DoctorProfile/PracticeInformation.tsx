import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, CalendarClock, Users } from "lucide-react";
import { InfoNotice } from "@/components/InfoNotice";
import { cn } from "@/lib/utils";

type PracticeInformationProps = {
  totalPatients: number;
  totalAppointments: number;
  upcomingAppointments: number;
};

export function PracticeInformation({
  totalPatients,
  totalAppointments,
  upcomingAppointments,
}: PracticeInformationProps) {
  return (
    <div className="space-y-3 py-4">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <CardHeader className="bg-card border-b border-border">
          <div className="flex justify-between items-center pb-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary/70" />
                Practice Information
              </CardTitle>
              <CardDescription>
                Your practice details and patient statistics
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-card">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              label="Total Patients"
              value={totalPatients}
              icon={<Users className="h-5 w-5 text-primary" />}
              bgClass="bg-primary/5"
            />
            <StatsCard
              label="Total Appointments"
              value={totalAppointments}
              icon={<Calendar className="h-5 w-5 text-primary" />}
              bgClass="bg-primary/10"
            />
            <StatsCard
              label="Upcoming Appointments"
              value={upcomingAppointments}
              icon={<CalendarClock className="h-5 w-5 text-primary" />}
              bgClass="bg-primary/15"
            />
          </div>
        </CardContent>
      </Card>

      {/* InfoNotice for Practice Information */}
      <InfoNotice icon={<Users size={14} />}>
        These statistics reflect your practice activity and patient engagement
        over time.
        <span className="font-medium block mt-1 text-blue-200">
          Data is updated in real-time as appointments are scheduled and
          completed.
        </span>
      </InfoNotice>
    </div>
  );
}

// Helper component - stats card
type StatsCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgClass: string;
};

function StatsCard({ label, value, icon, bgClass }: StatsCardProps) {
  return (
    <div className="flex items-center space-x-4 p-4 rounded-md border border-border">
      <div className={cn("p-3 rounded-md", bgClass)}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-card-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

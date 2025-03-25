// src/components/PatientDashboard/StatsOverview.tsx
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Shield, User, ArrowRight, Info } from "lucide-react";
import { InfoNotice } from "@/components/InfoNotice";

type StatsOverviewProps = {
  upcomingAppointmentsCount: number;
  hasMedicalHistory: boolean;
  isProfileComplete: boolean;
};

export function StatsOverview({
  upcomingAppointmentsCount,
  hasMedicalHistory,
  isProfileComplete,
}: StatsOverviewProps) {
  return (
    <div className="space-y-3 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Upcoming Appointments
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {upcomingAppointmentsCount}
                  </p>
                  <Link
                    href="/patient/appointment"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Medical History</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {hasMedicalHistory ? "Complete" : "Incomplete"}
                  </p>
                  <Link
                    href="/patient/medical-history"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profile Status</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold text-card-foreground">
                    {isProfileComplete ? "Complete" : "Incomplete"}
                  </p>
                  <Link
                    href="/patient/profile"
                    className="text-primary hover:underline text-xs ml-1"
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* InfoNotice added below the stats cards */}
      <InfoNotice
        icon={<Info size={14} />}
        note="Complete your profile and medical history to help doctors provide better care."
      >
        These statistics provide a quick overview of your account status. Click
        on any card to manage the corresponding information.
      </InfoNotice>
    </div>
  );
}

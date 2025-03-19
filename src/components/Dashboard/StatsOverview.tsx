import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, CheckCircle, XCircle } from "lucide-react";
import type { Stats } from "@/lib/types/dashboard"; // We'll create this type file

// If you prefer to import directly from the store:
// import type { Stats } from "@/lib/store/useDoctorDashboardStore";

export function StatsOverview({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {/* Total Patients */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all group">
        <CardContent className="p-5 relative">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-blue-600">+</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">{stats.totalPatients}</p>
              <p className="text-xs text-muted-foreground">Total Patients</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Appointments */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all group">
        <CardContent className="p-5 relative">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-purple-600">
                  {stats.totalAppointments}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">{stats.totalAppointments}</p>
              <p className="text-xs text-muted-foreground">All Appointments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Appointments */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all group">
        <CardContent className="p-5 relative">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle
                  size={20}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-green-600">
                  {stats.completedAppointments}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {stats.completedAppointments}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancelled Appointments */}
      <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all group">
        <CardContent className="p-5 relative">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-red-600">
                  {stats.cancelledAppointments}
                </span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold">
                {stats.cancelledAppointments}
              </p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Appointment } from "@/lib/types/core-entities";
import { Stats } from "@/lib/types/dashboard";

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
    <Card className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 text-white"
            >
              <path d="M12 20V10"></path>
              <path d="M18 20V4"></path>
              <path d="M6 20v-4"></path>
            </svg>
          </div>
          Weekly Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Completion rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-1">
                    {stats.totalAppointments > 0
                      ? Math.round(
                          (stats.completedAppointments /
                            stats.totalAppointments) *
                            100
                        )
                      : 0}
                    %
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-green-500"
                  >
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                    <polyline points="16 7 22 7 22 13"></polyline>
                  </svg>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full border-4 border-green-100 dark:border-green-900/30 flex items-center justify-center">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {stats.completedAppointments}/{stats.totalAppointments}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Today</span>
                  <span className="font-medium">
                    {todaysAppointments?.length || 0} appointments
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
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
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-medium">
                    {upcomingAppointments?.length || 0} upcoming
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
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
            <h3 className="text-sm font-medium mb-2">Daily Activity</h3>
            <div className="flex-grow flex items-end justify-between">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-24 w-full rounded-md flex items-end mb-1">
                      <div
                        className={`w-full ${
                          i === new Date().getDay() - 1
                            ? "bg-green-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        } rounded-md`}
                        style={{
                          height: `${Math.max(
                            15,
                            Math.floor(Math.random() * 100)
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{day}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right column - Activity Distribution */}
          <div>
            <h3 className="text-sm font-medium mb-2">Distribution by Status</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Confirmed
                  </span>
                  <span className="font-medium">
                    {stats.totalAppointments -
                      stats.completedAppointments -
                      stats.cancelledAppointments}{" "}
                    appointments
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
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
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Completed
                  </span>
                  <span className="font-medium">
                    {stats.completedAppointments} appointments
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
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
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                    Cancelled
                  </span>
                  <span className="font-medium">
                    {stats.cancelledAppointments} appointments
                  </span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
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
  );
}

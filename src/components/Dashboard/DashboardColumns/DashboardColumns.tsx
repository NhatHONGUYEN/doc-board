import React from "react";
import {
  Appointment,
  AppointmentStatus,
  Doctor,
} from "@/lib/types/core-entities";
import { TodaysAppointmentsColumn } from "./TodaysAppointmentsColumn";
import { UpcomingAppointmentsColumn } from "./UpcomingAppointmentsColumn";
import { DoctorInfoColumn } from "./DoctorInfoColumn";

type DashboardColumnsProps = {
  doctor: Doctor | null;
  todaysAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  updatingAppointmentId: string | null;
  updateAppointmentStatus: (
    appointmentId: string,
    newStatus: AppointmentStatus
  ) => Promise<void>;
};

export function DashboardColumns({
  doctor,
  todaysAppointments,
  upcomingAppointments,
  updatingAppointmentId,
  updateAppointmentStatus,
}: DashboardColumnsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 auto-rows-max">
      {/* First column - Today's Appointments */}
      <div>
        <TodaysAppointmentsColumn
          appointments={todaysAppointments}
          updatingAppointmentId={updatingAppointmentId}
          updateAppointmentStatus={updateAppointmentStatus}
        />
      </div>

      {/* Second column - Upcoming Appointments */}
      <div>
        <UpcomingAppointmentsColumn appointments={upcomingAppointments} />
      </div>

      {/* Third column - Doctor Info + Quick Actions */}
      <DoctorInfoColumn doctor={doctor} />
    </div>
  );
}

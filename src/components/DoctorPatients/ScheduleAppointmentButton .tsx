import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

type ScheduleAppointmentButtonProps = {
  patientId: string;
  onSchedule: (patientId: string) => void;
  label?: string;
};

export function ScheduleAppointmentButton({
  patientId,
  onSchedule,
  label = "Schedule Appointment",
  ...buttonProps
}: ScheduleAppointmentButtonProps) {
  return (
    <Button onClick={() => onSchedule(patientId)} {...buttonProps}>
      <CalendarPlus className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
}

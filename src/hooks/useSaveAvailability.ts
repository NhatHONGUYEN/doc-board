// src/hooks/useSaveAvailability.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type TimeSlot = {
  start: string; // Format: "HH:MM"
  end: string; // Format: "HH:MM"
};

type WeeklySchedule = {
  [key in DayOfWeek]?: TimeSlot[];
};

type SpecialDate = {
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: TimeSlot[];
};

type SaveAvailabilityParams = {
  doctorId: string;
  weeklySchedule: WeeklySchedule;
  specialDates: SpecialDate[];
};

export function useSaveAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      doctorId,
      weeklySchedule,
      specialDates,
    }: SaveAvailabilityParams) => {
      const response = await fetch(`/api/doctor/${doctorId}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weeklySchedule,
          specialDates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save availability: ${errorData}`);
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ["availability", variables.doctorId],
      });
      toast.success("Availability schedule saved successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to save your availability schedule");
    },
  });
}

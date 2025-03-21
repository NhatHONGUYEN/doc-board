// src/hooks/useAvailabilityData.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Type definitions from your page
type TimeSlot = {
  startTime: string;
  endTime: string;
};

type DayAvailability = {
  enabled: boolean;
  slots: TimeSlot[];
};

type WeeklySchedule = {
  [key: number]: DayAvailability;
};

type SpecialDate = {
  id: string;
  date: string;
  type: "dayoff" | "custom";
  slots?: TimeSlot[];
};

type AvailabilityData = {
  weeklySchedule: WeeklySchedule;
  specialDates: SpecialDate[];
};

export function useAvailabilityData(doctorId?: string) {
  const result = useQuery<AvailabilityData>({
    queryKey: ["availability", doctorId],
    queryFn: async () => {
      if (!doctorId) {
        throw new Error("Doctor ID is required");
      }

      const response = await fetch(`/api/doctor/${doctorId}/availability`);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to load availability: ${errorData}`);
      }

      const data = await response.json();
      return {
        weeklySchedule: data.weeklySchedule || {},
        specialDates: data.specialDates || [],
      };
    },
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data won't refetch for 5 minutes
  });

  // Handle errors from the query result
  if (result.error) {
    console.error(result.error);
    toast.error("Failed to load your availability schedule");
  }

  return result;
}

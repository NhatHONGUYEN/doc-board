import { Appointment } from "@/lib/types/core-entities";
import { useQuery } from "@tanstack/react-query";

// Custom hook to fetch appointment by ID
export function useAppointmentById(id: string) {
  return useQuery<Appointment>({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const response = await fetch(`/api/appointments/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch appointment: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
}

// src/lib/hooks/usePatients.ts
import { Patient } from "@/lib/types/core-entities";
import { useQuery } from "@tanstack/react-query";

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("/api/patients");

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

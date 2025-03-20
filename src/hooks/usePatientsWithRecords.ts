// src/hooks/usePatientsWithRecords.tsx
import { useQuery } from "@tanstack/react-query";

import type { PatientRecord } from "@/lib/types/medical-records";

export function usePatientsWithRecords(userId?: string) {
  return useQuery<PatientRecord[], Error>({
    queryKey: ["patientsWithRecords"],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await fetch("/api/patients");

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch patient records: ${errorData}`);
      }

      return response.json();
    },
    enabled: !!userId, // Only run query if userId exists
    retry: 2,
  });
}

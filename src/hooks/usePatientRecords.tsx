// src/hooks/usePatientRecords.ts
import { useQuery } from "@tanstack/react-query";
import { PatientRecord } from "@/lib/types/medical-records";

export function usePatientRecords(patientId: string, userId?: string) {
  return useQuery<PatientRecord, Error>({
    queryKey: ["patientRecords", patientId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const response = await fetch(`/api/patients/${patientId}/records`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch patient records: ${errorText}`);
      }

      return response.json();
    },
    enabled: !!userId && !!patientId, // Only run query if both IDs exist
  });
}

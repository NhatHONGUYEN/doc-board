import { Patient } from "@/lib/types/core-entities";
import { useQuery } from "@tanstack/react-query";

export function usePatientData(userId: string | undefined) {
  return useQuery<Patient, Error>({
    queryKey: ["patient", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const res = await fetch(`/api/patient?userId=${userId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch patient data: ${errorText}`);
      }

      return res.json();
    },
    enabled: !!userId, // Only run the query if userId exists
  });
}

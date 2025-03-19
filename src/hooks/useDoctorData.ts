import { Doctor } from "@/lib/types/core-entities";
import { useQuery } from "@tanstack/react-query";

export function useDoctorData(userId: string | undefined) {
  return useQuery<Doctor, Error>({
    queryKey: ["doctor", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const res = await fetch(`/api/doctor/profile?userId=${userId}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch doctor data: ${errorText}`);
      }

      return res.json();
    },
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
}

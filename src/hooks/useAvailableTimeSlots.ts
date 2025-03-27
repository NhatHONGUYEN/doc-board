// src/hooks/useAvailableTimeSlots.ts
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

// Type de créneau horaire
export type TimeSlot = {
  value: string;
  label: string;
  available: boolean;
};

// Fonction pour formater les créneaux horaires
const formatTimeSlots = (availableSlots: string[]): TimeSlot[] => {
  if (!availableSlots || availableSlots.length === 0) {
    return [];
  }

  // Trier les créneaux horaires pour un affichage correct
  const sortedSlots = [...availableSlots].sort();

  // Créer des créneaux adaptés à l'interface
  return sortedSlots.map((timeString) => {
    const [hour, minute] = timeString.split(":").map(Number);

    // Format d'affichage (format 24h pour la France)
    const displayTime = `${hour}h${minute.toString().padStart(2, "0")}`;

    return {
      value: timeString,
      label: displayTime,
      available: true,
    };
  });
};

/**
 * Hook pour récupérer les créneaux horaires disponibles pour un médecin à une date donnée
 */
export function useAvailableTimeSlots(doctorId?: string, date?: Date) {
  const result = useQuery({
    queryKey: [
      "availableTimeSlots",
      doctorId,
      date?.toISOString().split("T")[0],
    ],
    queryFn: async () => {
      if (!doctorId || !date) {
        return { timeSlots: [], availableSlots: [] };
      }

      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(
        `/api/doctor/availability?doctorId=${doctorId}&date=${formattedDate}`
      );

      if (!response.ok) {
        throw new Error("Échec de vérification des disponibilités");
      }

      const data = await response.json();
      const timeSlots = formatTimeSlots(data.availableSlots || []);

      return {
        timeSlots,
        availableSlots: data.availableSlots || [],
      };
    },
    enabled: !!doctorId && !!date,
    staleTime: 1 * 60 * 1000, // Considéré frais pendant 1 minute
  });

  // Handle errors
  if (result.error) {
    toast.error("Échec de vérification des disponibilités");
    console.error(result.error);
  }

  return result;
}

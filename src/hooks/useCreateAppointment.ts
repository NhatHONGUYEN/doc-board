// 1. D'abord, créez un hook personnalisé pour la mutation
// src/hooks/useCreateAppointment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateAppointmentData = {
  doctorId: string;
  date: string;
  duration: number;
  reason?: string;
};

async function createAppointment(data: CreateAppointmentData) {
  const response = await fetch("/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Échec de réservation du rendez-vous");
  }

  return response.json();
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      // Invalider les requêtes qui doivent être rechargées après création
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Rendez-vous pris avec succès");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Échec de réservation du rendez-vous");
      }
    },
  });
}

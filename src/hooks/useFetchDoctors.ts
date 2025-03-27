// src/hooks/useFetchDoctors.ts
import { useQuery } from "@tanstack/react-query";
import { Doctor } from "@/lib/types/core-entities";
import { toast } from "sonner";

async function fetchDoctors(): Promise<Doctor[]> {
  const response = await fetch("/api/allDoctor");

  if (!response.ok) {
    throw new Error("Échec de récupération des médecins");
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Format de données incorrect");
  }

  return data;
}

export function useFetchDoctors() {
  const query = useQuery<Doctor[], Error>({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    staleTime: 5 * 60 * 1000, // Données considérées à jour pendant 5 minutes
    refetchOnWindowFocus: false, // Ne pas recharger quand la fenêtre regagne le focus
  });

  // Handle success case
  if (query.data && query.data.length === 0 && query.isSuccess) {
    toast.info("Aucun médecin disponible dans le système pour l'instant");
  }

  // Handle error case
  if (query.isError) {
    toast.error("Échec du chargement des médecins");
    console.error(query.error);
  }

  return query;
}

// src/components/PatientRecords/PatientNotFound.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function PatientNotFound() {
  const router = useRouter();

  return (
    <div className="container py-10">
      <Card>
        <CardContent className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Patient non trouvé</h1>
          <p>
            Le dossier patient demandé n&apos;existe pas ou vous n&apos;avez pas
            l&apos;autorisation de le consulter.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/doctor/dashboard")}
          >
            Retour au tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

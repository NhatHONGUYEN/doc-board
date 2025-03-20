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
          <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
          <p>
            The requested patient record doesn&apos;t exist or you don&apos;t
            have permission to view it.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push("/doctor/dashboard")}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

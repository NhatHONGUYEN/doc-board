// src/components/Loading.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </CardContent>
    </Card>
  );
}

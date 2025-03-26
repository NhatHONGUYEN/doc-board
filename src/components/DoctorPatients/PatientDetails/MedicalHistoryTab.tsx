import { FileText, PlusSquare, Clipboard } from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type MedicalHistoryTabProps = {
  patient: Patient;
};

export function MedicalHistoryTab({ patient }: MedicalHistoryTabProps) {
  return (
    <TabsContent value="medical">
      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium text-sm flex items-center text-card-foreground">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
              <Clipboard className="h-3 w-3 text-primary" />
            </div>
            Antécédents médicaux
          </h4>

          {patient.medicalHistory ? (
            <ScrollArea className="h-[300px] rounded-md border p-4 bg-card/50">
              <div
                className="text-sm text-card-foreground"
                style={{ whiteSpace: "pre-line" }}
              >
                {patient.medicalHistory}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground border rounded-md bg-card/50 p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <PlusSquare className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">
                Aucun antécédent médical enregistré pour ce patient
              </p>
              <Button
                variant="outline"
                className="mt-4 border-border bg-card hover:bg-primary/10 hover:text-primary transition-all flex items-center gap-1.5"
              >
                <FileText className="h-4 w-4" />
                Ajouter des antécédents médicaux
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}

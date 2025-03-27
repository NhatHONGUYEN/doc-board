// src/components/Appointment/FormActions.tsx
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FormActionsProps = {
  isPending: boolean;
  onCancel: () => void;
};

export function FormActions({ isPending, onCancel }: FormActionsProps) {
  return (
    <div className="flex justify-between w-full">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Réservation en cours..." : "Prendre rendez-vous"}
      </Button>
    </div>
  );
}

import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentFormValues } from "@/lib/schema/appointment";

interface AppointmentNotesProps {
  control: Control<AppointmentFormValues>;
}

export default function AppointmentNotes({ control }: AppointmentNotesProps) {
  return (
    <>
      {/* Motif de la visite */}
      <FormField
        control={control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motif de la visite (Optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brève description du motif du rendez-vous"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Cette information sera visible par le patient.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Notes du médecin */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes du médecin (Optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Notes privées pour votre référence uniquement"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Ces notes ne sont pas partagées avec le patient.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

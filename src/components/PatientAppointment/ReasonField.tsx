// src/components/Appointment/ReasonField.tsx
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "@/lib/schema/patientAppointment";

type ReasonFieldProps = {
  control: Control<AppointmentFormValues>;
};

export function ReasonField({ control }: ReasonFieldProps) {
  return (
    <FormField
      control={control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Motif de la consultation (Facultatif)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Brève description de vos symptômes ou du motif de la consultation"
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Cela aide le médecin à se préparer pour votre rendez-vous.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

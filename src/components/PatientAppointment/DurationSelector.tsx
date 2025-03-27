// src/components/Appointment/DurationSelector.tsx
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "@/lib/schema/patientAppointment";

type DurationSelectorProps = {
  control: Control<AppointmentFormValues>;
};

export function DurationSelector({ control }: DurationSelectorProps) {
  return (
    <FormField
      control={control}
      name="duration"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Durée</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner la durée" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

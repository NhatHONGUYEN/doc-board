import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
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
import { AppointmentFormValues } from "@/lib/schema/appointment";

interface AppointmentDetailsProps {
  control: Control<AppointmentFormValues>;
}

export default function AppointmentDetails({
  control,
}: AppointmentDetailsProps) {
  return (
    <FormField
      control={control}
      name="appointmentType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de rendez-vous</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || "regular"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de rendez-vous" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="regular">Consultation de routine</SelectItem>
              <SelectItem value="followup">Visite de suivi</SelectItem>
              <SelectItem value="urgent">Soins urgents</SelectItem>
              <SelectItem value="procedure">Procédure médicale</SelectItem>
              <SelectItem value="consultation">
                Consultation spécialisée
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Le type de rendez-vous facilite la planification et la préparation.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

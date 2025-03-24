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
          <FormLabel>Appointment Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value || "regular"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="regular">Regular Checkup</SelectItem>
              <SelectItem value="followup">Follow-up Visit</SelectItem>
              <SelectItem value="urgent">Urgent Care</SelectItem>
              <SelectItem value="procedure">Procedure</SelectItem>
              <SelectItem value="consultation">Consultation</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            The type of appointment helps with scheduling and preparation.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

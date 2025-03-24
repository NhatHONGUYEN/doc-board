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
      {/* Reason for Visit */}
      <FormField
        control={control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reason for Visit (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the reason for the appointment"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              This will be visible to the patient.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Doctor Notes */}
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doctor&apos;s Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Private notes for your reference only"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              These notes are not shared with the patient.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// src/components/Appointment/TimeSelector.tsx
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
import { Loader2 } from "lucide-react";
import { Control } from "react-hook-form";
import {
  AppointmentFormValues,
  TimeSlot,
} from "@/lib/schema/patientAppointment";

type TimeSelectorProps = {
  control: Control<AppointmentFormValues>;
  timeSlots: TimeSlot[];
  isCheckingAvailability: boolean;
  hasDoctorAndDate: boolean;
};

export function TimeSelector({
  control,
  timeSlots,
  isCheckingAvailability,
  hasDoctorAndDate,
}: TimeSelectorProps) {
  return (
    <FormField
      control={control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Heure</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isCheckingAvailability || timeSlots.length === 0}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isCheckingAvailability
                      ? "Vérification des disponibilités..."
                      : timeSlots.length === 0 && hasDoctorAndDate
                      ? "Aucun créneau disponible pour ce jour"
                      : timeSlots.length === 0
                      ? "Sélectionnez d'abord un médecin et une date"
                      : "Sélectionner une heure"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isCheckingAvailability ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Vérification des disponibilités...
                </div>
              ) : timeSlots.length === 0 && hasDoctorAndDate ? (
                <div className="p-2 text-center text-muted-foreground">
                  Aucun créneau disponible ce jour. Veuillez sélectionner une
                  autre date.
                </div>
              ) : (
                timeSlots.map((slot) => (
                  <SelectItem key={slot.value} value={slot.value}>
                    {slot.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

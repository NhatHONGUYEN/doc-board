// src/components/Appointment/DoctorSelector.tsx
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
import { AppointmentFormValues } from "@/lib/schema/patientAppointment";
import { Doctor } from "@/lib/types/core-entities";

type DoctorSelectorProps = {
  control: Control<AppointmentFormValues>;
  doctors: Doctor[];
  isLoading: boolean;
};

export function DoctorSelector({
  control,
  doctors,
  isLoading,
}: DoctorSelectorProps) {
  return (
    <FormField
      control={control}
      name="doctorId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Médecin</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoading
                      ? "Chargement des médecins..."
                      : "Sélectionner un médecin"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Chargement...
                </div>
              ) : doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.user.name}
                    {doctor.specialty && ` • ${doctor.specialty}`}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-muted-foreground">
                  Aucun médecin disponible actuellement
                </div>
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

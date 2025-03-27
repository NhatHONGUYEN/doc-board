// src/components/Appointment/DateSelector.tsx
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Control } from "react-hook-form";
import { AppointmentFormValues } from "@/lib/schema/patientAppointment";
import { isToday } from "date-fns";
import { Badge } from "@/components/ui/badge";

type DateSelectorProps = {
  control: Control<AppointmentFormValues>;
};

export function DateSelector({ control }: DateSelectorProps) {
  return (
    <FormField
      control={control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <div className="flex justify-between items-center mb-1.5">
            <FormLabel className="text-base">Date du rendez-vous</FormLabel>
            {field.value && isToday(field.value) && (
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20"
              >
                Aujourd&apos;hui
              </Badge>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "d MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                locale={fr}
                disabled={
                  (date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || // Pas de dates passées
                    date >
                      new Date(new Date().setMonth(new Date().getMonth() + 3)) // Max 3 mois à l'avance
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            Sélectionnez une date pour votre rendez-vous.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

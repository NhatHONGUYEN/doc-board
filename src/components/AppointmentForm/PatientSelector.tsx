import { Control } from "react-hook-form";
import { Search } from "lucide-react";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAppointmentFormStore from "@/lib/store/useAppointmentFormStore";
import { AppointmentFormValues } from "@/lib/schema/appointment";
import { Patient } from "@/lib/types/core-entities";

type PatientSelectorProps = {
  control: Control<AppointmentFormValues>;
  patients: Patient[];
};

export default function PatientSelector({
  control,
  patients,
}: PatientSelectorProps) {
  const { filteredPatients, searchTerm, isLoadingPatients, setSearchTerm } =
    useAppointmentFormStore();

  return (
    <FormField
      control={control}
      name="patientId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Patient</FormLabel>

          {field.value && patients.find((p) => p.id === field.value) ? (
            // Show selected patient with option to change
            <div className="flex items-center justify-between border rounded-md p-3 bg-card">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary mr-3">
                  {patients
                    .find((p) => p.id === field.value)
                    ?.user.name?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-card-foreground">
                    {patients.find((p) => p.id === field.value)?.user.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {patients.find((p) => p.id === field.value)?.user.email}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => field.onChange("")}
                className="hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                Change
              </Button>
            </div>
          ) : (
            // Show search with live results
            <div className="space-y-0 relative">
              <div className="relative">
                <div className="absolute left-2.5 top-2.5 flex items-center justify-center">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Search patients by name or email..."
                  className="pl-9 border-border bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoadingPatients}
                />
              </div>

              {/* Show results immediately below the search box as you type */}
              {searchTerm && !field.value && (
                <div className="absolute z-10 w-full mt-1 border rounded-md bg-card shadow-md max-h-64 overflow-y-auto">
                  {isLoadingPatients ? (
                    <div className="p-4 text-center flex items-center justify-center">
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <p className="text-sm text-muted-foreground">
                        Loading patients...
                      </p>
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className="p-4 text-center flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Search className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-card-foreground">
                        No patients found
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try searching with a different name or email
                      </p>
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <div
                        key={patient.id}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center"
                        onClick={() => field.onChange(patient.id)}
                      >
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary mr-3">
                          {patient.user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase() || "?"}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-card-foreground">
                            {patient.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {patient.user.email}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <FormDescription className="text-xs text-muted-foreground">
            Search by name or email and select a patient.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// src/components/Settings/SettingsMedicalInformation.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PatientProfileFormValues } from "@/lib/schema/patientProfile";
import { FileText, Shield, ClipboardList, AlertCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { InfoNotice } from "@/components/InfoNotice";

type SettingsMedicalInformationProps = {
  form: UseFormReturn<PatientProfileFormValues>;
};

export function SettingsMedicalInformation({
  form,
}: SettingsMedicalInformationProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <CardHeader className="bg-card border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Medical Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your health information and medical details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Social Security Number */}
          <FormField
            control={form.control}
            name="socialSecurityNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-primary/70" />
                  Social Security Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="XXX-XX-XXXX"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Your SSN is securely stored and only used for insurance
                  purposes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Medical History */}
          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5 text-primary/70" />
                  Medical History
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any relevant medical history, allergies, or conditions"
                    className="min-h-32 border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Please include any chronic conditions, allergies, or past
                  surgeries
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* InfoNotice component outside the card */}
      <InfoNotice
        icon={<AlertCircle size={14} />}
        note="Your medical information is protected by HIPAA regulations."
      >
        Providing accurate medical history helps your healthcare providers offer
        better and safer care. This information will only be accessible to your
        authorized healthcare team and is protected by strict privacy laws.
      </InfoNotice>
    </div>
  );
}

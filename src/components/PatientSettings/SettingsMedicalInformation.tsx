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
                Informations médicales
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Mettez à jour vos informations de santé et détails médicaux
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Numéro de sécurité sociale */}
          <FormField
            control={form.control}
            name="socialSecurityNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5 text-primary/70" />
                  Numéro de sécurité sociale
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="X XX XX XX XXX XXX"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Votre numéro de sécurité sociale est stocké de manière
                  sécurisée et utilisé uniquement à des fins d&apos;assurance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Historique médical */}
          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <ClipboardList className="h-3.5 w-3.5 text-primary/70" />
                  Historique médical
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Saisissez tout antécédent médical, allergie ou pathologie pertinente"
                    className="min-h-32 border-border"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Veuillez inclure toute pathologie chronique, allergie ou
                  intervention chirurgicale antérieure
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Composant InfoNotice en dehors de la carte */}
      <InfoNotice
        icon={<AlertCircle size={14} />}
        note="Vos informations médicales sont protégées par la réglementation sur la confidentialité des données de santé."
      >
        Fournir un historique médical précis aide vos professionnels de santé à
        offrir des soins meilleurs et plus sûrs. Ces informations ne seront
        accessibles qu&apos;à votre équipe médicale autorisée et sont protégées
        par des lois strictes sur la confidentialité.
      </InfoNotice>
    </div>
  );
}

// src/components/Settings/SettingsPersonalInformation.tsx
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
import { PatientProfileFormValues } from "@/lib/schema/patientProfile";
import { User, Mail, Calendar, Phone, MapPin, Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { InfoNotice } from "@/components/InfoNotice";

type SettingsPersonalInformationProps = {
  form: UseFormReturn<PatientProfileFormValues>;
};

export function SettingsPersonalInformation({
  form,
}: SettingsPersonalInformationProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <CardHeader className="bg-card border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Informations personnelles
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Mettez à jour vos coordonnées et informations personnelles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Nom */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-primary/70" />
                  Nom complet
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jean Dupont"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-primary/70" />
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date de naissance */}
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary/70" />
                  Date de naissance
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-border" />
                </FormControl>
                <FormDescription className="text-xs">
                  Votre date de naissance aide les médecins à vous prodiguer des
                  soins adaptés
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Téléphone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-primary/70" />
                  Numéro de téléphone
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="06 12 34 56 78"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adresse */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" />
                  Adresse domicile
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 rue Principale, Ville, Code postal"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Composant InfoNotice en dehors de la carte */}
      <InfoNotice
        icon={<Info size={14} />}
        note="Vos informations personnelles sont utilisées uniquement à des fins d'identification et de communication."
      >
        Maintenez vos coordonnées à jour pour recevoir des notifications
        importantes concernant vos rendez-vous et résultats d&apos;examens.
        Votre adresse est nécessaire pour la facturation et les besoins
        d&apos;assurance.
      </InfoNotice>
    </div>
  );
}

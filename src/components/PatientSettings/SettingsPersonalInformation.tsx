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
                Personal Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your personal and contact details
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-primary/70" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
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
                    placeholder="your@email.com"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary/70" />
                  Date of Birth
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="border-border" />
                </FormControl>
                <FormDescription className="text-xs">
                  Your date of birth helps doctors provide appropriate care
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-primary/70" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    className="border-border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" />
                  Home Address
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Main St, City, State, ZIP"
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

      {/* InfoNotice component outside the card */}
      <InfoNotice
        icon={<Info size={14} />}
        note="Your personal information is used for identification and communication purposes only."
      >
        Keep your contact information up to date to receive important
        notifications about appointments and test results. Your address is
        required for billing and insurance purposes.
      </InfoNotice>
    </div>
  );
}

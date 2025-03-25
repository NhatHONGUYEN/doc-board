"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2, AlertTriangle, User, Save } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { usePatientProfileStore } from "@/lib/store/usePatientProfileStore";
import { SettingsPageHeader } from "@/components/PatientSettings/SettingsPageHeader";
import { SettingsPersonalInformation } from "@/components/PatientSettings/SettingsPersonalInformation";
import { SettingsMedicalInformation } from "@/components/PatientSettings/SettingsMedicalInformation";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  medicalHistory: z.string().optional(),
});

// Infer the FormValues type from the schema
export type FormValues = z.infer<typeof formSchema>;

export default function SettingsPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  // Use the profile store
  const { isUpdating, updateProfile } = usePatientProfileStore();
  const queryClient = useQueryClient();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      birthDate: "",
      phone: "",
      address: "",
      socialSecurityNumber: "",
      medicalHistory: "",
    },
  });

  // Update form values when patient data is loaded
  useEffect(() => {
    if (patient) {
      form.reset({
        name: patient.user.name || "",
        email: patient.user.email || "",
        birthDate: patient.birthDate
          ? new Date(patient.birthDate).toISOString().split("T")[0]
          : "",
        phone: patient.phone || "",
        address: patient.address || "",
        socialSecurityNumber: patient.socialSecurityNumber || "",
        medicalHistory: patient.medicalHistory || "",
      });
    }
  }, [patient, form]);

  // Form submission handler using the store
  async function onSubmit(values: FormValues) {
    if (!session?.user?.id) return;

    const success = await updateProfile(session.user.id, values);

    if (success) {
      // Invalidate and refetch patient data
      queryClient.invalidateQueries({ queryKey: ["patient", session.user.id] });
    }
  }

  // Loading component
  const loadingComponent = (
    <div className="flex justify-center py-12">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">
          Loading your profile settings...
        </p>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = () => {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-3 mx-auto mb-4 w-fit">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Error Loading Settings
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {error?.message ||
              "There was a problem loading your profile settings. Please try again."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  };

  // Unauthenticated component
  const unauthenticatedComponent = (
    <div className="flex justify-center py-12">
      <div className="text-center max-w-md">
        <div className="bg-primary/10 rounded-full p-3 mx-auto mb-4 w-fit">
          <User className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-1">
          Authentication Required
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          Please sign in to edit your profile settings.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/api/auth/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <RoleAuthCheck
      allowedRoles="PATIENT"
      loadingComponent={
        isLoading || sessionStatus === "loading" ? loadingComponent : undefined
      }
      unauthenticatedComponent={unauthenticatedComponent}
    >
      {isError ? (
        <ErrorDisplay />
      ) : (
        <div className="container max-w-3xl py-10">
          <SettingsPageHeader />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <SettingsPersonalInformation form={form} />
              <SettingsMedicalInformation form={form} />

              {/* Form Actions */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 bg-card border-border hover:bg-muted transition-all"
                  onClick={() => form.reset()}
                  disabled={isUpdating}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className={cn(
                    "h-10 transition-all",
                    isUpdating
                      ? "bg-primary/80"
                      : "bg-primary hover:bg-primary/90"
                  )}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </RoleAuthCheck>
  );
}

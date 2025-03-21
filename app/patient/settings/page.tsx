"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Save,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Shield,
  ClipboardList,
  ArrowLeft,
} from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

export default function SettingsPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
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

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/patient?userId=${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Invalidate and refetch patient data
      queryClient.invalidateQueries({ queryKey: ["patient", session.user.id] });

      // Use Sonner toast
      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      // Use Sonner toast for errors
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm">
            Loading your profile settings...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
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
            {error.message ||
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
  }

  if (!session) {
    return (
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
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Update your personal and medical information
          </p>
        </div>
        <Button
          variant="outline"
          asChild
          className="h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all self-start"
        >
          <Link href="/patient/profile" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Card */}
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

          {/* Medical Information Card */}
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

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 bg-card border-border hover:bg-muted transition-all"
              onClick={() => form.reset()}
              disabled={isSaving}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className={cn(
                "h-10 transition-all",
                isSaving ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isSaving ? (
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
  );
}

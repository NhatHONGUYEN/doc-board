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
import { Loader2 } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    return <div className="p-8">Loading your profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to edit your profile</div>;
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
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
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
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
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, State, ZIP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Medical Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Update your health information and medical details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Social Security Number */}
              <FormField
                control={form.control}
                name="socialSecurityNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Security Number</FormLabel>
                    <FormControl>
                      <Input placeholder="XXX-XX-XXXX" {...field} />
                    </FormControl>
                    <FormDescription>
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
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any relevant medical history, allergies, or conditions"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please include any chronic conditions, allergies, or past
                      surgeries
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

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
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  FileText,
  Award,
  Save,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { useDoctorData } from "@/hooks/useDoctorData";
import useSessionStore from "@/lib/store/useSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
  officeAddress: z.string().optional(),
  description: z.string().optional(),
});

export default function DoctorSettingsPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useDoctorData(session?.user?.id);

  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      specialty: "",
      licenseNumber: "",
      phone: "",
      officeAddress: "",
      description: "",
    },
  });

  // Update form values when doctor data is loaded
  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.user.name || "",
        email: doctor.user.email || "",
        specialty: doctor.specialty || "",
        licenseNumber: doctor.licenseNumber || "",
        phone: doctor.phone || "",
        officeAddress: doctor.officeAddress || "",
        description: doctor.description || "",
      });
    }
  }, [doctor, form]);

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/doctor/profile?userId=${session.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Invalidate and refetch doctor data
      queryClient.invalidateQueries({ queryKey: ["doctor", session.user.id] });

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
            Error Loading Profile
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {error.message ||
              "There was a problem loading your profile. Please try again."}
          </p>
          <Button asChild>
            <Link href="/doctor/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-muted rounded-full p-3 mx-auto mb-4 w-fit">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Authentication Required
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Please sign in to edit your profile settings.
          </p>
          <Button asChild>
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    const values = form.getValues();
    const fields = [
      values.name,
      values.email,
      values.specialty,
      values.licenseNumber,
      values.phone,
      values.officeAddress,
      values.description,
    ];

    const filledFields = fields.filter(
      (field) => field && field.trim().length > 0
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Doctor Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Update your profile information and practice details
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-9 border-border hover:bg-muted transition-colors"
        >
          <Link href="/doctor/profile" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information Card */}
          <Card className="border-border overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="bg-card border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 ">
                <User className="h-5 w-5 text-primary/70" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-card">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <User className="h-4 w-4 mr-2 text-primary/70" />
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dr. Jane Smith"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
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
                    <FormLabel className="flex items-center text-card-foreground">
                      <Mail className="h-4 w-4 mr-2 text-primary/70" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
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
                    <FormLabel className="flex items-center text-card-foreground">
                      <Phone className="h-4 w-4 mr-2 text-primary/70" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Contact number for patients and staff
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Office Address */}
              <FormField
                control={form.control}
                name="officeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                      Office Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Medical Plaza, Suite 100, City, State, ZIP"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Where patients can visit you for appointments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Professional Information Card */}
          <Card className="border-border overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="bg-card border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary/70" />
                Professional Information
              </CardTitle>
              <CardDescription>
                Update your professional and practice details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-card">
              {/* Specialty */}
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <Award className="h-4 w-4 mr-2 text-primary/70" />
                      Medical Specialty
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cardiology, Family Medicine, etc."
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Your area of medical expertise
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* License Number */}
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <FileText className="h-4 w-4 mr-2 text-primary/70" />
                      Medical License Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MD12345678"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Your official medical license identification
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Professional Bio */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <FileText className="h-4 w-4 mr-2 text-primary/70" />
                      Professional Bio
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your professional background, expertise, and approach to patient care"
                        className="min-h-32 border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      This description will be visible to patients when booking
                      appointments
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="bg-card border-t border-border py-4 px-6">
              <div className="flex items-center text-sm text-primary/70">
                <span className="font-medium mr-2">Profile Completeness:</span>
                <div className="h-2 w-40 bg-muted rounded-full overflow-hidden mr-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${calculateProfileCompleteness()}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs">
                  {calculateProfileCompleteness()}%
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
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

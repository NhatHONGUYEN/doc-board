"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  Mail,
  Shield,
  Clock,
  Loader2,
  AlertTriangle,
  FileText,
  Edit,
} from "lucide-react";

import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PatientProfilePage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm">
            Loading your profile...
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
            Please sign in to view your profile.
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/api/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculate profile completeness
  const requiredFields = [
    "phone",
    "address",
    "birthDate",
    "socialSecurityNumber",
  ];
  const completedFields = requiredFields.filter(
    (field) => !!patient?.[field as keyof typeof patient]
  ).length;
  const completionPercentage = Math.round(
    (completedFields / requiredFields.length) * 100
  );

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-card-foreground">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your personal information
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 mb-8">
        <CardHeader className="bg-card border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Profile Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your account information and status
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="flex flex-col items-center">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl mb-2">
                <AvatarImage
                  src={session.user.image || ""}
                  alt="Profile picture"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-4xl font-semibold">
                  {patient?.user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "P"}
                </AvatarFallback>
              </Avatar>
              <Badge
                variant="outline"
                className={cn(
                  completionPercentage === 100
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/30"
                    : "bg-primary/10 text-primary border-primary/20"
                )}
              >
                {completionPercentage === 100 ? "Complete" : "Incomplete"}
              </Badge>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="space-y-2 mb-4">
                <h2 className="text-xl font-semibold text-card-foreground">
                  {patient?.user?.name || "Patient"}
                </h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2 text-muted-foreground">
                  <div className="flex items-center justify-center md:justify-start gap-1">
                    <Mail className="h-4 w-4 text-primary/70" />
                    <span>{patient?.user?.email}</span>
                  </div>
                  {patient?.phone && (
                    <div className="flex items-center justify-center md:justify-start gap-1">
                      <span className="hidden md:inline text-border">•</span>
                      <Phone className="h-4 w-4 text-primary/70" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-1">
                <div
                  className={cn(
                    "h-full rounded-full",
                    completionPercentage === 100
                      ? "bg-emerald-500 dark:bg-emerald-400"
                      : "bg-primary"
                  )}
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Profile Completeness: {completionPercentage}%
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 border-t border-border py-4 px-6">
          <Button
            asChild
            className="h-10 bg-primary hover:bg-primary/90 transition-all"
          >
            <Link href="/patient/settings" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Personal Information */}
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 mb-8">
        <CardHeader className="bg-card border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Personal Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your personal and contact details
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary/70" />
                {patient?.user?.name || (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/70" />
                {patient?.user?.email}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                {patient?.birthDate ? (
                  new Date(patient.birthDate).toLocaleDateString()
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary/70" />
                {patient?.phone || (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                {patient?.address || (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                Social Security Number
              </p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary/70" />
                {patient?.socialSecurityNumber ? (
                  <span>••••••{patient.socialSecurityNumber.slice(-4)}</span>
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 border-t border-border py-4 px-6">
          <div className="flex items-center text-sm text-primary/70">
            <Clock className="mr-2 h-4 w-4" />
            <span className="font-medium mr-1">Last updated:</span>
            <span>
              {patient?.updatedAt
                ? new Date(patient.updatedAt).toLocaleDateString()
                : "Never updated"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

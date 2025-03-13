"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Phone, User, Calendar } from "lucide-react";
import Image from "next/image";
import { usePatientData } from "@/hooks/usePatientData";
import useSessionStore from "@/lib/store/useSessionStore";

export default function ProfilePage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: patient,
    isLoading,
    isError,
    error,
  } = usePatientData(session?.user?.id);

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view your profile</div>;
  }

  return (
    <div className="container max-w-3xl py-10">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="relative h-32 w-32">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="Profile picture"
              fill
              className="rounded-full object-cover border-4 border-background"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {patient?.user?.name || "Patient"}
          </h1>
          <p className="text-muted-foreground">{patient?.user?.email}</p>
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal and contact details
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/patient/settings">Edit</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">
                {patient?.user?.name || "Not provided"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{patient?.user?.email}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium flex items-center gap-2">
                {patient?.birthDate ? (
                  <>
                    <Calendar className="h-4 w-4" />
                    {new Date(patient.birthDate).toLocaleDateString()}
                  </>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium flex items-center gap-2">
                {patient?.phone ? (
                  <>
                    <Phone className="h-4 w-4" />
                    {patient.phone}
                  </>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium flex items-center gap-2">
                {patient?.address ? (
                  <>
                    <MapPin className="h-4 w-4" />
                    {patient.address}
                  </>
                ) : (
                  "Not provided"
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                Social Security Number
              </p>
              <p className="font-medium">
                {patient?.socialSecurityNumber || "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
import { MapPin, Phone, User, Award, FileText, Calendar } from "lucide-react";
import Image from "next/image";
import { useDoctorData } from "@/hooks/useDoctorData";
import useSessionStore from "@/lib/store/useSessionStore";
import { Badge } from "@/components/ui/badge";

export default function DoctorProfilePage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useDoctorData(session?.user?.id);

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view your profile</div>;
  }

  // Calculate some stats
  const totalAppointments = doctor?.appointments?.length || 0;
  const upcomingAppointments =
    doctor?.appointments?.filter(
      (apt) => new Date(apt.date) > new Date() && apt.status !== "cancelled"
    ).length || 0;

  return (
    <div className="container py-10">
      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Info cards */}
        <div className="md:col-span-2 space-y-6">
          {/* Page title */}
          <div>
            <h1 className="text-2xl font-bold">Doctor Profile</h1>
            <p className="text-muted-foreground">
              Manage your professional information and availability
            </p>
          </div>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Your credentials and professional details
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/doctor/settings">Edit</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    Dr. {doctor?.user?.name || "Not provided"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{doctor?.user?.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Specialty</p>
                  <p className="font-medium flex items-center gap-2">
                    {doctor?.specialty ? (
                      <>
                        <Award className="h-4 w-4" />
                        {doctor.specialty}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    License Number
                  </p>
                  <p className="font-medium flex items-center gap-2">
                    {doctor?.licenseNumber ? (
                      <>
                        <FileText className="h-4 w-4" />
                        {doctor.licenseNumber}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium flex items-center gap-2">
                    {doctor?.phone ? (
                      <>
                        <Phone className="h-4 w-4" />
                        {doctor.phone}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Office Address
                  </p>
                  <p className="font-medium flex items-center gap-2">
                    {doctor?.officeAddress ? (
                      <>
                        <MapPin className="h-4 w-4" />
                        {doctor.officeAddress}
                      </>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>

                <div className="md:col-span-2 space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">
                    {doctor?.description || "No description provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability card remains unchanged */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Availability Schedule</CardTitle>
                  <CardDescription>
                    When you&apos;re available for appointments
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/doctor/availability">Manage</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {doctor?.availabilities && doctor.availabilities.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {doctor.availabilities.map((availability) => {
                    // Convert day number to day name
                    const days = [
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                      "Sun",
                    ];
                    const dayName = days[availability.day - 1] || "Unknown";

                    return (
                      <div
                        key={availability.id}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
                      >
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">{dayName}</span>
                        </div>
                        <span>
                          {availability.startTime} - {availability.endTime}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-6">
                  No availability schedule set. Click &quot;Manage&quot; to add
                  your working hours.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Profile card */}
        <div className="md:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="pt-6">
              {/* Profile Header - Now in the right column */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative h-40 w-40">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile picture"
                      fill
                      className="rounded-full object-cover border-4 border-background"
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-20 w-20 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">
                      Dr. {doctor?.user?.name || "Doctor"}
                    </h2>
                    <Badge variant="outline" className="mt-1">
                      Doctor
                    </Badge>
                  </div>

                  {doctor?.specialty && (
                    <p className="text-primary font-medium">
                      {doctor.specialty}
                    </p>
                  )}

                  <p className="text-muted-foreground text-sm">
                    {doctor?.user?.email}
                  </p>

                  {/* Quick Stats - Moved here from left column */}
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    <div className="p-3 bg-secondary/50 rounded-md text-center">
                      <p className="text-xl font-bold">{totalAppointments}</p>
                      <p className="text-xs text-muted-foreground">
                        Total Appts
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/50 rounded-md text-center">
                      <p className="text-xl font-bold">
                        {upcomingAppointments}
                      </p>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                    </div>
                  </div>

                  <div className="pt-4 w-full">
                    <Button asChild className="w-full">
                      <Link href="/doctor/settings">Edit Profile</Link>
                    </Button>
                  </div>

                  <div className="pt-2 w-full">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/doctor/dashboard">View Dashboard</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

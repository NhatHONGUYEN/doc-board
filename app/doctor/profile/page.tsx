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
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-bold">
              Dr. {doctor?.user?.name || "Doctor"}
            </h1>
            <Badge variant="outline" className="ml-1">
              Doctor
            </Badge>
          </div>
          <p className="text-muted-foreground">{doctor?.user?.email}</p>
          {doctor?.specialty && (
            <p className="text-primary font-medium mt-1">{doctor.specialty}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{totalAppointments}</p>
              <p className="text-sm text-muted-foreground">
                Total Appointments
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{upcomingAppointments}</p>
              <p className="text-sm text-muted-foreground">
                Upcoming Appointments
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Information */}
      <Card className="mb-6">
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
              <p className="text-sm text-muted-foreground">License Number</p>
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
              <p className="text-sm text-muted-foreground">Office Address</p>
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

      {/* Availability */}
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
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
              No availability schedule set. Click &quot;Manage&quot; to add your
              working hours.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

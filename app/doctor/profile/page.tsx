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
import { MapPin, Phone, User, Award, FileText } from "lucide-react";
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

  // Calculate some stats
  const totalAppointments = doctor?.appointments?.length || 0;
  const upcomingAppointments =
    doctor?.appointments?.filter(
      (apt) => new Date(apt.date) > new Date() && apt.status !== "cancelled"
    ).length || 0;

  if (sessionStatus === "loading" || isLoading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view your profile</div>;
  }

  // Rest of your component remains the same...

  // Update the availability card content with the enhanced data
  return (
    <div className="container py-16">
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

          {/* Removed Availability Schedule Card */}
        </div>

        {/* Right column - Profile card with colorful elements */}
        <div className="md:col-span-1">
          <Card className="sticky top-20 overflow-hidden">
            {/* Add a colorful banner/header */}
            <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>

            <CardContent className="pt-0 relative">
              {/* Profile image overlapping the banner */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative h-32 w-32 -mt-16 rounded-full border-4 border-background shadow-lg">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="Profile picture"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-16 w-16 text-blue-500" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold">
                      Dr. {doctor?.user?.name || "Doctor"}
                    </h2>
                    <Badge className="mt-1 bg-blue-500 hover:bg-blue-600 text-white">
                      Doctor
                    </Badge>
                  </div>

                  {doctor?.specialty && (
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      {doctor.specialty}
                    </p>
                  )}

                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                      />
                    </svg>
                    {doctor?.user?.email}
                  </p>

                  {/* Quick Stats - Enhanced with color */}
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-md text-center">
                      <div className="flex items-center justify-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-blue-500 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                          />
                        </svg>
                        <p className="text-xl font-bold">{totalAppointments}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total Appts
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800 rounded-md text-center">
                      <div className="flex items-center justify-center mb-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4 text-green-500 mr-1"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008Z"
                          />
                        </svg>
                        <p className="text-xl font-bold">
                          {upcomingAppointments}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">Upcoming</p>
                    </div>
                  </div>

                  <div className="pt-4 w-full">
                    <Button
                      asChild
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      <Link
                        href="/doctor/settings"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                          />
                        </svg>
                        Edit Profile
                      </Link>
                    </Button>
                  </div>

                  <div className="pt-2 w-full">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Link
                        href="/doctor/dashboard"
                        className="flex items-center justify-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                          />
                        </svg>
                        View Dashboard
                      </Link>
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

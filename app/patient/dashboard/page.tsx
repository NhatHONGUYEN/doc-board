"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, FileText, User } from "lucide-react";

type Patient = {
  id: string;
  userId: string;
  birthDate: string | null;
  address: string | null;
  phone: string | null;
  socialSecurityNumber: string | null;
  medicalHistory: string | null;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
  appointments: Array<{
    id: string;
    date: string;
    duration: number;
    reason: string | null;
    notes: string | null;
    status: string;
    doctor: {
      id: string;
      specialty: string | null;
      user: {
        name: string;
      };
    };
  }>;
};

export default function PatientDashboard() {
  const { data: session, status } = useSession();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPatientData(session.user.id);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const fetchPatientData = async (userId: string) => {
    try {
      const res = await fetch(`/api/patient?userId=${userId}`);
      console.log("API response status:", res.status);

      if (res.ok) {
        const data = await res.json();
        console.log("Patient data received:", data);
        setPatient(data);
      } else {
        console.error("Failed to fetch patient data:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="p-8">Loading your dashboard...</div>;
  }

  if (!session) {
    return <div className="p-8">Please sign in to view your dashboard</div>;
  }

  // Calculate upcoming appointments
  const now = new Date();
  const upcomingAppointments = patient?.appointments
    ?.filter((apt) => new Date(apt.date) > now && apt.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <Calendar size={24} className="text-primary" />
              <h3 className="text-2xl font-bold">
                {upcomingAppointments?.length || 0}
              </h3>
              <p className="text-muted-foreground">Upcoming Appointments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <FileText size={24} className="text-primary" />
              <h3 className="text-2xl font-bold">
                {patient?.medicalHistory ? "Available" : "Not Set"}
              </h3>
              <p className="text-muted-foreground">Medical History</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2 items-center">
              <User size={24} className="text-primary" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {patient?.user?.name || "No name"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {patient?.user?.email || "No email"}
                </p>
              </div>
              <p className="text-muted-foreground">Profile Information</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your scheduled medical appointments
              </CardDescription>
            </div>
            <Button asChild size="sm">
              <Link href="/patient/appointments">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2 font-medium">
                          <Calendar className="h-4 w-4" />
                          {new Date(apt.date).toLocaleDateString()}
                          <Clock className="h-4 w-4 ml-2" />
                          {new Date(apt.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <p className="text-sm mt-1">
                          With Dr. {apt.doctor.user.name}
                          {apt.doctor.specialty && ` • ${apt.doctor.specialty}`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {apt.reason || "General consultation"}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button asChild className="mt-4">
                <Link href="/patient/appointments/new">Book Appointment</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Information Summary */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/patient/profile">View Full Profile</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{patient?.user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{patient?.user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{patient?.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {patient?.birthDate
                  ? new Date(patient.birthDate).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

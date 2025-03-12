"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Define types based on your Prisma schema
type User = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: "PATIENT" | "DOCTOR";
};

type Doctor = {
  id: string;
  userId: string;
  specialty?: string | null;
  licenseNumber?: string | null;
  phone?: string | null;
  officeAddress?: string | null;
  description?: string | null;
  user: User;
};

type Appointment = {
  id: string;
  date: string;
  duration: number;
  reason?: string | null;
  notes?: string | null;
  status: string;
  patientId: string;
  doctorId: string;
  doctor?: Doctor;
  createdAt: string;
  updatedAt: string;
};

type Patient = {
  id: string;
  userId: string;
  birthDate?: string | null;
  address?: string | null;
  phone?: string | null;
  socialSecurityNumber?: string | null;
  medicalHistory?: string | null;
  user: User;
  appointments: Appointment[];
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchPatientData(session.user.id);
    }
  }, [session]);

  const fetchPatientData = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
      }
    } catch (error) {
      console.error("Failed to fetch patient data", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }

  if (!session) {
    return (
      <div className="p-8 text-center">Please sign in to view your profile</div>
    );
  }

  return (
    <div>
      <div className="container py-10 flex justify-between gap-x-6">
        {/* Colonne 1 : Infos du patient */}
        <div className="w-1/3 space-y-6">
          {/* Profil */}
          <Card>
            <CardContent className="flex flex-col items-center p-6">
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
                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <h1 className="text-xl font-bold mt-4">
                {patient?.user?.name || "Patient"}
              </h1>
              <p className="text-muted-foreground">{patient?.user?.email}</p>
            </CardContent>
          </Card>

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Email:</strong> {patient?.user?.email || "Not provided"}
              </p>
              <p>
                <strong>Phone:</strong> {patient?.phone || "Not provided"}
              </p>
              <p>
                <strong>Address:</strong> {patient?.address || "Not provided"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Colonne 2 : Informations médicales */}
        <div className="w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Social Security Number:</strong>{" "}
                {patient?.socialSecurityNumber || "Not provided"}
              </p>
              <p>
                <strong>Medical History:</strong>
              </p>
              <div className="bg-secondary/20 p-3 rounded-md min-h-24">
                {patient?.medicalHistory || "No medical history provided"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne 3 : Rendez-vous */}
        <div className="w-1/3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>My Appointments</CardTitle>
              <Button size="sm" asChild>
                <Link href="/appointment/new">Book Appointment</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {(patient?.appointments || []).length > 0 ? (
                patient?.appointments.map((appointment: Appointment) => (
                  <Card key={appointment.id} className="mb-4">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <p>{new Date(appointment.date).toLocaleDateString()}</p>
                        <Clock className="h-4 w-4 text-primary ml-2" />
                        <p>
                          {new Date(appointment.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-sm">
                        {appointment.doctor?.user?.name || "Doctor"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.reason || "Consultation"}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10">
                  <h3 className="font-medium">No appointments yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Book your first appointment to get started
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/appointment/new">Book Appointment</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

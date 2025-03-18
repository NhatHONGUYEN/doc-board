import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get current session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only doctors can access the patient list
    if (session.user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can access patient list" },
        { status: 403 }
      );
    }

    // Get the doctor's ID from their user ID
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    // Find patients who have appointments with this doctor
    const patients = await prisma.patient.findMany({
      where: {
        appointments: {
          some: {
            doctorId: doctor.id,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
          },
        },
        // Include only appointments with this doctor
        appointments: {
          where: {
            doctorId: doctor.id,
          },
          select: {
            id: true,
            date: true,
            duration: true,
            reason: true,
            status: true,
            appointmentType: true,
            createdAt: true,
          },
          orderBy: {
            date: "desc",
          },
          // Optionally limit to recent appointments
          take: 5,
        },
      },
      orderBy: {
        user: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

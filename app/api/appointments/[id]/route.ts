import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    // Await the params promise to get the ID
    const params = await context.params;
    const appointmentId = params.id;

    // Get patient ID if patient
    let patientId: string | undefined;
    if (session.user.role === "PATIENT") {
      const patient = await prisma.patient.findFirst({
        where: { userId: session.user.id },
      });

      if (patient) {
        patientId = patient.id;
      }
    }

    // Get doctor ID if doctor
    let doctorId: string | undefined;
    if (session.user.role === "DOCTOR") {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: session.user.id },
      });

      if (doctor) {
        doctorId = doctor.id;
      }
    }

    // Fetch the specific appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Verify the user has permission to view this appointment
    if (
      session.user.role === "PATIENT" &&
      appointment.patientId !== patientId
    ) {
      return NextResponse.json(
        { error: "Not authorized to view this appointment" },
        { status: 403 }
      );
    }

    if (session.user.role === "DOCTOR" && appointment.doctorId !== doctorId) {
      return NextResponse.json(
        { error: "Not authorized to view this appointment" },
        { status: 403 }
      );
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

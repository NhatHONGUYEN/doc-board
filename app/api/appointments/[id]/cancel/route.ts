import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Change this signature to match what Vercel expects
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Access id through context.params instead
    const appointmentId = context.params.id;
    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    // Get current session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Find the appointment
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Check if this user has permission to cancel this appointment
    let hasPermission = false;

    if (session.user.role === "PATIENT") {
      const patient = await prisma.patient.findFirst({
        where: { userId: session.user.id },
      });
      hasPermission = patient?.id === appointment.patientId;
    } else if (session.user.role === "DOCTOR") {
      const doctor = await prisma.doctor.findFirst({
        where: { userId: session.user.id },
      });
      hasPermission = doctor?.id === appointment.doctorId;
    }

    if (!hasPermission) {
      return NextResponse.json(
        { error: "You don't have permission to cancel this appointment" },
        { status: 403 }
      );
    }

    // Cancel the appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "cancelled",
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

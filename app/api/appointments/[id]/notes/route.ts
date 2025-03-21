import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const appointmentId = (await params).id;

    // Get current session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only doctors can add notes to appointments
    if (session.user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can add notes to appointments" },
        { status: 403 }
      );
    }

    // Get doctor ID from session
    const doctor = await prisma.doctor.findFirst({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor record not found" },
        { status: 404 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { notes } = data;

    if (!notes || typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notes are required and must be a string" },
        { status: 400 }
      );
    }

    // Check if appointment exists and belongs to this doctor
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { doctorId: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Make sure the doctor is updating their own appointment
    if (appointment.doctorId !== doctor.id) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to update notes for this appointment",
        },
        { status: 403 }
      );
    }

    // Update the appointment with new notes
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { notes },
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
        patient: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error("Error updating appointment notes:", error);
    return NextResponse.json(
      { error: "Failed to update appointment notes" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

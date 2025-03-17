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

    // Only doctors can update appointment status
    if (session.user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can update appointment status" },
        { status: 403 }
      );
    }

    // Get data from request body
    const data = await request.json();
    const { status, notes } = data;

    // First, check the current status of the appointment
    const currentAppointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { status: true },
    });

    if (!currentAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    // Prevent updating already completed appointments to completed again
    if (currentAppointment.status === "completed" && status === "completed") {
      return NextResponse.json(
        {
          error: "This appointment is already marked as completed",
          appointment: currentAppointment,
        },
        { status: 400 }
      );
    }

    // Update the appointment with new status and/or notes
    const updateData: { status?: string; notes?: string } = {};

    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: updateData,
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

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return NextResponse.json(
      { error: "Failed to update appointment status" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = params.id;

    // Get current session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only doctors can add notes
    if (session.user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can add notes" },
        { status: 403 }
      );
    }

    // Get notes from request body
    const { notes } = await request.json();

    // Update appointment with notes
    const appointment = await prisma.appointment.update({
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

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error adding notes:", error);
    return NextResponse.json({ error: "Failed to add notes" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

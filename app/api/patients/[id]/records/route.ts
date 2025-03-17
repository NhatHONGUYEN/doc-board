import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only doctors can access patient records
    if (session.user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can access patient records" },
        { status: 403 }
      );
    }

    const patientId = (await params).id;

    // Get the patient record with user details and appointments
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        appointments: {
          orderBy: {
            date: "desc",
          },
          select: {
            id: true,
            date: true,
            duration: true,
            reason: true,
            notes: true,
            status: true,
            appointmentType: true,
          },
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient records:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient records" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
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

    // Only doctors can update patient medical history
    if (session.user.role !== "DOCTOR") {
      return NextResponse.json(
        { error: "Only doctors can update patient medical history" },
        { status: 403 }
      );
    }

    // Get the doctor's ID from their user ID
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.user.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const patientId = (await params).id;

    // Check if this doctor has any appointments with this patient
    const hasAppointmentWithPatient = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        patientId: patientId,
      },
    });

    // If no appointment exists, deny access
    if (!hasAppointmentWithPatient) {
      return NextResponse.json(
        {
          error:
            "You don't have permission to update this patient's medical history",
        },
        { status: 403 }
      );
    }

    // Get request body
    const { medicalHistory } = await request.json();

    if (typeof medicalHistory !== "string") {
      return NextResponse.json(
        { error: "Medical history must be a string" },
        { status: 400 }
      );
    }

    // Update the patient's medical history
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: { medicalHistory },
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient medical history:", error);
    return NextResponse.json(
      { error: "Failed to update patient medical history" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

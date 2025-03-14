import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Updated validation schema that supports both patient and doctor-initiated appointments
const appointmentSchema = z.object({
  date: z.string().datetime(),
  duration: z.number().int().min(15).max(120),
  reason: z.string().optional(),
  doctorId: z.string(),
  patientId: z.string().optional(), // Optional - only required when doctor creates appointment
  notes: z.string().optional(),
  appointmentType: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(request: NextRequest) {
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

    // Get appointment data from request body
    const data = await request.json();

    // Validate input data
    const result = appointmentSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid appointment data", details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      date,
      duration,
      reason,
      doctorId,
      patientId,
      notes,
      appointmentType,
      status = "pending",
    } = result.data;

    let finalPatientId: string;

    if (session.user.role === "DOCTOR") {
      // Doctor is creating appointment for a patient
      if (!patientId) {
        return NextResponse.json(
          { error: "Patient ID is required when doctor creates appointment" },
          { status: 400 }
        );
      }

      // Verify the patient exists
      const patient = await prisma.patient.findUnique({
        where: { id: patientId },
      });

      if (!patient) {
        return NextResponse.json(
          { error: "Patient record not found" },
          { status: 404 }
        );
      }

      finalPatientId = patientId;
    } else {
      // Patient is creating their own appointment
      const patient = await prisma.patient.findFirst({
        where: { userId: session.user.id },
      });

      if (!patient) {
        return NextResponse.json(
          { error: "Patient record not found" },
          { status: 404 }
        );
      }

      finalPatientId = patient.id;
    }

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Check if the requested time slot is available
    const appointmentDateTime = new Date(date);
    const endTime = new Date(appointmentDateTime.getTime() + duration * 60000);

    // Check for overlapping appointments with the doctor
    const overlappingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        status: { not: "cancelled" },
        OR: [
          {
            // Starts during another appointment
            date: {
              gte: appointmentDateTime,
              lt: endTime,
            },
          },
          {
            // Ends during another appointment
            AND: [
              {
                date: { lt: appointmentDateTime },
              },
              {
                date: {
                  gte: new Date(appointmentDateTime.getTime() - 60 * 60000),
                },
              },
            ],
          },
        ],
      },
    });

    if (overlappingAppointment) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDateTime,
        duration,
        reason: reason || null,
        notes: notes || null,
        status:
          session.user.role === "DOCTOR" ? status || "confirmed" : "pending",
        patientId: finalPatientId,
        doctorId,
        appointmentType: appointmentType || "regular",
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
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// For getting all appointments (may be needed for admin or doctor view)
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

    // Filter appointments based on role
    const appointments = await prisma.appointment.findMany({
      where: {
        ...(patientId ? { patientId } : {}),
        ...(doctorId ? { doctorId } : {}),
      },
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
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET endpoint to fetch a doctor's availability
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

    const doctorId = (await params).id;

    // Find the doctor's availability
    const availability = await prisma.doctorAvailability.findUnique({
      where: { doctorId },
    });

    // If no availability is set yet, return default data
    if (!availability) {
      return NextResponse.json({
        weeklySchedule: {
          1: {
            enabled: true,
            slots: [{ startTime: "09:00", endTime: "17:00" }],
          },
          2: {
            enabled: true,
            slots: [{ startTime: "09:00", endTime: "17:00" }],
          },
          3: {
            enabled: true,
            slots: [{ startTime: "09:00", endTime: "17:00" }],
          },
          4: {
            enabled: true,
            slots: [{ startTime: "09:00", endTime: "17:00" }],
          },
          5: {
            enabled: true,
            slots: [{ startTime: "09:00", endTime: "17:00" }],
          },
          6: { enabled: false, slots: [] },
          7: { enabled: false, slots: [] },
        },
        specialDates: [],
      });
    }

    // Return the availability data - no parsing needed, Prisma already deserializes JSON
    return NextResponse.json({
      weeklySchedule: availability.weeklySchedule,
      specialDates: availability.specialDates,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST endpoint to save a doctor's availability
export async function POST(
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

    const doctorId = (await params).id;
    const data = await request.json();

    // Update or create availability record
    await prisma.doctorAvailability.upsert({
      where: { doctorId },
      update: {
        weeklySchedule: data.weeklySchedule,
        specialDates: data.specialDates,
      },
      create: {
        doctorId,
        weeklySchedule: data.weeklySchedule,
        specialDates: data.specialDates,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.error("Error saving availability:", error);
    return NextResponse.json(
      { error: "Failed to save availability" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

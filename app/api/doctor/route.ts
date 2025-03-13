import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get("doctorId");
    const dateStr = searchParams.get("date");

    if (!doctorId || !dateStr) {
      return NextResponse.json(
        { error: "Doctor ID and date are required" },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay() || 7; // Convert Sunday (0) to 7 for easier handling

    // Get doctor's schedule for that day of week
    const doctorAvailability = await prisma.availability.findMany({
      where: {
        doctorId: doctorId,
        day: dayOfWeek,
      },
    });

    // Get existing appointments for the doctor on that day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: "cancelled" },
      },
    });

    // Convert availability to time slots
    const availableSlots: string[] = [];

    // For each availability window
    doctorAvailability.forEach((slot) => {
      const [startHour, startMinute] = slot.startTime.split(":").map(Number);
      const [endHour, endMinute] = slot.endTime.split(":").map(Number);

      // Generate 30-minute slots within this window
      for (let h = startHour; h <= endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
          // Skip if this would exceed the end time
          if (h === endHour && m >= endMinute) continue;
          if (h === startHour && m < startMinute) continue;

          const timeString = `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}`;
          availableSlots.push(timeString);
        }
      }
    });

    // Remove slots that overlap with existing appointments
    const bookedSlots = appointments.map((apt) => {
      const aptTime = new Date(apt.date);
      const hour = aptTime.getHours();
      const minute = aptTime.getMinutes();
      return `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
    });

    const finalAvailableSlots = availableSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return NextResponse.json({ availableSlots: finalAvailableSlots });
  } catch (error) {
    console.error("Error checking availability:", error);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

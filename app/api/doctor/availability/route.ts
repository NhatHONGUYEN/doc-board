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
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday (0) to 7 for easier handling

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

    // Create time slots based on availability
    const availableSlots: string[] = [];
    const bookedSlots: string[] = [];

    // If doctor has availability set for this day
    if (doctorAvailability.length > 0) {
      doctorAvailability.forEach((availability) => {
        const [startHour, startMinute] = availability.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = availability.endTime
          .split(":")
          .map(Number);

        // Generate 30-minute slots
        let currentHour = startHour;
        let currentMinute = startMinute;

        while (
          currentHour < endHour ||
          (currentHour === endHour && currentMinute < endMinute)
        ) {
          const timeSlot = `${currentHour
            .toString()
            .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
          availableSlots.push(timeSlot);

          // Advance by 30 minutes
          currentMinute += 30;
          if (currentMinute >= 60) {
            currentHour += 1;
            currentMinute = 0;
          }
        }
      });
    } else {
      // Default working hours if no availability is set (9 AM to 5 PM)
      for (let hour = 9; hour < 17; hour++) {
        for (const minute of [0, 30]) {
          const timeSlot = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          availableSlots.push(timeSlot);
        }
      }
    }

    // Mark booked slots
    appointments.forEach((appointment) => {
      const aptDate = new Date(appointment.date);
      const hour = aptDate.getHours();
      const minute = aptDate.getMinutes();
      const timeSlot = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      bookedSlots.push(timeSlot);
    });

    return NextResponse.json({
      availableSlots,
      bookedSlots,
      doctorAvailability,
    });
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

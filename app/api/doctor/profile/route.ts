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

    // Get userId from query parameter
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user by ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get doctor profile with appointments
    let doctor = await prisma.doctor.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
        appointments: {
          include: {
            patient: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    // Create doctor profile if it doesn't exist
    if (!doctor && user.role === "DOCTOR") {
      doctor = await prisma.doctor.create({
        data: {
          userId: user.id,
          specialty: null,
          licenseNumber: null,
          phone: null,
          officeAddress: null,
          description: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          appointments: {
            include: {
              patient: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                      image: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              date: "desc",
            },
          },
        },
      });
    }

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Error fetching doctor data:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctor data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

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

    // Allow doctors to access patient data
    if (session.user.id !== userId && session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Then try to find patient profile
    const patient = await prisma.patient.findFirst({
      where: {
        userId: userId,
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
            doctor: {
              include: {
                user: {
                  select: {
                    name: true,
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

    // If no patient record exists but user exists with PATIENT role,
    // create a new patient record
    if (!patient && user.role === "PATIENT") {
      // Create a new patient record
      const newPatient = await prisma.patient.create({
        data: {
          userId: user.id,
          // Initialize with empty values that can be filled later
          birthDate: null,
          address: null,
          phone: null,
          socialSecurityNumber: null,
          medicalHistory: null,
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
          appointments: true, // Will be an empty array initially
        },
      });

      return NextResponse.json(newPatient);
    }

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json(
      { error: "Failed to fetch patient data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Add this to your existing file
export async function PUT(request: NextRequest) {
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

    // Allow doctors to update patient records
    if (session.user.id !== userId && session.user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get form data
    const formData = await request.json();

    // Update User record (name and email)
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: formData.name,
        email: formData.email,
      },
    });

    // Update or create Patient record
    const updatedPatient = await prisma.patient.upsert({
      where: { userId: userId },
      update: {
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        phone: formData.phone || null,
        address: formData.address || null,
        socialSecurityNumber: formData.socialSecurityNumber || null,
        medicalHistory: formData.medicalHistory || null,
      },
      create: {
        userId: userId,
        birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
        phone: formData.phone || null,
        address: formData.address || null,
        socialSecurityNumber: formData.socialSecurityNumber || null,
        medicalHistory: formData.medicalHistory || null,
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
            doctor: {
              include: {
                user: {
                  select: {
                    name: true,
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

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient data:", error);
    return NextResponse.json(
      { error: "Failed to update patient data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

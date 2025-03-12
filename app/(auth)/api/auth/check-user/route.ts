// app/api/check-user/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true }, // On récupère juste l'ID pour vérifier l'existence
    });

    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification de l'utilisateur" },
      { status: 500 }
    );
  }
}

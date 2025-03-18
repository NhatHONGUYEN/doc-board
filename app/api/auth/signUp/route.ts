import { NextResponse } from "next/server";
import argon2 from "argon2"; // Importer Argon2
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, email, password, role } = await request.json(); // Ajouter `role` dans la destructuration

  try {
    // 1. Vérifiez si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà." },
        { status: 400 }
      );
    }

    const existingName = await prisma.user.findFirst({
      where: { name },
    });

    if (existingName) {
      return NextResponse.json(
        { message: "Un utilisateur avec ce nom existe déjà." },
        { status: 400 }
      );
    }

    // 2. Valider le rôle
    if (role !== "PATIENT" && role !== "DOCTOR") {
      return NextResponse.json(
        { message: "Le rôle spécifié est invalide." },
        { status: 400 }
      );
    }
    // 3. Hacher le mot de passe avec Argon2
    const hashedPassword = await argon2.hash(password);

    // 4. Créez un nouvel utilisateur avec le mot de passe haché et le rôle
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Stocker le mot de passe haché
        role, // Ajouter le rôle
      },
    });

    // 5. Retourner une réponse réussie
    return NextResponse.json(
      { message: "Utilisateur créé avec succès.", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return NextResponse.json(
      { message: "Une erreur s'est produite lors de l'inscription." },
      { status: 500 }
    );
  }
}

// validations/auth.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

// Définir le schéma pour le rôle
const roleEnum = z.enum(["PATIENT", "DOCTOR"]);

// Extraire le type Role
export type Role = z.infer<typeof roleEnum>;

// Schéma d'inscription
export const signUpSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'email n'est pas valide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: roleEnum, // Utiliser le rôle défini
});

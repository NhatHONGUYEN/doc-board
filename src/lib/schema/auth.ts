// validations/auth.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});

export const signUpSchema = z.object({
  name: z.string().min(1, "Le nom est requis."),
  email: z.string().email("Veuillez entrer un email valide."),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

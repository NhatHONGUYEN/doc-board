import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string | null; // Ajouter le rôle ici
    };
  }
}

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error(
              "Les informations d'identification sont manquantes."
            );
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("Utilisateur non trouvé.");
          }

          if (!user.password) {
            throw new Error("Aucun mot de passe défini pour cet utilisateur.");
          }

          const isValidPassword = await argon2.verify(
            user.password,
            credentials.password
          );

          if (!isValidPassword) {
            throw new Error("Mot de passe incorrect.");
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            role: user.role, // Ajouter le rôle ici
          };
        } catch (error) {
          console.error("Erreur lors de l'authentification :", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        // Correction ici - TypeScript exige un cast explicite
        session.user.role = token.role as string | null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = String(user.id);
        // Assurez-vous que la propriété 'role' est définie sur le token
        // @ts-expect-error - user.role existe mais TypeScript ne le sait pas
        token.role = user.role;
      }
      return token;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

export default NextAuth(authOptions);

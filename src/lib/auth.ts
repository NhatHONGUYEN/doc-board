// lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const prisma = new PrismaClient();

const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
};

// Use NextAuth directly
export const auth = NextAuth(authOptions);

// Export the handlers
export const handlers = {
  GET: auth,
  POST: auth,
};

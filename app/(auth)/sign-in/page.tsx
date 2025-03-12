// app/sign-in/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { signInSchema } from "@/lib/schema/auth";

export default function SignInPage() {
  const router = useRouter();

  // Initialisation de useForm avec Zod
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // Messages d'erreur personnalisés pour les codes d'erreur standard
        if (result.error === "CredentialsSignin") {
          // On tente de vérifier si l'utilisateur existe d'abord
          const userExists = await fetch("/api/auth/check-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: values.email }),
          }).then((res) => res.json());

          if (userExists.exists) {
            // L'utilisateur existe, donc le problème est le mot de passe
            form.setError("password", {
              message: "Mot de passe incorrect.",
            });
          } else {
            // L'utilisateur n'existe pas
            form.setError("email", {
              message: "Cet email ne correspond à aucun compte.",
            });
          }
        } else {
          // Gestion des autres erreurs
          form.setError("root", {
            message:
              "Échec de la connexion. Veuillez vérifier vos identifiants.",
          });
        }
      } else {
        router.push("/");
      }
    } catch {
      form.setError("root", {
        message: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="flex py-32 items-center justify-center">
      <Card className="p-8 w-96">
        <h1 className="text-3xl mb-6 text-center">Connexion</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Champ Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre email" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Champ Mot de passe */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Votre mot de passe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Message d'erreur global */}
            {form.formState.errors.root && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.root.message}
              </p>
            )}

            {/* Bouton de soumission */}
            <Button type="submit" className="w-full">
              Se connecter
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm ">
          Pas encore de compte ?{" "}
          <Link href="/sign-up" className=" text-mute hover:underline">
            S&apos;inscrire
          </Link>
        </p>
      </Card>
    </div>
  );
}

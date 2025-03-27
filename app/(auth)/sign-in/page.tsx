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
import { Logo } from "@/components/logo";
import { ArrowRight, LogIn, Mail, Lock } from "lucide-react";
import { toast } from "sonner"; // Ajoutez cet import en haut du fichier

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
      // D'abord, vérifiez si l'utilisateur existe et récupérez son rôle
      const userCheck = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      }).then((res) => res.json());

      // Si l'utilisateur n'existe pas, affichez une erreur
      if (!userCheck.exists) {
        form.setError("email", {
          message: "Cet email ne correspond à aucun compte.",
        });
        return;
      }

      // Tentative de connexion
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        // Si l'erreur est liée aux identifiants, c'est probablement le mot de passe
        if (result.error === "CredentialsSignin") {
          form.setError("password", {
            message: "Mot de passe incorrect.",
          });
        } else {
          // Gestion des autres erreurs
          form.setError("root", {
            message:
              "Échec de la connexion. Veuillez vérifier vos identifiants.",
          });
        }
      } else {
        // Connexion réussie, rediriger en fonction du rôle récupéré préalablement
        if (userCheck.role === "PATIENT") {
          toast.success(
            "Connexion réussie ! Bienvenue dans votre espace patient.",
            {
              duration: 3000,
            }
          );
          router.push("/patient/dashboard");
        } else if (userCheck.role === "DOCTOR") {
          toast.success(
            "Connexion réussie ! Bienvenue dans votre espace médecin.",
            {
              duration: 3000,
            }
          );
          router.push("/doctor/dashboard");
        } else {
          // Cas par défaut pour tout autre rôle non géré
          toast.success("Connexion réussie !", {
            duration: 3000,
          });
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      form.setError("root", {
        message: "Une erreur est survenue. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12 relative">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
        </div>

        <Card className="overflow-hidden border-none shadow-xl">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2 text-center">Connexion</h1>
            <p className="text-center text-muted-foreground mb-8">
              Accédez à votre espace personnel
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Champ Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Votre email"
                            className="pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Champ Mot de passe */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-sm font-medium">
                          Mot de passe
                        </FormLabel>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Votre mot de passe"
                            className="pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Message d'erreur global */}
                {form.formState.errors.root && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-600 text-sm">
                      {form.formState.errors.root.message}
                    </p>
                  </div>
                )}

                {/* Bouton de soumission */}
                <Button type="submit" className="w-full h-11 font-medium">
                  <LogIn className="mr-2 h-4 w-4" /> Se connecter
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm mt-8 text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link
                href="/sign-up"
                className="text-primary hover:text-primary/90 font-medium inline-flex items-center"
              >
                S&apos;inscrire <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, signUpSchema } from "@/lib/schema/auth";
import { Logo } from "@/components/logo";
import { ArrowLeft, User, Mail, Lock, UserPlus, UserCog } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  // Initialisation de useForm avec Zod
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "PATIENT" as Role,
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Une erreur s'est produite lors de l'inscription."
        );
      }

      router.push("/sign-in");
    } catch (err) {
      if (err instanceof Error) {
        form.setError("root", { message: err.message });
      } else {
        form.setError("root", {
          message: "Une erreur inconnue s'est produite.",
        });
      }
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
            <h1 className="text-3xl font-bold mb-2 text-center">Inscription</h1>
            <p className="text-center text-muted-foreground mb-8">
              Créez votre compte pour commencer
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Champ Nom */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nom complet
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Jean Dupont"
                            className="pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

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
                            placeholder="exemple@email.com"
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
                      <FormLabel className="text-sm font-medium">
                        Mot de passe
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="8 caractères minimum"
                            className="pl-10 h-11"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-xs" />
                    </FormItem>
                  )}
                />

                {/* Champ Rôle */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Type de compte
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 pl-10 relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              {field.value === "PATIENT" ? (
                                <User className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <UserCog className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <SelectValue placeholder="Sélectionnez un rôle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PATIENT">Patient</SelectItem>
                          <SelectItem value="DOCTOR">Médecin</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <UserPlus className="mr-2 h-4 w-4" /> Créer mon compte
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm mt-8 text-muted-foreground">
              Déjà un compte ?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:text-primary/90 font-medium inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-3 w-3" /> Se connecter
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

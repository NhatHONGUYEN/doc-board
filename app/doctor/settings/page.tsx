"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Stethoscope,
  FileText,
  Award,
  Save,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { useDoctorData } from "@/hooks/useDoctorData";
import useSessionStore from "@/lib/store/useSessionStore";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InfoNotice } from "@/components/InfoNotice";

// Schéma du formulaire avec validation
const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Veuillez saisir un email valide"),
  specialty: z.string().optional(),
  licenseNumber: z.string().optional(),
  phone: z.string().optional(),
  officeAddress: z.string().optional(),
  description: z.string().optional(),
});

export default function DoctorSettingsPage() {
  const { session, status: sessionStatus } = useSessionStore();
  const {
    data: doctor,
    isLoading,
    isError,
    error,
  } = useDoctorData(session?.user?.id);

  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  // Initialiser le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      specialty: "",
      licenseNumber: "",
      phone: "",
      officeAddress: "",
      description: "",
    },
  });

  // Mettre à jour les valeurs du formulaire lorsque les données du médecin sont chargées
  useEffect(() => {
    if (doctor) {
      form.reset({
        name: doctor.user.name || "",
        email: doctor.user.email || "",
        specialty: doctor.specialty || "",
        licenseNumber: doctor.licenseNumber || "",
        phone: doctor.phone || "",
        officeAddress: doctor.officeAddress || "",
        description: doctor.description || "",
      });
    }
  }, [doctor, form]);

  // Gestionnaire de soumission du formulaire
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `/api/doctor/profile?userId=${session.user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du profil");
      }

      // Invalider et récupérer à nouveau les données du médecin
      queryClient.invalidateQueries({ queryKey: ["doctor", session.user.id] });

      // Utiliser le toast Sonner
      toast.success("Profil mis à jour", {
        description:
          "Vos informations de profil ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      // Utiliser le toast Sonner pour les erreurs
      toast.error("Erreur", {
        description: "Échec de la mise à jour du profil. Veuillez réessayer.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (sessionStatus === "loading" || isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm">
            Chargement de vos paramètres de profil...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-3 mx-auto mb-4 w-fit">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Erreur de chargement du profil
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            {error.message ||
              "Un problème est survenu lors du chargement de votre profil. Veuillez réessayer."}
          </p>
          <Button asChild>
            <Link href="/doctor/dashboard">Retour au tableau de bord</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-muted rounded-full p-3 mx-auto mb-4 w-fit">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Authentification requise
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            Veuillez vous connecter pour modifier vos paramètres de profil.
          </p>
          <Button asChild>
            <Link href="/api/auth/signin">Se connecter</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Calculer la complétude du profil
  const calculateProfileCompleteness = () => {
    const values = form.getValues();
    const fields = [
      values.name,
      values.email,
      values.specialty,
      values.licenseNumber,
      values.phone,
      values.officeAddress,
      values.description,
    ];

    const filledFields = fields.filter(
      (field) => field && field.trim().length > 0
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-10">
        {/* Section supérieure avec titre et bouton de retour */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-3 p-2.5 bg-primary/10 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">
              Paramètres du profil médecin
            </h1>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-9 border-border hover:bg-muted transition-colors"
          >
            <Link href="/doctor/profile" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Retour au profil
            </Link>
          </Button>
        </div>

        {/* Description avec séparateur visuel */}
        <div className="flex items-center gap-2 mt-2 mb-6">
          <div className="h-0.5 w-8 bg-primary/30 rounded-full"></div>
          <p className="text-muted-foreground">
            Mettez à jour vos informations de profil et les détails de votre
            pratique
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Carte d'informations personnelles */}
          <Card className="border-border overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="bg-card border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2 ">
                <User className="h-5 w-5 text-primary/70" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettre à jour vos informations personnelles et de contact
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-card">
              {/* Nom */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <User className="h-4 w-4 mr-2 text-primary/70" />
                      Nom complet
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dr. Jane Smith"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <Mail className="h-4 w-4 mr-2 text-primary/70" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Téléphone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <Phone className="h-4 w-4 mr-2 text-primary/70" />
                      Numéro de téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+33 6 12 34 56 78"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Numéro de contact pour les patients et le personnel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Adresse du cabinet */}
              <FormField
                control={form.control}
                name="officeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-primary/70" />
                      Adresse du cabinet
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Avenue Médicale, Bureau 100, Ville, Code Postal"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Où les patients peuvent vous consulter pour leurs
                      rendez-vous
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Information personnelle - Notice */}
          <InfoNotice
            icon={<User size={14} />}
            note="Remarque : Fournir des coordonnées claires améliore la communication avec les patients et réduit les rendez-vous manqués."
          >
            Vos coordonnées aident les patients à vous contacter pour les
            rendez-vous et les demandes de renseignements.
          </InfoNotice>

          {/* Carte d'informations professionnelles */}
          <Card className="border-border overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="bg-card border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary/70" />
                Informations professionnelles
              </CardTitle>
              <CardDescription>
                Mettre à jour vos informations professionnelles et de pratique
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 bg-card">
              {/* Spécialité */}
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <Award className="h-4 w-4 mr-2 text-primary/70" />
                      Spécialité médicale
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Cardiologie, Médecine générale, etc."
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Votre domaine d&apos;expertise médicale
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Numéro de licence */}
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <FileText className="h-4 w-4 mr-2 text-primary/70" />
                      Numéro de licence médicale
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MD12345678"
                        className="border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Votre identifiant officiel de licence médicale
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Biographie professionnelle */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-card-foreground">
                      <FileText className="h-4 w-4 mr-2 text-primary/70" />
                      Biographie professionnelle
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Saisissez votre parcours professionnel, votre expertise et votre approche des soins aux patients"
                        className="min-h-32 border-border/30 hover:border-border/50 focus-visible:border-primary/30 focus-visible:ring-primary/20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-muted-foreground pl-6">
                      Cette description sera visible pour les patients lors de
                      la prise de rendez-vous
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="bg-card border-t border-border py-4 px-6">
              <div className="flex items-center text-sm text-primary/70">
                <span className="font-medium mr-2">Complétude du profil :</span>
                <div className="h-2 w-40 bg-muted rounded-full overflow-hidden mr-2">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${calculateProfileCompleteness()}%`,
                    }}
                  ></div>
                </div>
                <span className="text-xs">
                  {calculateProfileCompleteness()}%
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Informations professionnelles - Notice */}
          <InfoNotice
            icon={<Stethoscope size={14} />}
            note="Remarque : Une biographie professionnelle détaillée augmente considérablement la confiance des patients lors du choix d'un médecin."
          >
            Vos informations professionnelles établissent votre crédibilité et
            aident les patients à comprendre votre expertise.
          </InfoNotice>

          {/* Bouton de soumission */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className={cn(
                "h-10 transition-all",
                isSaving ? "bg-primary/80" : "bg-primary hover:bg-primary/90"
              )}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement en cours...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

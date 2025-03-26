"use client";

import { Button } from "@/components/ui/button";
import {
  MoveRight,
  ArrowRight,
  Stethoscope,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

import Link from "next/link";
import { Badge } from "./ui/badge";

export default function Hero() {
  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="text-center">
          <a
            href="#"
            className="mx-auto mb-3 inline-flex items-center gap-3 rounded-full border px-2 py-1 text-sm"
          >
            <Badge>NOUVEAU</Badge>
            Plateforme médicale en ligne
            <span className="flex size-7 items-center justify-center rounded-full bg-muted">
              <ArrowRight className="w-4" />
            </span>
          </a>
          <h1 className="mx-auto mt-4 mb-3 max-w-3xl text-4xl font-semibold text-balance lg:mb-7 lg:text-7xl">
            Votre santé, notre priorité
          </h1>
          <p className="m mx-auto max-w-3xl text-muted-foreground lg:text-xl">
            DocBoard vous connecte avec
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <Stethoscope className="mr-1 w-4 md:w-5" />
              des médecins certifiés
            </span>
            pour
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <Calendar className="mr-1 w-5" />
              des rendez-vous simplifiés
            </span>
            et
            <span className="relative top-[5px] mx-2 inline-flex font-medium text-primary md:top-[3px]">
              <ClipboardCheck className="mr-1 w-5" />
              un suivi médical personnalisé
            </span>
            pour tous vos besoins de santé. Commencez dès aujourd&apos;hui, sans
            engagement.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sign-in">
                Prendre rendez-vous
                <MoveRight className="ml-2" strokeWidth={1} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost">
              <Link href="/sign-up">
                Créer un compte
                <MoveRight className="ml-2" strokeWidth={1} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Calendar, MoveRight, Shield, Clock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const handleSignin = () => {
    router.push("/sign-in");
  };

  const handleSignUp = () => {
    router.push("/sign-up");
  };

  return (
    <section className="py-32">
      <div className="container mx-auto ">
        <div className="text-center">
          <Image
            src="https://ui.shadcn.com/favicon.ico"
            alt="Medical Appointment Platform"
            className="mx-auto mb-5 w-16 md:mb-6 md:w-24 lg:mb-7 lg:w-28"
            width={64}
            height={64}
          />
          <span className="mb-3 text-sm tracking-widest text-muted-foreground md:text-base">
            HEALTHCARE PLATFORM
          </span>
          <h1 className="mt-4 text-balance text-4xl font-semibold lg:text-6xl">
            Book Your Medical Appointments Online
          </h1>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={handleSignin} size="lg">
              Se Connecter
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
            <Button onClick={handleSignUp} size="lg" variant="secondary">
              S&apos;inscrire
              <MoveRight className="ml-2" strokeWidth={1} />
            </Button>
          </div>
          <div className="mt-6 lg:mt-8">
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground lg:text-base">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <Clock className="size-4" />
                Rendez-vous rapides
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <Calendar className="size-4" />
                Disponibilité en temps réel
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <Shield className="size-4" />
                Consultations sécurisées
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

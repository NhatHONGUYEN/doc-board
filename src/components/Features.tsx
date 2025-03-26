import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart3, Calendar, Clock } from "lucide-react";
import { ReactNode } from "react";
import { HeroBackground } from "./HeroBackground";
import { Badge } from "./ui/badge";

export default function Features() {
  return (
    <section className="relative py-16 md:py-32" id="features">
      <HeroBackground />
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <Badge variant="default" className="mb-4">
            💡 Ce que nous offrons
          </Badge>
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Une plateforme complète pour tous les professionnels de santé
          </h2>
          <p className="mt-4">
            Simplifiez la gestion de vos rendez-vous, peu importe votre
            spécialité ou votre mode d&apos;exercice.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <BarChart3 className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium text-blue-600 dark:text-blue-400">
                Suivi des statistiques
              </h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Visualisez en temps réel toutes vos données importantes :
                patients, activité, disponibilités et plus encore.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Calendar className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium text-blue-600 dark:text-blue-400">
                Gestion des rendez-vous
              </h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Planifiez, modifiez ou annulez des rendez-vous en quelques
                clics. Envoyez automatiquement des rappels à vos patients.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Clock className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium text-blue-600 dark:text-blue-400">
                Prise de rendez-vous rapide
              </h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Permettez à vos patients de réserver en ligne 24h/24. Compatible
                avec tous types de consultations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);

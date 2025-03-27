import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { HeroBackground } from "../HeroBackground";
import { Badge } from "../ui/badge";

export default function Pricing() {
  return (
    <div className="relative py-16 md:py-32" id="pricing">
      <HeroBackground />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="default" className="mb-4">
            🚀 Offre de lancement
          </Badge>
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Commencez dès aujourd&apos;hui gratuitement
          </h2>
          <p className="mt-4 text-muted-foreground mx-auto max-w-xl">
            Nous sommes en phase MVP et proposons notre plateforme gratuitement
            pour tous les utilisateurs.
          </p>
        </div>
        <div className="mt-8 md:mt-16">
          <div className="bg-card relative rounded-3xl border shadow-2xl shadow-zinc-950/5 overflow-hidden">
            <div className="grid items-center gap-12 divide-y p-12 md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="pb-12 text-center md:pb-0 md:pr-12">
                <div className="bg-blue-500/10 inline-block rounded-full px-3 py-1 text-sm text-blue-700 dark:text-blue-300 mb-4">
                  <Sparkles className="inline-block mr-1 size-3" /> Version
                  Gratuite
                </div>
                <h3 className="text-2xl font-semibold">Accès Complet</h3>
                <p className="mt-2 text-lg">
                  Pour les patients et les médecins
                </p>
                <span className="mb-6 mt-12 inline-block text-6xl font-bold">
                  <span className="text-blue-500">Gratuit</span>
                </span>

                <div className="flex justify-center">
                  <Button asChild size="lg" className="px-8">
                    <Link href="/sign-up">Créer un compte</Link>
                  </Button>
                </div>

                <p className="text-muted-foreground mt-12 text-sm">
                  Inclus : Sécurité, Stockage des données médicales, Gestion des
                  rendez-vous, et toutes nos fonctionnalités
                </p>
              </div>
              <div className="relative pt-12 md:pt-0 md:pl-12">
                <h4 className="font-medium mb-6">Tout ce qui est inclus :</h4>
                <ul role="list" className="space-y-4">
                  {[
                    "Gestion complète des rendez-vous",
                    "Accès au dossier médical",
                    "Interface intuitive pour patients et médecins",

                    "Support par email 7j/7",
                    "Sécurité et confidentialité des données",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-4 text-blue-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground mt-6 text-sm">
                  Notre version MVP est 100% gratuite pendant la phase de
                  lancement. Rejoignez-nous maintenant et aidez-nous à améliorer
                  notre service !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

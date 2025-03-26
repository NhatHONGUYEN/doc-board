import { HeroBackground } from "./HeroBackground";
import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="py-16 md:py-32 relative" id="testimonials">
      <HeroBackground />
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl">
          <blockquote className="relative">
            <p className="text-lg font-semibold sm:text-xl md:text-3xl relative z-10">
              Grâce à cette plateforme, j&apos;ai pu prendre rendez-vous avec
              mon médecin en quelques clics. 🖱️ Tout est simple, rapide et
              efficace. ⚡ Je recommande vivement à tous ceux qui veulent gagner
              du temps ! ⏱️
            </p>

            <div className="mt-12 flex items-center gap-6">
              <Image
                className="h-12 w-12 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Photo du patient"
                height={48}
                width={48}
              />
              <div className="space-y-1 border-l pl-6">
                <cite className="font-medium">Marie Dupont</cite>
                <span className="text-muted-foreground block text-sm">
                  Professeur & utilisatrice quotidienne
                </span>
              </div>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

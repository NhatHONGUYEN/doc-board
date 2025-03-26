import { HelpCircle, UserPlus, FileText, Stethoscope } from "lucide-react";
import { HeroBackground } from "./HeroBackground";

export default function Faq() {
  return (
    <section
      className="relative scroll-py-16 py-16 md:scroll-py-32 md:py-32"
      id="faq"
    >
      <HeroBackground />
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Questions <br className="hidden lg:block" /> Fréquemment{" "}
              <br className="hidden lg:block" />
              Posées
            </h2>
            <p>
              Découvrez comment utiliser notre plateforme pour simplifier votre
              quotidien.
            </p>
          </div>

          <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            <div className="pb-6">
              <h3 className="font-medium flex items-center">
                <HelpCircle className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0" />
                Qui peut utiliser la plateforme ?
              </h3>
              <p className="text-muted-foreground mt-4 pl-7">
                Notre plateforme est conçue pour les patients et les docteurs.
                Les patients peuvent gérer leur dossier médical et leur
                historique, tandis que les docteurs peuvent organiser leurs
                profils et suivre leurs patients.
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-medium flex items-center">
                <UserPlus className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0" />
                Comment créer un profil ?
              </h3>
              <p className="text-muted-foreground mt-4 pl-7">
                Pour commencer, cliquez sur &quot;Créer un Compte&quot; en haut
                de la page. Vous pourrez choisir entre un profil patient ou
                docteur et compléter vos informations personnelles.
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0" />
                Puis-je gérer mon dossier médical ?
              </h3>
              <p className="text-muted-foreground mt-4 pl-7">
                Oui, en tant que patient, vous pouvez accéder à votre dossier
                médical, ajouter des informations importantes et consulter votre
                historique de rendez-vous.
              </p>
            </div>
            <div className="py-6">
              <h3 className="font-medium flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0" />
                Quels outils sont disponibles pour les docteurs ?
              </h3>
              <p className="text-muted-foreground mt-4 pl-7">
                Les docteurs peuvent gérer leurs profils, suivre les dossiers de
                leurs patients et organiser leurs rendez-vous pour une meilleure
                efficacité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

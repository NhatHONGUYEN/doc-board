import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSessionStore from "@/lib/store/useSessionStore";

type Role = "DOCTOR" | "PATIENT" | "ADMIN" | string;

type RoleAuthCheckProps = {
  children: ReactNode;
  allowedRoles: Role[] | Role;
  loadingComponent?: ReactNode;
  unauthorizedComponent?: ReactNode;
  unauthenticatedComponent?: ReactNode;
};

export function RoleAuthCheck({
  children,
  allowedRoles,
  loadingComponent,
  unauthorizedComponent,
  unauthenticatedComponent,
}: RoleAuthCheckProps) {
  const router = useRouter();
  const { session, status } = useSessionStore();

  // Convert single role to array for consistent handling
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if loading
  if (status === "loading") {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check if authenticated
  if (!session) {
    return unauthenticatedComponent ? (
      <>{unauthenticatedComponent}</>
    ) : (
      <div className="p-8 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
        <p className="text-muted-foreground">
          Veuillez vous connecter pour accéder à cette page.
        </p>
        <Button className="mt-6" onClick={() => router.push("/sign-in")}>
          Se connecter
        </Button>
      </div>
    );
  }

  // Check if authorized for this role
  if (!session.user.role || !roles.includes(session.user.role)) {
    const roleNames = roles.join(", ");

    return unauthorizedComponent ? (
      <>{unauthorizedComponent}</>
    ) : (
      <div className="p-8 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        <p className="text-muted-foreground">
          {roles.length > 1
            ? `Seuls les utilisateurs avec les rôles ${roleNames} peuvent accéder à cette page.`
            : `Seuls les utilisateurs avec le rôle ${roleNames} peuvent accéder à cette page.`}
        </p>
        <Button className="mt-6" onClick={() => router.back()}>
          Retour
        </Button>
      </div>
    );
  }

  // If all checks pass, render children
  return <>{children}</>;
}

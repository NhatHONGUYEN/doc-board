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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
        <p>Please sign in to access this page.</p>
        <Button className="mt-4" onClick={() => router.push("/auth/login")}>
          Sign In
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
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Not authorized</h1>
        <p>
          {roles.length > 1
            ? `Only ${roleNames} can access this page.`
            : `Only ${roleNames} can access this page.`}
        </p>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // If all checks pass, render children
  return <>{children}</>;
}

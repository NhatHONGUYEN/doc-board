"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <Button onClick={handleSignOut} className="w-full cursor-pointer">
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  );
}

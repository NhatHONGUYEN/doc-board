import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { create } from "zustand";

// Définir les types pour le store Zustand
type SessionState = {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setSession: (
    session: Session | null,
    status: "loading" | "authenticated" | "unauthenticated"
  ) => void;
};

// Créer un store Zustand pour la session
const useSessionStore = create<SessionState>((set) => ({
  session: null,
  status: "loading",
  setSession: (session, status) => set({ session, status }),
}));

// Hook personnalisé pour synchroniser la session avec Zustand
export function useSyncSession() {
  const { data: session, status } = useSession();
  const { setSession } = useSessionStore();

  useEffect(() => {
    setSession(session, status);
  }, [session, status, setSession]);
}

export default useSessionStore;

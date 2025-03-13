"use client";

import { useSyncSession } from "@/lib/store/useSessionStore";

export function SyncSession() {
  useSyncSession();
  return null;
}

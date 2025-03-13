import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBarPatient from "@/components/SideBarPatient";
import { SyncSession } from "@/components/SyncSession";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarPatient />
      <main className="flex-1 p-4 mx-auto max-w-7xl ">
        <SidebarTrigger />
        <SyncSession />
        {children}
      </main>
    </SidebarProvider>
  );
}

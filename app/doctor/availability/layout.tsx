import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SyncSession } from "@/components/SyncSession";
import SideBarDoctor from "@/components/SideBarDoctor";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarDoctor />
      <main className="flex-1 p-4 mx-auto max-w-7xl ">
        <SidebarTrigger />
        <SyncSession />
        {children}
      </main>
    </SidebarProvider>
  );
}

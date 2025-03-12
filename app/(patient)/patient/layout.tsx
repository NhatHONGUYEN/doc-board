import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBarPatient from "@/components/SideBarPatient";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarPatient />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

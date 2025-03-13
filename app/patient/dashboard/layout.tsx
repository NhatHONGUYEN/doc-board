import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideBarPatient from "@/components/SideBarPatient";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SideBarPatient />
      <main className="flex-1 p-4 mx-auto max-w-7xl ">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

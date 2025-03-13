import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Calendar,
  Home,
  Users,
  Clock,
  User,
  Settings,
  FileText,
} from "lucide-react";
import Link from "next/link";

// Navigation links for doctors
const DoctorLinks = [
  { title: "Tableau de bord", url: "/doctor/dashboard", icon: Home },
  { title: "Rendez-vous", url: "/doctor/appointments", icon: Calendar },
  { title: "Patients", url: "/doctor/patients", icon: Users },
  { title: "Disponibilités", url: "/doctor/availability", icon: Clock },
  {
    title: "Dossiers médicaux",
    url: "/doctor/medical-records",
    icon: FileText,
  },
  { title: "Mon profil", url: "/doctor/profile", icon: User },
  { title: "Paramètres", url: "/doctor/settings", icon: Settings },
];

export default function SideBarDoctor() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Docteur</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {DoctorLinks.map((link) => (
                <SidebarMenuItem key={link.title}>
                  <SidebarMenuButton asChild>
                    <Link href={link.url} className="flex items-center gap-2">
                      <link.icon />
                      <span>{link.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

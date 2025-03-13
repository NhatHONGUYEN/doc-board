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
import { Calendar, Home, User, Settings } from "lucide-react";
import Link from "next/link";

// Liens pour le patient
const PatientLinks = [
  { title: "Accueil", url: "/patient/dashboard", icon: Home },
  { title: "Mes rendez-vous", url: "/patient/appointment", icon: Calendar },
  { title: "Mon profil", url: "/patient/profile", icon: User },
  { title: "Paramètres", url: "/patient/settings", icon: Settings },
];

export default function SideBarPatient() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Patient</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PatientLinks.map((link) => (
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

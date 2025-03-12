import SideBarPatient from "@/components/SideBarPatient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MedecinDashboard() {
  return (
    <div className="flex">
      <SideBarPatient />
      <div className="flex-1 flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue sur le Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Redirection en cours...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

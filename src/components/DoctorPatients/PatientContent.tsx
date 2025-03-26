import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Loader2,
  Phone,
  User,
  Clock,
} from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent, CardFooter } from "@/components/ui/card";
import { SortConfig } from "@/lib/types/sorting";
import { cn } from "@/lib/utils";

// Fonction d'aide pour obtenir la couleur du badge de rendez-vous
function getAppointmentBadgeClass(count: number) {
  if (count === 0) return "bg-muted text-muted-foreground";
  if (count < 3) return "bg-primary/10 text-primary";
  if (count < 6) return "bg-primary/20 text-primary";
  return "bg-primary/30 text-primary";
}

type PatientContentProps = {
  isLoading: boolean;
  isError: boolean;
  searchTerm: string;
  patients: Patient[];
  filteredPatients: Patient[];
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
  viewPatientDetails: (patient: Patient) => void;
  scheduleAppointment: (patientId: string) => void;
};

export function PatientContent({
  isLoading,
  isError,
  searchTerm,
  patients,
  filteredPatients,
  sortConfig,
  handleSort,
  viewPatientDetails,
  scheduleAppointment,
}: PatientContentProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-sm">
            Chargement des patients...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-3 mx-auto mb-4 w-fit">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Erreur de chargement des patients
          </h3>
          <p className="text-muted-foreground text-sm">
            Un problème est survenu lors du chargement de vos patients. Veuillez
            réessayer ou contacter le support.
          </p>
        </div>
      </div>
    );
  }

  if (filteredPatients.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center max-w-md">
          <div className="bg-muted rounded-full p-3 mx-auto mb-4 w-fit">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-1">
            Aucun patient trouvé
          </h3>
          <p className="text-muted-foreground text-sm">
            {searchTerm
              ? `Aucun patient ne correspond à "${searchTerm}". Essayez un autre terme de recherche.`
              : "Vous n'avez pas encore de patients."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CardContent className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-card">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead
                  className="cursor-pointer h-11 transition-colors hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-primary">Nom</span>
                    {sortConfig.key === "name" && (
                      <span className="text-primary ml-1">
                        {sortConfig.direction === "ascending" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="h-11 font-medium text-primary">
                  Contact
                </TableHead>
                <TableHead
                  className="cursor-pointer h-11 transition-colors hover:bg-muted/50"
                  onClick={() => handleSort("birthDate")}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-primary">Âge</span>
                    {sortConfig.key === "birthDate" && (
                      <span className="text-primary ml-1">
                        {sortConfig.direction === "ascending" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer h-11 transition-colors hover:bg-muted/50"
                  onClick={() => handleSort("appointments")}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-primary">
                      Rendez-vous
                    </span>
                    {sortConfig.key === "appointments" && (
                      <span className="text-primary ml-1">
                        {sortConfig.direction === "ascending" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="h-11 font-medium text-primary">
                  Dernière visite
                </TableHead>
                <TableHead className="text-right h-11 font-medium text-primary">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient, index) => {
                // Calculer l'âge si la date de naissance est disponible
                let age = null;
                if (patient.birthDate) {
                  const birthDate = new Date(patient.birthDate);
                  const today = new Date();
                  age = today.getFullYear() - birthDate.getFullYear();

                  // Vérifier si l'anniversaire a eu lieu cette année
                  if (
                    today.getMonth() < birthDate.getMonth() ||
                    (today.getMonth() === birthDate.getMonth() &&
                      today.getDate() < birthDate.getDate())
                  ) {
                    age--;
                  }
                }

                // Trouver le dernier rendez-vous
                const lastAppointment = patient.appointments[0];

                // Couleurs de ligne alternées
                const rowClass =
                  index % 2 === 0 ? "bg-background" : "bg-muted/10";

                return (
                  <TableRow
                    key={patient.id}
                    className={cn(
                      rowClass,
                      "transition-colors hover:bg-primary/5"
                    )}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                          <AvatarImage src={patient.user.image || undefined} />
                          <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                            {(patient.user.name || "Utilisateur")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-card-foreground">
                            {patient.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {patient.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {patient.phone ? (
                        <div className="flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-primary/70" />
                          <span className="text-card-foreground">
                            {patient.phone}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          Non renseigné
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      {age !== null ? (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-primary/70" />
                          <span className="text-card-foreground">
                            {age} ans
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          Non renseigné
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          getAppointmentBadgeClass(patient.appointments.length)
                        )}
                      >
                        {patient.appointments.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      {lastAppointment ? (
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mt-0.5 mr-2 text-primary/70" />
                          <div>
                            <p className="text-card-foreground">
                              {format(
                                new Date(lastAppointment.date),
                                "d MMM yyyy"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(lastAppointment.date), "HH:mm")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">
                          Jamais
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 border-border hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => viewPatientDetails(patient)}
                        >
                          <User className="h-4 w-4 mr-1.5" />
                          <span>Profil</span>
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 bg-primary hover:bg-primary/90 transition-colors"
                          onClick={() => scheduleAppointment(patient.id)}
                        >
                          <Calendar className="h-4 w-4 mr-1.5" />
                          <span>Planifier</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between py-4 px-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Affichage de {filteredPatients.length} sur {patients.length} patients
        </p>
      </CardFooter>
    </>
  );
}

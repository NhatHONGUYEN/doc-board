import { format } from "date-fns";
import { User, Phone, Mail, Calendar } from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";

type PersonalInfoTabProps = {
  patient: Patient;
};

export function PersonalInfoTab({ patient }: PersonalInfoTabProps) {
  return (
    <TabsContent value="info" className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={patient.user.image || undefined} />
          <AvatarFallback className="text-lg">
            {(patient.user.name || "User")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{patient.user.name}</h3>
          <p className="text-sm text-muted-foreground">
            Member since{" "}
            {patient.createdAt
              ? format(new Date(patient.createdAt), "MMMM yyyy")
              : "Unknown date"}
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>{patient.user.email}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>
                {patient.phone || (
                  <span className="text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Birth Date
            </p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>
                {patient.birthDate ? (
                  format(new Date(patient.birthDate), "MMMM d, yyyy")
                ) : (
                  <span className="text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              Social Security
            </p>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <p>
                {patient.socialSecurityNumber || (
                  <span className="text-muted-foreground italic">
                    Not provided
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">Address</p>
          <p>
            {patient.address || (
              <span className="text-muted-foreground italic">
                No address provided
              </span>
            )}
          </p>
        </div>
      </div>
    </TabsContent>
  );
}

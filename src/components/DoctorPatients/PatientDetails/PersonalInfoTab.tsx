import { format } from "date-fns";
import { User, Phone, Mail, Calendar, MapPin, CreditCard } from "lucide-react";
import { Patient } from "@/lib/types/core-entities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

type PersonalInfoTabProps = {
  patient: Patient;
};

export function PersonalInfoTab({ patient }: PersonalInfoTabProps) {
  return (
    <TabsContent value="info" className="space-y-5">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16 border-2 border-background shadow-md">
          <AvatarImage src={patient.user.image || undefined} />
          <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
            {(patient.user.name || "User")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">
            {patient.user.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Member since{" "}
            {patient.createdAt
              ? format(new Date(patient.createdAt), "MMMM yyyy")
              : "Unknown date"}
          </p>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <Card className="border-border">
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium text-sm flex items-center text-card-foreground">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
              <User className="h-3 w-3 text-primary" />
            </div>
            Contact Information
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-card-foreground flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-2 text-primary" />
                  {patient.user.email}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-card-foreground flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-2 text-primary" />
                  {patient.phone || (
                    <span className="text-muted-foreground italic text-xs">
                      Not provided
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Birth Date</p>
                <p className="text-sm font-medium text-card-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-2 text-primary" />
                  {patient.birthDate ? (
                    format(new Date(patient.birthDate), "MMMM d, yyyy")
                  ) : (
                    <span className="text-muted-foreground italic text-xs">
                      Not provided
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Social Security</p>
                <p className="text-sm font-medium text-card-foreground flex items-center">
                  <CreditCard className="h-3.5 w-3.5 mr-2 text-primary" />
                  {patient.socialSecurityNumber || (
                    <span className="text-muted-foreground italic text-xs">
                      Not provided
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          <h4 className="font-medium text-sm flex items-center text-card-foreground">
            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
              <MapPin className="h-3 w-3 text-primary" />
            </div>
            Address
          </h4>

          <div className="pl-7">
            <p className="text-sm text-card-foreground">
              {patient.address || (
                <span className="text-muted-foreground italic text-xs">
                  No address provided
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}

// src/components/PatientDashboard/PersonalInfoCard.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  FileText,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { Patient } from "@/lib/types/core-entities";
import { InfoNotice } from "@/components/InfoNotice";

type PersonalInfoCardProps = {
  patient?: Patient;
};

export function PersonalInfoCard({ patient }: PersonalInfoCardProps) {
  return (
    <div className="space-y-3">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 h-full">
        <CardHeader className="bg-card border-b border-border">
          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-card-foreground">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Your profile details
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="flex justify-center mb-6">
            <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
              <AvatarImage src={patient?.user?.image || ""} alt="Patient" />
              <AvatarFallback className="bg-primary/5 text-primary text-xl font-semibold">
                {patient?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "P"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <User className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-card-foreground">
                  {patient?.user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-card-foreground">
                  {patient?.user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium text-card-foreground">
                  {patient?.phone || (
                    <span className="text-muted-foreground italic text-sm">
                      Not provided
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 text-primary/70 mr-2" />
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium text-card-foreground">
                  {patient?.birthDate ? (
                    new Date(patient.birthDate).toLocaleDateString()
                  ) : (
                    <span className="text-muted-foreground italic text-sm">
                      Not provided
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-card border-t border-border py-4 px-5">
          <Button
            asChild
            variant="outline"
            className="w-full h-10 bg-card hover:bg-primary/10 hover:text-primary transition-all"
          >
            <Link
              href="/patient/profile"
              className="flex items-center justify-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Edit Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* InfoNotice outside and below the card */}
      <InfoNotice
        icon={<LockKeyhole size={14} />}
        note="Your information is only shared with your healthcare providers."
      >
        Keeping your profile up-to-date ensures that your doctors have accurate
        information for diagnosis and treatment.
      </InfoNotice>
    </div>
  );
}

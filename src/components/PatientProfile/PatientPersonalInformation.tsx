// src/components/PatientProfile/PatientPersonalInformation.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  Mail,
  Shield,
  Clock,
  FileText,
  Edit,
} from "lucide-react";
import { InfoNotice } from "@/components/InfoNotice";
import { Patient } from "@/lib/types/core-entities";

type PatientPersonalInformationProps = {
  patient?: Patient;
};

export function PatientPersonalInformation({
  patient,
}: PatientPersonalInformationProps) {
  return (
    <div className="space-y-3 mb-8">
      <Card className="overflow-hidden border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300">
        <CardHeader className="bg-card border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">
                Personal Information
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Your personal and contact details
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary/70" />
                {patient?.user?.name || (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary/70" />
                {patient?.user?.email}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary/70" />
                {patient?.birthDate ? (
                  new Date(patient.birthDate).toLocaleDateString()
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary/70" />
                {patient?.phone || (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary/70" />
                {patient?.address || (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>

            <div className="md:col-span-2 space-y-1">
              <p className="text-sm text-muted-foreground">
                Social Security Number
              </p>
              <p className="font-medium text-card-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary/70" />
                {patient?.socialSecurityNumber ? (
                  <span>••••••{patient.socialSecurityNumber.slice(-4)}</span>
                ) : (
                  <span className="text-muted-foreground italic text-sm">
                    Not provided
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className=" border-t border-border py-4 px-6 flex justify-between">
          {/* Left side - Last updated info */}
          <div className="flex items-center text-sm text-primary/70">
            <Clock className="mr-2 h-4 w-4" />
            <span className="font-medium mr-1">Last updated:</span>
            <span>
              {patient?.updatedAt
                ? new Date(patient.updatedAt).toLocaleDateString()
                : "Never updated"}
            </span>
          </div>

          {/* Right side - Edit button */}
          <Button
            asChild
            className="h-10 bg-primary hover:bg-primary/90 transition-all"
          >
            <Link href="/patient/settings" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Info notice about data privacy */}
      <InfoNotice
        icon={<Shield size={14} />}
        note="Your personal information is encrypted and protected."
      >
        Complete your profile to help us provide better care. Your information
        will only be shared with your healthcare providers.
      </InfoNotice>
    </div>
  );
}

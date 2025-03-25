// src/components/PatientSettings/SettingsPageHeader.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export function SettingsPageHeader() {
  // Define the action button for PageHeader
  const actionButton = (
    <Button
      variant="outline"
      asChild
      className="h-10 bg-card border-border hover:bg-primary/10 hover:text-primary transition-all"
    >
      <Link href="/patient/profile" className="flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Link>
    </Button>
  );

  return (
    <PageHeader
      title="Profile Settings"
      icon={<Settings className="h-5 w-5 text-primary" />}
      description="Update your personal and medical information"
      actions={actionButton}
    />
  );
}

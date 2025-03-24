import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type PatientHeaderProps = {
  searchTerm: string;
  handleSearch: React.ChangeEventHandler<HTMLInputElement>;
};

export function PatientHeader({
  searchTerm,
  handleSearch,
}: PatientHeaderProps) {
  return (
    <CardHeader className="pb-4">
      <div className="space-y-2">
        <Label htmlFor="patient-search" className="text-sm font-medium">
          Search Patients
        </Label>
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="patient-search"
            type="text"
            placeholder="Search by name, email, or phone number..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
    </CardHeader>
  );
}

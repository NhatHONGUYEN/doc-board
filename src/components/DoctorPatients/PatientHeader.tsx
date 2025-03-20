import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type PatientHeaderProps = {
  searchTerm: string;
  handleSearch: React.ChangeEventHandler<HTMLInputElement>;
};

export function PatientHeader({
  searchTerm,
  handleSearch,
}: PatientHeaderProps) {
  return (
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>View and manage all your patients</CardDescription>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search patients..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
    </CardHeader>
  );
}

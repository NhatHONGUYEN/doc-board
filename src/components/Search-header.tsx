// src/components/ui/search-header.tsx
import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type SearchHeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
  showClearButton?: boolean;
};

export function SearchHeader({
  searchTerm,
  onSearchChange,
  label = "Search",
  placeholder = "Search...",
  id = "search-input",
  className,
  showClearButton = true,
}: SearchHeaderProps) {
  return (
    <CardHeader className={`pb-4 ${className || ""}`}>
      <div className="space-y-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id={id}
            type="text"
            placeholder={placeholder}
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {showClearButton && searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => onSearchChange("")}
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
}

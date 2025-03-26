import { cn } from "@/lib/utils";
import { Stethoscope } from "lucide-react";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
        <Stethoscope
          className="size-5 text-primary-foreground"
          strokeWidth={2}
        />
      </div>
      <span className="font-semibold text-lg">DocBoard</span>
    </div>
  );
};

export const LogoStroke = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center rounded-lg border border-primary p-1.5">
        <Stethoscope className="size-5 text-primary" strokeWidth={2} />
      </div>
      <span className="font-semibold text-lg">DocBoard</span>
    </div>
  );
};

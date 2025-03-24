import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  icon?: ReactNode;
  actions?: ReactNode;
  description?: string;
  highlightedText?: {
    prefix?: string;
    text: string;
    suffix?: string;
  };
  className?: string;
};

export function PageHeader({
  title,
  icon,
  actions,
  description,
  highlightedText,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {/* Top section with heading and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center">
          {icon && (
            <div className="mr-3 p-2.5 bg-primary/10 rounded-full">{icon}</div>
          )}
          <h1 className="text-2xl font-bold text-card-foreground">{title}</h1>
        </div>

        {actions && <div className="self-start sm:self-auto">{actions}</div>}
      </div>

      {/* Description or welcome message with visual separator */}
      {(description || highlightedText) && (
        <div className="flex items-center gap-2 mt-3">
          <div className="h-0.5 w-8 bg-primary/30 rounded-full"></div>
          <p className="text-muted-foreground">
            {description}
            {highlightedText && (
              <>
                {highlightedText.prefix}{" "}
                <span className="font-medium text-primary">
                  {highlightedText.text}
                </span>
                {highlightedText.suffix}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

import React from "react";

type InfoNoticeProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  note?: string;
};

export function InfoNotice({ icon, children, note }: InfoNoticeProps) {
  return (
    <div className="text-sm text-white bg-slate-800 dark:bg-slate-900 p-3 rounded-md border border-slate-700 flex items-start">
      {icon && <div className="mr-2 mt-0.5 text-blue-300">{icon}</div>}
      <p>
        {children}
        {note && (
          <span className="font-medium block mt-1 text-blue-200">{note}</span>
        )}
      </p>
    </div>
  );
}

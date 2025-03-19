import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, UserPlus } from "lucide-react";
import { Doctor } from "@/lib/types/core-entities";

type DoctorInfoColumnProps = {
  doctor: Doctor | null;
};

export function DoctorInfoColumn({ doctor }: DoctorInfoColumnProps) {
  return (
    <div className="space-y-6">
      {/* Doctor Info Card */}
      <Card className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-white"
                >
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
              </div>
              Doctor Info
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-blue-600 dark:text-blue-400"
              >
                <path d="m12 14.5 1.5 2.5 2-1 1.5 3h-9l1.5-3 2 1z"></path>
                <path d="M9.5 9a2.5 2.5 0 0 1 5 0v7.5H9.5z"></path>
                <path d="M6 6h1.5v4H6z"></path>
                <path d="M16.5 6H18v4h-1.5z"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Specialty</p>
              <p className="font-medium">
                {doctor?.specialty || "General Practice"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-green-600 dark:text-green-400"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">License Number</p>
              <p className="font-medium">{doctor?.licenseNumber || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-amber-600 dark:text-amber-400"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Office</p>
              <p className="font-medium">{doctor?.officeAddress || "N/A"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <Link href="/doctor/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
              Edit Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <Card className="backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 shadow-md overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white"
              >
                <path d="m3 2 2 5h14l2-5Z"></path>
                <path d="M19 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"></path>
                <path d="M12 12v5"></path>
                <path d="M9.5 12v5"></path>
                <path d="M14.5 12v5"></path>
              </svg>
            </div>
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/doctor/patients">
              <Users size={16} className="mr-2" />
              View All Patients
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/doctor/appointment/new">
              <UserPlus size={16} className="mr-2" />
              Schedule Appointment
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/doctor/availability">
              <Calendar size={16} className="mr-2" />
              Update Schedule
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

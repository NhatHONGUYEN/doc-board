// app/doctor/availability/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import useSessionStore from "@/lib/store/useSessionStore";
import { useDoctorData } from "@/hooks/useDoctorData";
import { useAvailabilityData } from "@/hooks/useAvailabilityData";
import { useSaveAvailability } from "@/hooks/useSaveAvailability";
import { RoleAuthCheck } from "@/components/RoleAuthCheck";
import { useAvailabilityStore } from "@/lib/store/useAvailabilityStore";
import WeeklyScheduleCard from "@/components/DoctorAvailability/WeeklyScheduleCard";
import SpecialDatesCard from "@/components/DoctorAvailability/SpecialDatesCard";

// Import our new components

export default function DoctorAvailabilityPage() {
  const router = useRouter();
  const { session, status } = useSessionStore();

  // Get doctor data
  const { data: doctor, isLoading: isLoadingDoctor } = useDoctorData(
    session?.user?.id
  );

  // Use TanStack Query to fetch availability data
  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useAvailabilityData(doctor?.id);

  // Use TanStack Query to save availability
  const { mutate: saveAvailabilityMutation, isPending: isSaving } =
    useSaveAvailability();

  // Use our Zustand store (only the functions we need in this component)
  const { initializeFromApiData, resetStore, saveAvailability } =
    useAvailabilityStore();

  // Initialize store with API data
  useEffect(() => {
    if (availabilityData) {
      initializeFromApiData(availabilityData);
    }
  }, [availabilityData, initializeFromApiData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => resetStore();
  }, [resetStore]);

  // Loading state (combined from all sources)
  const isLoading =
    status === "loading" || isLoadingDoctor || isLoadingAvailability;

  // Custom loading component
  const loadingComponent = (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  // Doctor profile check component
  const doctorProfileCheck = (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Doctor profile not found</h1>
      <p>Please complete your doctor profile first.</p>
      <Button className="mt-4" onClick={() => router.push("/doctor/profile")}>
        Complete Profile
      </Button>
    </div>
  );

  // Handler to save availability - wraps the store's saveAvailability with doctorId
  const handleSaveAvailability = () => {
    if (!doctor?.id) return;
    saveAvailability(doctor.id, saveAvailabilityMutation);
  };

  return (
    <RoleAuthCheck
      allowedRoles="DOCTOR"
      loadingComponent={
        status === "loading" || isLoadingDoctor ? loadingComponent : undefined
      }
    >
      {!doctor ? (
        doctorProfileCheck
      ) : (
        <div className="container py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Manage Availability</h1>
            <Button
              onClick={handleSaveAvailability}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Use our new extracted components */}
            <WeeklyScheduleCard isLoading={isLoading} />
            <SpecialDatesCard isLoading={isLoading} />
          </div>
        </div>
      )}
    </RoleAuthCheck>
  );
}

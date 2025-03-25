// src/lib/store/usePatientProfileStore.ts
import { create } from "zustand";
import { toast } from "sonner";
import { PatientProfileFormValues } from "../schema/patientProfile";

type PatientProfileState = {
  isUpdating: boolean;
  updateError: string | null;
  updateProfile: (
    userId: string,
    profileData: PatientProfileFormValues
  ) => Promise<boolean>;
  resetState: () => void;
};

export const usePatientProfileStore = create<PatientProfileState>((set) => ({
  isUpdating: false,
  updateError: null,

  updateProfile: async (
    userId: string,
    profileData: PatientProfileFormValues
  ) => {
    set({ isUpdating: true, updateError: null });

    try {
      const response = await fetch(`/api/patient?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: null }));
        const errorMessage = errorData.message || "Failed to update profile";
        throw new Error(errorMessage);
      }

      // Show success toast
      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });

      set({ isUpdating: false });
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";

      // Show error toast
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });

      set({
        isUpdating: false,
        updateError: errorMessage,
      });
      return false;
    }
  },

  resetState: () => {
    set({ isUpdating: false, updateError: null });
  },
}));

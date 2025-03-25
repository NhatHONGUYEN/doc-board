import { Doctor } from "@/lib/types/core-entities";

export function calculateProfileCompleteness(doctor: Doctor | undefined) {
  if (!doctor) return 0;

  const fields = [
    doctor.user?.name,
    doctor.user?.email,
    doctor.specialty,
    doctor.licenseNumber,
    doctor.phone,
    doctor.officeAddress,
    doctor.description,
  ];

  const filledFields = fields.filter(
    (field) => field && field.trim().length > 0
  ).length;
  return Math.round((filledFields / fields.length) * 100);
}

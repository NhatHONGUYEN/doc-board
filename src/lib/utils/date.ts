// src/lib/utils/date.ts

/**
 * Combine une date et une heure au format "HH:MM" en un objet Date
 * @param date Date de base (sans heure précise)
 * @param timeString Heure au format "HH:MM"
 * @returns Un objet Date combinant la date et l'heure
 */
export function combineDateAndTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  const combinedDate = new Date(date);

  combinedDate.setHours(hours);
  combinedDate.setMinutes(minutes);
  combinedDate.setSeconds(0);
  combinedDate.setMilliseconds(0);

  return combinedDate;
}

/**
 * Formate les données d'un formulaire de rendez-vous pour l'API
 * @param formData Données du formulaire de prise de rendez-vous
 * @returns Données formatées prêtes à être envoyées à l'API
 */
export function formatAppointmentData(formData: {
  doctorId: string;
  date: Date;
  time: string;
  duration: string;
  reason?: string;
}) {
  const appointmentDate = combineDateAndTime(formData.date, formData.time);

  return {
    doctorId: formData.doctorId,
    date: appointmentDate.toISOString(),
    duration: parseInt(formData.duration, 10),
    reason: formData.reason || undefined,
  };
}

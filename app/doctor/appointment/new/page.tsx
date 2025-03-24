"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Loader2, Search } from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import useSessionStore from "@/lib/store/useSessionStore";
import { cn } from "@/lib/utils";
import { useDoctorData } from "@/hooks/useDoctorData";

import { Input } from "@/components/ui/input";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Form validation schema
const appointmentFormSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient",
  }),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time",
  }),
  duration: z.string({
    required_error: "Please select an appointment duration",
  }),
  appointmentType: z.string().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type Patient = {
  id: string;
  userId: string;
  birthDate: string | null;
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
};

type TimeSlot = {
  value: string;
  label: string;
  available: boolean;
};

// Main page component
export default function NewDoctorAppointmentPage() {
  const router = useRouter();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Schedule New Appointment</h1>

      <Suspense
        fallback={
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        }
      >
        <AppointmentForm router={router} />
      </Suspense>
    </div>
  );
}

// Separated component that uses useSearchParams
function AppointmentForm({ router }: { router: AppRouterInstance }) {
  const searchParams = useSearchParams();
  const selectedDateParam = searchParams.get("date");
  const selectedPatientParam = searchParams.get("patientId");
  const { session, status } = useSessionStore();

  const { data: doctor, isLoading: isLoadingDoctor } = useDoctorData(
    session?.user?.id
  );

  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize form with default values
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: selectedPatientParam || "",
      date: selectedDateParam ? new Date(selectedDateParam) : undefined,
      time: "",
      duration: "30", // Default to 30 min
      appointmentType: "regular",
      reason: "",
      notes: "",
    },
  });

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      if (!session?.user?.id) return;

      setIsLoadingPatients(true);
      try {
        const response = await fetch("/api/patients");
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();

        if (data && Array.isArray(data)) {
          setPatients(data);
          setFilteredPatients(data);
          if (data.length === 0) {
            toast.info("No patients found in the system");
          }
        }
      } catch (error) {
        toast.error("Failed to load patients");
        console.error(error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchPatients();
  }, [session?.user?.id]);

  // Filter patients based on search term
  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [searchTerm, patients]);

  // Watch for changes to date to fetch available time slots
  const watchDate = form.watch("date");

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!doctor?.id || !watchDate) return;

      setIsCheckingAvailability(true);
      try {
        const formattedDate = format(watchDate, "yyyy-MM-dd");
        const response = await fetch(
          `/api/doctor/availability?doctorId=${doctor.id}&date=${formattedDate}`
        );

        if (!response.ok) throw new Error("Failed to fetch availability");

        const data = await response.json();

        // Create time slots from the doctor's availability
        const slots: TimeSlot[] = [];

        // If no availability is set for this day
        if (!data.availableSlots || data.availableSlots.length === 0) {
          // Create default work hours (9 AM to 5 PM in 30-minute increments)
          for (let hour = 9; hour < 17; hour++) {
            for (const minute of [0, 30]) {
              const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;

              // Format for display (12-hour format)
              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
              const period = hour < 12 ? "AM" : "PM";
              const displayTime = `${displayHour}:${minute
                .toString()
                .padStart(2, "0")} ${period}`;

              slots.push({
                value: timeString,
                label: displayTime,
                // For doctors, we'll say all slots are available by default
                // They can override based on their knowledge
                available: true,
              });
            }
          }
        } else {
          // Use the available slots from the API
          for (const slot of data.availableSlots) {
            const [hour, minute] = slot.split(":");
            const hourNum = parseInt(hour);

            // Format for display (12-hour format)
            const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
            const period = hourNum < 12 ? "AM" : "PM";
            const displayTime = `${displayHour}:${minute} ${period}`;

            slots.push({
              value: slot,
              label: displayTime,
              available: true,
            });
          }
        }

        // Mark booked slots as unavailable
        if (data.bookedSlots) {
          data.bookedSlots.forEach((bookedSlot: string) => {
            const slotToUpdate = slots.find(
              (slot) => slot.value === bookedSlot
            );
            if (slotToUpdate) {
              slotToUpdate.available = false;
            }
          });
        }

        setTimeSlots(slots);
      } catch (error) {
        console.error(error);
        toast.error("Failed to check availability");
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    if (doctor?.id && watchDate) {
      fetchAvailableTimeSlots();
    }
  }, [watchDate, doctor?.id]);

  const onSubmit = async (data: AppointmentFormValues) => {
    if (!session) {
      toast.error("You must be logged in to schedule an appointment");
      return;
    }

    if (!doctor?.id) {
      toast.error("Doctor information not available");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert date and time to ISO string
      const [hours, minutes] = data.time.split(":");
      const appointmentDate = new Date(data.date);
      appointmentDate.setHours(parseInt(hours, 10));
      appointmentDate.setMinutes(parseInt(minutes, 10));

      const appointmentData = {
        patientId: data.patientId,
        doctorId: doctor.id,
        date: appointmentDate.toISOString(),
        duration: parseInt(data.duration),
        reason: data.reason || undefined,
        notes: data.notes || undefined,
        appointmentType: data.appointmentType || "regular",
        // Doctors can directly set appointments as confirmed
        status: "confirmed",
      };

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book appointment");
      }

      toast.success("Appointment scheduled successfully");
      router.push("/doctor/appointment");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to schedule appointment");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoadingDoctor) {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
        <p>Please sign in to schedule appointments.</p>
        <Button className="mt-4" onClick={() => router.push("/auth/login")}>
          Sign In
        </Button>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Doctor profile not found</h1>
        <p>Please complete your doctor profile first.</p>
        <Button className="mt-4" onClick={() => router.push("/doctor/profile")}>
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Patient and Appointment Details</CardTitle>
          <CardDescription>
            Schedule a new appointment for one of your patients
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Patient Selection */}
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Patient</FormLabel>

                    {field.value &&
                    patients.find((p) => p.id === field.value) ? (
                      // Show selected patient with option to change
                      <div className="flex items-center justify-between border rounded-md p-3 bg-card">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary mr-3">
                            {patients
                              .find((p) => p.id === field.value)
                              ?.user.name?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() || "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-card-foreground">
                              {
                                patients.find((p) => p.id === field.value)?.user
                                  .name
                              }
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {
                                patients.find((p) => p.id === field.value)?.user
                                  .email
                              }
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange("")}
                          className="hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      // Show search with live results
                      <div className="space-y-0 relative">
                        <div className="relative">
                          <div className="absolute left-2.5 top-2.5 flex items-center justify-center">
                            <Search className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <Input
                            placeholder="Search patients by name or email..."
                            className="pl-9 border-border bg-card"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            disabled={isLoadingPatients}
                          />
                        </div>

                        {/* Show results immediately below the search box as you type */}
                        {searchTerm && !field.value && (
                          <div className="absolute z-10 w-full mt-1 border rounded-md bg-card shadow-md max-h-64 overflow-y-auto">
                            {isLoadingPatients ? (
                              <div className="p-4 text-center flex items-center justify-center">
                                <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <p className="text-sm text-muted-foreground">
                                  Loading patients...
                                </p>
                              </div>
                            ) : filteredPatients.length === 0 ? (
                              <div className="p-4 text-center flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                  <Search className="h-5 w-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-card-foreground">
                                  No patients found
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Try searching with a different name or email
                                </p>
                              </div>
                            ) : (
                              filteredPatients.map((patient) => (
                                <div
                                  key={patient.id}
                                  className="p-2 hover:bg-muted cursor-pointer flex items-center"
                                  onClick={() => field.onChange(patient.id)}
                                >
                                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary mr-3">
                                    {patient.user.name
                                      ?.split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase() || "?"}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-medium text-card-foreground">
                                      {patient.user.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {patient.user.email}
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <FormDescription className="text-xs text-muted-foreground">
                      Search by name or email and select a patient.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Appointment Type */}
              <FormField
                control={form.control}
                name="appointmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "regular"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appointment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">Regular Checkup</SelectItem>
                        <SelectItem value="followup">
                          Follow-up Visit
                        </SelectItem>
                        <SelectItem value="urgent">Urgent Care</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="consultation">
                          Consultation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type of appointment helps with scheduling and
                      preparation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date Picker */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={
                            (date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0)) // No past dates
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a date for the appointment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Slots */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={
                        isCheckingAvailability || timeSlots.length === 0
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isCheckingAvailability
                                ? "Checking availability..."
                                : timeSlots.length === 0
                                ? "Select date first"
                                : "Select a time"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isCheckingAvailability ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Checking availability...
                          </div>
                        ) : (
                          timeSlots.map((slot) => (
                            <SelectItem
                              key={slot.value}
                              value={slot.value}
                              disabled={!slot.available}
                            >
                              {slot.label}
                              {!slot.available && " (Already booked)"}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reason for Visit */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Visit (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the reason for the appointment"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be visible to the patient.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Doctor Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor&apos;s Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Private notes for your reference only"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      These notes are not shared with the patient.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CardFooter className="px-0 pb-0">
                <div className="flex justify-between w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Main page component - doesn't use useSearchParams
export default function NewAppointmentPage() {
  const router = useRouter();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Book New Appointment</h1>

      <Suspense
        fallback={
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </CardContent>
          </Card>
        }
      >
        <AppointmentFormContent router={router} />
      </Suspense>
    </div>
  );
}

// Separated component that uses useSearchParams
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";

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
import { Doctor } from "@/lib/types/patient";

// Form validation schema
const appointmentFormSchema = z.object({
  doctorId: z.string({
    required_error: "Please select a doctor",
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
  reason: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

type TimeSlot = {
  value: string;
  label: string;
  available: boolean;
};

// Form component that uses useSearchParams
function AppointmentFormContent({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const searchParams = useSearchParams();
  const selectedDateParam = searchParams.get("date");
  const { session, status } = useSessionStore();

  // All your existing state and form logic
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setSelectedDoctor] = useState<string | null>(null);
  const [, setSelectedDate] = useState<Date | null>(
    selectedDateParam ? new Date(selectedDateParam) : null
  );

  // Initialize form with default values
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      doctorId: "",
      date: selectedDateParam ? new Date(selectedDateParam) : undefined,
      time: "",
      duration: "30", // Default to 30 min
      reason: "",
    },
  });

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/allDoctor");
        if (!response.ok) throw new Error("Failed to fetch doctors");
        const data = await response.json();

        // Debug what's coming from the API
        console.log("Doctors data:", data);

        if (data && Array.isArray(data)) {
          setDoctors(data);
          if (data.length === 0) {
            toast.info("No doctors available in the system yet");
          }
        }
      } catch (error) {
        toast.error("Failed to load doctors");
        console.error(error);
      }
    };

    fetchDoctors();
  }, []);

  // Watch for changes to doctor and date to fetch available time slots
  const watchDoctorId = form.watch("doctorId");
  const watchDate = form.watch("date");

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      if (!watchDoctorId || !watchDate) return;

      setIsCheckingAvailability(true);
      try {
        const formattedDate = format(watchDate, "yyyy-MM-dd");
        const response = await fetch(
          `/api/doctor/availability?doctorId=${watchDoctorId}&date=${formattedDate}`
        );

        if (!response.ok) throw new Error("Failed to fetch availability");

        const data = await response.json();

        // Create time slots from 9 AM to 5 PM in 30-minute increments
        const slots: TimeSlot[] = [];
        for (let hour = 9; hour < 17; hour++) {
          for (const minute of [0, 30]) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
              .toString()
              .padStart(2, "0")}`;
            const isAvailable = data.availableSlots.includes(timeString);

            // Format for display (12-hour format)
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const period = hour < 12 ? "AM" : "PM";
            const displayTime = `${displayHour}:${minute
              .toString()
              .padStart(2, "0")} ${period}`;

            slots.push({
              value: timeString,
              label: displayTime,
              available: isAvailable,
            });
          }
        }

        setTimeSlots(slots);
      } catch (error) {
        toast.error("Failed to check availability");
        console.error(error);
      } finally {
        setIsCheckingAvailability(false);
      }
    };

    if (watchDoctorId && watchDate) {
      setSelectedDoctor(watchDoctorId);
      setSelectedDate(watchDate);
      fetchAvailableTimeSlots();
    }
  }, [watchDoctorId, watchDate]);

  // After your form initialization:
  useEffect(() => {
    // If we have a date from URL but no doctor selected yet, just set the form date
    if (selectedDateParam && !form.getValues("doctorId")) {
      form.setValue("date", new Date(selectedDateParam));
    }

    // If we have both date from URL and a doctor already selected, check availability
    if (selectedDateParam && form.getValues("doctorId")) {
      fetchAvailableTimeSlots(
        form.getValues("doctorId"),
        new Date(selectedDateParam)
      );
    }
  }, [selectedDateParam, form]);

  // Extract fetchAvailableTimeSlots to a separate function to reuse it
  const fetchAvailableTimeSlots = async (doctorId: string, date: Date) => {
    if (!doctorId || !date) return;

    setIsCheckingAvailability(true);
    try {
      // Rest of your existing code for handling the response
      // ...
    } catch {
      // ...
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data: AppointmentFormValues) => {
    if (!session) {
      toast.error("You must be logged in to book an appointment");
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
        doctorId: data.doctorId,
        date: appointmentDate.toISOString(),
        duration: parseInt(data.duration),
        reason: data.reason || undefined,
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

      toast.success("Appointment booked successfully");
      router.push("/patient/appointment");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to book appointment");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return <div className="p-8">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
        <p>Please sign in to book an appointment.</p>
        <Button className="mt-4" onClick={() => router.push("/auth/login")}>
          Sign In
        </Button>
      </div>
    );
  }

  // Return your existing Card element with all its contents
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Select Doctor and Time</CardTitle>
        <CardDescription>
          Choose your preferred doctor and appointment time
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Your existing form goes here */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Doctor Selection */}
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.length > 0 ? (
                        doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            Dr. {doctor.user.name}
                            {doctor.specialty && ` • ${doctor.specialty}`}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center text-muted-foreground">
                          No doctors available at this time
                        </div>
                      )}
                    </SelectContent>
                  </Select>
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
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || // No past dates
                            date >
                              new Date(
                                new Date().setMonth(new Date().getMonth() + 3)
                              ) // Max 3 months in advance
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a date for your appointment.
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
                    disabled={isCheckingAvailability || timeSlots.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isCheckingAvailability
                              ? "Checking availability..."
                              : timeSlots.length === 0
                              ? "Select doctor and date first"
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
                            {!slot.available && " (Not Available)"}
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
                      placeholder="Brief description of your symptoms or reason for the appointment"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This helps the doctor prepare for your appointment.
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
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

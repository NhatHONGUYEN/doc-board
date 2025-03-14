"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  CalendarIcon, // Rename the icon import to avoid conflict
  Clock,
  Info,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

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
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import useSessionStore from "@/lib/store/useSessionStore";
import { useDoctorData } from "@/hooks/useDoctorData";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Weekly schedule types
type TimeSlot = {
  startTime: string;
  endTime: string;
};

type DayAvailability = {
  enabled: boolean;
  slots: TimeSlot[];
};

type WeeklySchedule = {
  [key: number]: DayAvailability; // key is day of week (1-7, Monday-Sunday)
};

// Special date types
type SpecialDate = {
  id: string;
  date: string;
  type: "dayoff" | "custom";
  slots?: TimeSlot[];
};

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function DoctorAvailabilityPage() {
  const router = useRouter();
  const { session, status } = useSessionStore();
  const { data: doctor, isLoading: isLoadingDoctor } = useDoctorData(
    session?.user?.id
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Weekly schedule (regular hours)
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({
    1: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
    2: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
    3: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
    4: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
    5: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
    6: { enabled: false, slots: [] },
    7: { enabled: false, slots: [] },
  });

  // Special dates (days off, holidays, etc)
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);

  // Dialog state
  const [isSpecialDateDialogOpen, setIsSpecialDateDialogOpen] = useState(false);
  const [newSpecialDate, setNewSpecialDate] = useState<Date | undefined>(
    undefined
  );
  const [newSpecialDateType, setNewSpecialDateType] = useState<
    "dayoff" | "custom"
  >("dayoff");
  const [newSpecialDateSlots, setNewSpecialDateSlots] = useState<TimeSlot[]>([
    { startTime: "09:00", endTime: "17:00" },
  ]);

  // Load availability data on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!doctor?.id) return;

      setIsLoading(true);
      try {
        // Fetch weekly schedule
        const response = await fetch(`/api/doctor/${doctor.id}/availability`);

        if (!response.ok) {
          throw new Error("Failed to load availability");
        }

        const data = await response.json();
        if (data.weeklySchedule) {
          setWeeklySchedule(data.weeklySchedule);
        }

        if (data.specialDates) {
          setSpecialDates(data.specialDates);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load your availability schedule");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [doctor?.id]);

  // Handle toggling a day's availability
  const toggleDayEnabled = (day: number) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
        slots: prev[day].enabled
          ? []
          : [{ startTime: "09:00", endTime: "17:00" }],
      },
    }));
  };

  // Add a time slot to a day
  const addTimeSlot = (day: number) => {
    setWeeklySchedule((prev) => {
      const lastSlot = prev[day].slots[prev[day].slots.length - 1];
      const newSlot = { startTime: lastSlot.endTime, endTime: "18:00" };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          slots: [...prev[day].slots, newSlot],
        },
      };
    });
  };

  // Remove a time slot from a day
  const removeTimeSlot = (day: number, index: number) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index),
      },
    }));
  };

  // Update a time slot
  const updateTimeSlot = (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  // Add a special date
  const addSpecialDate = () => {
    if (!newSpecialDate) return;

    const formattedDate = format(newSpecialDate, "yyyy-MM-dd");

    // Check if date already exists
    if (specialDates.some((sd) => sd.date === formattedDate)) {
      toast.error("This date already has a special schedule");
      return;
    }

    const specialDate: SpecialDate = {
      id: `special-${Date.now()}`,
      date: formattedDate,
      type: newSpecialDateType,
      slots: newSpecialDateType === "custom" ? newSpecialDateSlots : undefined,
    };

    setSpecialDates((prev) => [...prev, specialDate]);
    setIsSpecialDateDialogOpen(false);
    resetSpecialDateForm();
  };

  // Remove a special date
  const removeSpecialDate = (id: string) => {
    setSpecialDates((prev) => prev.filter((sd) => sd.id !== id));
  };

  // Reset the special date form
  const resetSpecialDateForm = () => {
    setNewSpecialDate(undefined);
    setNewSpecialDateType("dayoff");
    setNewSpecialDateSlots([{ startTime: "09:00", endTime: "17:00" }]);
  };

  // Add a time slot to the new special date
  const addSpecialDateTimeSlot = () => {
    const lastSlot = newSpecialDateSlots[newSpecialDateSlots.length - 1];
    const newSlot = { startTime: lastSlot.endTime, endTime: "18:00" };
    setNewSpecialDateSlots((prev) => [...prev, newSlot]);
  };

  // Remove a time slot from the new special date
  const removeSpecialDateTimeSlot = (index: number) => {
    setNewSpecialDateSlots((prev) => prev.filter((_, i) => i !== index));
  };

  // Update a time slot for the new special date
  const updateSpecialDateTimeSlot = (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setNewSpecialDateSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    );
  };

  // Save all availability settings
  const saveAvailability = async () => {
    if (!doctor?.id) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/doctor/${doctor.id}/availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          weeklySchedule,
          specialDates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save availability");
      }

      toast.success("Availability schedule saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save your availability schedule");
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoadingDoctor) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
        <p>Please sign in to manage your availability.</p>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Availability</h1>
        <Button
          onClick={saveAvailability}
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
        {/* Weekly Schedule */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>
              Set your regular working hours for each day of the week
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {dayNames.map((dayName, index) => {
                  const day = index + 1; // 1 = Monday, 7 = Sunday
                  const dayData = weeklySchedule[day];

                  return (
                    <div key={day} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={dayData.enabled}
                            onCheckedChange={() => toggleDayEnabled(day)}
                          />
                          <h3 className="font-medium">{dayName}</h3>
                        </div>

                        {dayData.enabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimeSlot(day)}
                            className="flex items-center gap-1"
                          >
                            <Plus className="h-4 w-4" />
                            Add Time Slot
                          </Button>
                        )}
                      </div>

                      {dayData.enabled && (
                        <div className="space-y-2 pl-7">
                          {dayData.slots.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No hours set
                            </p>
                          ) : (
                            dayData.slots.map((slot, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="grid grid-cols-2 gap-2 flex-1">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                      type="time"
                                      value={slot.startTime}
                                      onChange={(e) =>
                                        updateTimeSlot(
                                          day,
                                          i,
                                          "startTime",
                                          e.target.value
                                        )
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-muted-foreground">
                                      to
                                    </span>
                                    <Input
                                      type="time"
                                      value={slot.endTime}
                                      onChange={(e) =>
                                        updateTimeSlot(
                                          day,
                                          i,
                                          "endTime",
                                          e.target.value
                                        )
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTimeSlot(day, i)}
                                  disabled={dayData.slots.length === 1}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {index < dayNames.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>

        {/* Special Dates */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Special Dates
              </CardTitle>

              <Dialog
                open={isSpecialDateDialogOpen}
                onOpenChange={setIsSpecialDateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Special Date
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Special Date</DialogTitle>
                    <DialogDescription>
                      Set days off or custom working hours for specific dates.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="specialDate">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="specialDate"
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newSpecialDate
                              ? format(newSpecialDate, "PPP")
                              : "Select a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newSpecialDate}
                            onSelect={setNewSpecialDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="specialDateType">Type</Label>
                      <Select
                        value={newSpecialDateType}
                        onValueChange={(value) =>
                          setNewSpecialDateType(value as "dayoff" | "custom")
                        }
                      >
                        <SelectTrigger id="specialDateType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dayoff">
                            Day Off (Not Available)
                          </SelectItem>
                          <SelectItem value="custom">Custom Hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newSpecialDateType === "custom" && (
                      <div className="grid gap-3">
                        <Label>Custom Hours</Label>
                        {newSpecialDateSlots.map((slot, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="grid grid-cols-2 gap-2 flex-1">
                              <Input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) =>
                                  updateSpecialDateTimeSlot(
                                    i,
                                    "startTime",
                                    e.target.value
                                  )
                                }
                              />
                              <div className="flex items-center">
                                <span className="mx-2">to</span>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) =>
                                    updateSpecialDateTimeSlot(
                                      i,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSpecialDateTimeSlot(i)}
                              disabled={newSpecialDateSlots.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addSpecialDateTimeSlot}
                          className="flex items-center justify-center gap-1 mt-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Time Slot
                        </Button>
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsSpecialDateDialogOpen(false);
                        resetSpecialDateForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addSpecialDate} disabled={!newSpecialDate}>
                      Add
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <CardDescription>
              Set exceptions like days off, holidays or special working hours
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : specialDates.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No special dates set</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click &quot;Add Special Date&quot; to set days off or custom
                  hours
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upcoming special dates first */}
                {specialDates
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((specialDate) => (
                    <div
                      key={specialDate.id}
                      className="flex items-start justify-between border rounded-lg p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {format(new Date(specialDate.date), "PP")}
                          </h4>
                          <Badge
                            variant={
                              specialDate.type === "dayoff"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {specialDate.type === "dayoff"
                              ? "Day Off"
                              : "Custom Hours"}
                          </Badge>
                        </div>

                        {specialDate.type === "custom" && specialDate.slots && (
                          <div className="text-sm text-muted-foreground">
                            Hours:{" "}
                            {specialDate.slots.map((slot, i) => (
                              <span key={i}>
                                {slot.startTime} - {slot.endTime}
                                {i < specialDate.slots!.length - 1 && ", "}
                              </span>
                            ))}
                          </div>
                        )}

                        {specialDate.type === "dayoff" && (
                          <div className="text-sm text-muted-foreground">
                            Not available on this date
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpecialDate(specialDate.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Special dates override your regular weekly schedule. Remember to
                save your changes.
              </AlertDescription>
            </Alert>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

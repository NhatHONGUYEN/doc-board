// src/components/Availability/WeeklyScheduleCard.tsx
import { Loader2, Plus, Trash2, Clock } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAvailabilityStore } from "@/lib/store/useAvailabilityStore";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyScheduleCard({ isLoading = false }) {
  const {
    weeklySchedule,
    toggleDayEnabled,
    addTimeSlot,
    removeTimeSlot,
    updateTimeSlot,
  } = useAvailabilityStore();

  return (
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
  );
}

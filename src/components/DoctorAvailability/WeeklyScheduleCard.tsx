// src/components/Availability/WeeklyScheduleCard.tsx
import { Loader2, Plus, Clock, CalendarDays, X } from "lucide-react";
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
import { InfoNotice } from "@/components/InfoNotice";

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
    <div className="space-y-3">
      <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
        <CardHeader className="bg-card border-b border-border p-5 pb-3">
          <div className="flex justify-between items-center pb-4">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-white" />
              </div>
              <span className="text-card-foreground">Weekly Schedule</span>
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Set your regular working hours for each day of the week
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-5 pt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                          className="data-[state=checked]:bg-primary"
                        />
                        <h3 className="font-medium text-sm text-card-foreground">
                          {dayName}
                        </h3>
                      </div>

                      {dayData.enabled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addTimeSlot(day)}
                          className="flex items-center gap-1 border-border bg-card hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Time Slot
                        </Button>
                      )}
                    </div>

                    {dayData.enabled && (
                      <div className="space-y-2 pl-9">
                        {dayData.slots.length === 0 ? (
                          <p className="text-xs italic text-muted-foreground">
                            No hours set for this day
                          </p>
                        ) : (
                          dayData.slots.map((slot, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="grid grid-cols-2 gap-2 flex-1">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
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
                                    className="w-full border-border bg-card text-sm"
                                  />
                                </div>
                                <div className="flex items-center">
                                  <span className="mx-1 text-xs text-muted-foreground">
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
                                    className="w-full border-border bg-card text-sm"
                                  />
                                </div>
                              </div>
                              {/* Only show delete button when there are multiple slots */}
                              {dayData.slots.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeTimeSlot(day, i)}
                                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-all"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {index < dayNames.length - 1 && (
                      <Separator className="my-3 bg-border/60" />
                    )}
                  </div>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>

      <InfoNotice icon={<Clock size={14} />}>
        These hours will be used for scheduling appointments unless overridden
        by special dates.
      </InfoNotice>
    </div>
  );
}

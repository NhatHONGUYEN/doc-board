// src/components/Availability/SpecialDatesCard.tsx
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Trash2, X, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { useAvailabilityStore } from "@/lib/store/useAvailabilityStore";

export default function SpecialDatesCard({ isLoading = false }) {
  const {
    specialDates,
    isSpecialDateDialogOpen,
    newSpecialDate,
    newSpecialDateType,
    newSpecialDateSlots,
    openSpecialDateDialog,
    closeSpecialDateDialog,
    setNewSpecialDate,
    setNewSpecialDateType,
    addSpecialDate,
    removeSpecialDate,
    addSpecialDateTimeSlot,
    removeSpecialDateTimeSlot,
    updateSpecialDateTimeSlot,
  } = useAvailabilityStore();

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Special Dates
          </CardTitle>

          <Dialog
            open={isSpecialDateDialogOpen}
            onOpenChange={(open) =>
              open ? openSpecialDateDialog() : closeSpecialDateDialog()
            }
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-1"
                onClick={openSpecialDateDialog}
              >
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
                <Button variant="ghost" onClick={closeSpecialDateDialog}>
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
              Click &quot;Add Special Date&quot; to set days off or custom hours
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
  );
}

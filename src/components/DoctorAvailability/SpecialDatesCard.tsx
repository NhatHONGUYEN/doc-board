// src/components/Availability/SpecialDatesCard.tsx
import { format } from "date-fns";
import {
  CalendarIcon,
  Loader2,
  Plus,
  Trash2,
  X,
  Info,
  CalendarDays,
  Clock,
  Calendar,
} from "lucide-react";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useAvailabilityStore } from "@/lib/store/useAvailabilityStore";
import { InfoNotice } from "@/components/InfoNotice";

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
    <Card className="overflow-hidden transition-all duration-300 group border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]">
      <CardHeader className="bg-card border-b border-border p-5 pb-3">
        <div className="flex justify-between items-center pb-4">
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/90 rounded-md flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className="text-card-foreground">Special Dates</span>
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
                className="bg-primary hover:bg-primary/90 transition-all flex items-center gap-1"
                onClick={openSpecialDateDialog}
              >
                <Plus className="h-4 w-4" />
                Add Special Date
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/90 rounded-md flex items-center justify-center">
                    <Calendar className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span>Add Special Date</span>
                </DialogTitle>
                <DialogDescription>
                  Set days off or custom working hours for specific dates.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="specialDate"
                    className="text-xs text-muted-foreground"
                  >
                    Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="specialDate"
                        variant="outline"
                        className="justify-start text-left font-normal border-border bg-card hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {newSpecialDate
                          ? format(newSpecialDate, "PPP")
                          : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
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
                  <Label
                    htmlFor="specialDateType"
                    className="text-xs text-muted-foreground"
                  >
                    Type
                  </Label>
                  <Select
                    value={newSpecialDateType}
                    onValueChange={(value) =>
                      setNewSpecialDateType(value as "dayoff" | "custom")
                    }
                  >
                    <SelectTrigger
                      id="specialDateType"
                      className="border-border bg-card"
                    >
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
                    <Label className="text-xs text-muted-foreground">
                      Custom Hours
                    </Label>
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
                            className="border-border bg-card"
                          />
                          <div className="flex items-center">
                            <span className="mx-2 text-xs text-muted-foreground">
                              to
                            </span>
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
                              className="flex-1 border-border bg-card"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSpecialDateTimeSlot(i)}
                          disabled={newSpecialDateSlots.length === 1}
                          className="hover:bg-destructive/10 hover:text-destructive transition-all"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSpecialDateTimeSlot}
                      className="flex items-center justify-center gap-1 mt-1 border-border bg-card hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Add Time Slot
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeSpecialDateDialog}
                  className="border-border bg-card hover:bg-muted-foreground/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addSpecialDate}
                  disabled={!newSpecialDate}
                  className="bg-primary hover:bg-primary/90 transition-all"
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Set exceptions like days off, holidays or special working hours
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 p-5 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : specialDates.length === 0 ? (
          <div className="text-center py-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No special dates set
            </p>
            <p className="text-xs text-muted-foreground mt-1">
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
                  className="flex items-start justify-between border border-border rounded-lg p-4 transition-all hover:bg-card/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center mr-2">
                          <Calendar className="h-3 w-3 text-primary" />
                        </div>
                        <h4 className="font-medium text-sm text-card-foreground">
                          {format(new Date(specialDate.date), "PP")}
                        </h4>
                      </div>
                      <Badge
                        variant={
                          specialDate.type === "dayoff"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          specialDate.type === "custom"
                            ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                            : ""
                        }
                      >
                        {specialDate.type === "dayoff"
                          ? "Day Off"
                          : "Custom Hours"}
                      </Badge>
                    </div>

                    {specialDate.type === "custom" && specialDate.slots && (
                      <div className="flex items-center ml-7">
                        <Clock className="h-3 w-3 text-primary mr-2" />
                        <span className="text-xs text-muted-foreground">
                          {specialDate.slots.map((slot, i) => (
                            <span key={i}>
                              {slot.startTime} - {slot.endTime}
                              {i < specialDate.slots!.length - 1 && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {specialDate.type === "dayoff" && (
                      <div className="text-xs text-muted-foreground ml-7">
                        Not available on this date
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpecialDate(specialDate.id)}
                    className="hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-card border-t border-border p-5">
        <InfoNotice
          icon={<Info size={14} />}
          note="Special dates override your regular weekly schedule. Remember to save your changes."
        >
          Important: These exceptions will take priority over your normal
          availability when patients book appointments.
        </InfoNotice>
      </CardFooter>
    </Card>
  );
}

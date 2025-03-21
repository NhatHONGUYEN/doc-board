// src/lib/store/useAvailabilityStore.ts
import { create } from "zustand";
import { format } from "date-fns";
import { toast } from "sonner";

// Types
export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export type DayAvailability = {
  enabled: boolean;
  slots: TimeSlot[];
};

export type WeeklySchedule = {
  [key: number]: DayAvailability; // key is day of week (1-7, Monday-Sunday)
};

export type SpecialDate = {
  id: string;
  date: string;
  type: "dayoff" | "custom";
  slots?: TimeSlot[];
};

// Default schedule
export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  1: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  2: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  3: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  4: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  5: { enabled: true, slots: [{ startTime: "09:00", endTime: "17:00" }] },
  6: { enabled: false, slots: [] },
  7: { enabled: false, slots: [] },
};

// Define parameter type for saveCallback
type SaveAvailabilityParams = {
  doctorId: string;
  weeklySchedule: WeeklySchedule;
  specialDates: Array<{
    date: string;
    timeSlots: Array<{
      start: string;
      end: string;
    }>;
  }>;
};

type AvailabilityState = {
  // Data
  weeklySchedule: WeeklySchedule;
  specialDates: SpecialDate[];

  // Dialog state
  isSpecialDateDialogOpen: boolean;
  newSpecialDate: Date | undefined;
  newSpecialDateType: "dayoff" | "custom";
  newSpecialDateSlots: TimeSlot[];

  // UI state
  isSaving: boolean;

  // Actions - Weekly Schedule
  setWeeklySchedule: (schedule: WeeklySchedule) => void;
  toggleDayEnabled: (day: number) => void;
  addTimeSlot: (day: number) => void;
  removeTimeSlot: (day: number, index: number) => void;
  updateTimeSlot: (
    day: number,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => void;

  // Actions - Special Dates
  setSpecialDates: (dates: SpecialDate[]) => void;
  openSpecialDateDialog: () => void;
  closeSpecialDateDialog: () => void;
  setNewSpecialDate: (date: Date | undefined) => void;
  setNewSpecialDateType: (type: "dayoff" | "custom") => void;
  addSpecialDate: () => void;
  removeSpecialDate: (id: string) => void;
  resetSpecialDateForm: () => void;

  // Actions - Special Date Time Slots
  addSpecialDateTimeSlot: () => void;
  removeSpecialDateTimeSlot: (index: number) => void;
  updateSpecialDateTimeSlot: (
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => void;

  // Actions - Saving
  saveAvailability: (
    doctorId: string,
    saveCallback: (params: SaveAvailabilityParams) => void
  ) => void;

  // Initialize from API data
  initializeFromApiData: (availabilityData: {
    weeklySchedule?: WeeklySchedule;
    specialDates?: SpecialDate[];
  }) => void;

  // Reset store
  resetStore: () => void;
};

// Initial state
const initialState = {
  weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
  specialDates: [],
  isSpecialDateDialogOpen: false,
  newSpecialDate: undefined,
  newSpecialDateType: "dayoff" as const,
  newSpecialDateSlots: [{ startTime: "09:00", endTime: "17:00" }],
  isSaving: false,
};

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  ...initialState,

  // Actions - Weekly Schedule
  setWeeklySchedule: (schedule) => set({ weeklySchedule: schedule }),

  toggleDayEnabled: (day) => {
    set((state) => ({
      weeklySchedule: {
        ...state.weeklySchedule,
        [day]: {
          ...state.weeklySchedule[day],
          enabled: !state.weeklySchedule[day].enabled,
          slots: state.weeklySchedule[day].enabled
            ? []
            : [{ startTime: "09:00", endTime: "17:00" }],
        },
      },
    }));
  },

  addTimeSlot: (day) => {
    set((state) => {
      const slots = state.weeklySchedule[day].slots;
      const lastSlot = slots[slots.length - 1];
      const newSlot = { startTime: lastSlot.endTime, endTime: "18:00" };

      return {
        weeklySchedule: {
          ...state.weeklySchedule,
          [day]: {
            ...state.weeklySchedule[day],
            slots: [...slots, newSlot],
          },
        },
      };
    });
  },

  removeTimeSlot: (day, index) => {
    set((state) => ({
      weeklySchedule: {
        ...state.weeklySchedule,
        [day]: {
          ...state.weeklySchedule[day],
          slots: state.weeklySchedule[day].slots.filter((_, i) => i !== index),
        },
      },
    }));
  },

  updateTimeSlot: (day, index, field, value) => {
    set((state) => ({
      weeklySchedule: {
        ...state.weeklySchedule,
        [day]: {
          ...state.weeklySchedule[day],
          slots: state.weeklySchedule[day].slots.map((slot, i) =>
            i === index ? { ...slot, [field]: value } : slot
          ),
        },
      },
    }));
  },

  // Actions - Special Dates
  setSpecialDates: (dates) => set({ specialDates: dates }),

  openSpecialDateDialog: () => set({ isSpecialDateDialogOpen: true }),

  closeSpecialDateDialog: () => set({ isSpecialDateDialogOpen: false }),

  setNewSpecialDate: (date) => set({ newSpecialDate: date }),

  setNewSpecialDateType: (type) => set({ newSpecialDateType: type }),

  addSpecialDate: () => {
    const {
      newSpecialDate,
      newSpecialDateType,
      newSpecialDateSlots,
      specialDates,
    } = get();

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

    set((state) => ({
      specialDates: [...state.specialDates, specialDate],
      isSpecialDateDialogOpen: false,
    }));

    get().resetSpecialDateForm();
  },

  removeSpecialDate: (id) => {
    set((state) => ({
      specialDates: state.specialDates.filter((sd) => sd.id !== id),
    }));
  },

  resetSpecialDateForm: () => {
    set({
      newSpecialDate: undefined,
      newSpecialDateType: "dayoff",
      newSpecialDateSlots: [{ startTime: "09:00", endTime: "17:00" }],
    });
  },

  // Actions - Special Date Time Slots
  addSpecialDateTimeSlot: () => {
    set((state) => {
      const slots = state.newSpecialDateSlots;
      const lastSlot = slots[slots.length - 1];
      const newSlot = { startTime: lastSlot.endTime, endTime: "18:00" };

      return {
        newSpecialDateSlots: [...slots, newSlot],
      };
    });
  },

  removeSpecialDateTimeSlot: (index) => {
    set((state) => ({
      newSpecialDateSlots: state.newSpecialDateSlots.filter(
        (_, i) => i !== index
      ),
    }));
  },

  updateSpecialDateTimeSlot: (index, field, value) => {
    set((state) => ({
      newSpecialDateSlots: state.newSpecialDateSlots.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  },

  // Actions - Saving
  saveAvailability: (doctorId, saveCallback) => {
    const { weeklySchedule, specialDates } = get();

    set({ isSaving: true });

    // Transform local specialDates to match the structure expected by the API
    const transformedSpecialDates = specialDates.map((date) => ({
      date: date.date,
      timeSlots:
        date.type === "dayoff"
          ? []
          : (date.slots || []).map((slot) => ({
              start: slot.startTime,
              end: slot.endTime,
            })),
    }));

    // Call the mutation function from TanStack Query
    saveCallback({
      doctorId,
      weeklySchedule,
      specialDates: transformedSpecialDates,
    });

    // Note: The isSaving state is reset in the component when the mutation completes
  },

  // Initialize from API data
  initializeFromApiData: (availabilityData) => {
    if (!availabilityData) return;

    if (
      availabilityData.weeklySchedule &&
      Object.keys(availabilityData.weeklySchedule).length > 0
    ) {
      set({ weeklySchedule: availabilityData.weeklySchedule });
    }

    if (availabilityData.specialDates) {
      set({ specialDates: availabilityData.specialDates });
    }
  },

  // Reset store
  resetStore: () => set(initialState),
}));

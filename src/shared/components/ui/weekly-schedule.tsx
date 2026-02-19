import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetClose,
    SheetTitle,
    SheetDescription,
} from "@/shared/components/ui/sheet";
import TimeRangeSlider from "@/shared/components/ui/TimeRangeSlider";

export type DaySchedule = {
    day: string;
    startTime: string;
    endTime: string;
    isClosed: boolean;
};

export type WeeklyScheduleValue = DaySchedule[];

interface WeeklyScheduleProps {
    value?: WeeklyScheduleValue;
    onChange?: (value: WeeklyScheduleValue) => void;
    disabled?: boolean;
}

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

// Helper to convert HH:MM string to minutes (0-1440)
const timeToMinutes = (time: string): number => {
    if (!time) return 0; // Default 00:00 if empty
    const [h, m] = time.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return 0;
    return h * 60 + m;
};

// Helper to convert minutes to HH:MM string
const minutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

export function WeeklySchedule({
    value,
    onChange,
    disabled,
}: WeeklyScheduleProps) {
    // Initialize state
    const [schedule, setSchedule] = React.useState<WeeklyScheduleValue>(() => {
        if (value && value.length > 0) return value;
        return DAYS.map((day) => ({
            day,
            startTime: "",
            endTime: "",
            isClosed: false,
        }));
    });

    // Sync state with prop
    React.useEffect(() => {
        if (value) {
            setSchedule((prev) => {
                if (JSON.stringify(value) !== JSON.stringify(prev)) {
                    return value;
                }
                return prev;
            });
        }
    }, [value]);

    // Sheet State
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [editingDayIndex, setEditingDayIndex] = React.useState<number | null>(null);
    const [tempTimeRange, setTempTimeRange] = React.useState<number[]>([0, 1440]); // [00:00, 24:00]

    const handleTimeClick = (index: number) => {
        const day = schedule[index];
        const startMins = day.startTime ? timeToMinutes(day.startTime) : 0;
        const endMins = day.endTime ? timeToMinutes(day.endTime) : 1440;

        setEditingDayIndex(index);
        setTempTimeRange([startMins, endMins]);
        setIsSheetOpen(true);
    };

    const handleSaveSheet = () => {
        if (editingDayIndex === null) return;

        const newSchedule = [...schedule];
        newSchedule[editingDayIndex] = {
            ...newSchedule[editingDayIndex],
            startTime: minutesToTime(tempTimeRange[0]),
            endTime: minutesToTime(tempTimeRange[1]),
            isClosed: false, // Assume open if setting time
        };

        setSchedule(newSchedule);
        onChange?.(newSchedule);
        setIsSheetOpen(false);
    };

    return (
        <>
            <div className="space-y-2">
                <div className="space-y-2 border border-gray-200 rounded-xl bg-gray-50 p-3">
                    {schedule.map((daySchedule, index) => (
                        <div
                            key={daySchedule.day}
                            className={cn(
                                "flex items-center justify-between h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl transition-all duration-200",
                                disabled && "opacity-50 pointer-events-none"
                            )}
                        >
                            <span className="text-gray-900 font-medium truncate flex-1">
                                {daySchedule.day}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 font-mono">
                                    {daySchedule.startTime && daySchedule.endTime
                                        ? `${daySchedule.startTime} - ${daySchedule.endTime}`
                                        : "Not Set"
                                    }
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={disabled}
                                    onClick={() => handleTimeClick(index)}
                                    className="h-8 text-xs font-medium border-green-600 hover:bg-green-50 hover:text-green-700 text-green-700"
                                >
                                    Start/End Time
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                {/* Overriding classes to make it float like a card */}
                <SheetContent
                    side="top"
                    className={cn(
                        "h-auto p-0",
                        // Resetting default sheet positioning to float
                        "!inset-x-0 !top-4 !left-[50%] !translate-x-[-50%] !w-[95vw] md:!w-[550px] !max-w-none !rounded-xl !border shadow-2xl",
                        "bg-white data-[state=open]:slide-in-from-top-4"
                    )}
                >
                    <SheetTitle className="sr-only">Configure Time</SheetTitle>
                    <SheetDescription className="sr-only">Set availability window</SheetDescription>
                    <div className="pt-2 px-2 pb-0">
                        {/* Integrated slider without explicit header text as requested */}
                        <TimeRangeSlider
                            value={tempTimeRange}
                            onValueChange={setTempTimeRange}
                            min={0}
                            max={1440}
                            step={30}
                            className="border-0 bg-transparent shadow-none p-2 space-y-4"
                        />
                    </div>

                    <SheetFooter className="pb-4 px-4 pt-0 bg-white rounded-b-xl flex-row gap-4 justify-center">
                        <Button onClick={handleSaveSheet} className="w-32 bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                        <SheetClose asChild>
                            <Button variant="outline" className="w-32">Cancel</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}

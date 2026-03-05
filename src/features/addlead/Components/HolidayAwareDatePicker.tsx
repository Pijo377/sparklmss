import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useCheckIsHoliday } from "../hooks/useCheckHoliday";
import { DatePicker } from "./FormField";

interface Props {
  label: string;
  id: string;
  value?: Date;
  error?: string;
  disabled?: (date: Date) => boolean;
  onValidDate: (date: Date) => void;
}

export const HolidayAwareDatePicker = ({
  label,
  id,
  value,
  error,
  disabled,
  onValidDate
}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ?? null);
  const [localError, setLocalError] = useState<string | null>(null);
  const lastValidatedDateStr = useRef<string | null>(null);
  const lastPropValueStr = useRef<string | null>(value ? format(value, "yyyy-MM-dd") : null);

  // Sync parent value only if the prop itself has changed
  useEffect(() => {
    const newValStr = value ? format(value, "yyyy-MM-dd") : null;

    if (newValStr !== lastPropValueStr.current) {
      lastPropValueStr.current = newValStr;
      setSelectedDate(value ?? null);
      lastValidatedDateStr.current = newValStr;
    }
  }, [value]);

  // Format date for API
  const paydate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined;

  // Call holiday check hook
  const { data, isFetching } = useCheckIsHoliday(paydate);

  // Check holiday immediately on data change OR when fetch completes
  useEffect(() => {
    // Only proceed if we have data and a selected date, and it's NOT currently fetching (stale data prevention)
    if (!data || !selectedDate || isFetching) return;

    const result = data.Table?.[0];
    const currentDateStr = format(selectedDate, "yyyy-MM-dd");

    if (result?.IsHoliday) {
      setLocalError("Selected date is a holiday. Please choose another day.");
      lastValidatedDateStr.current = null; // Reset since it's invalid
    } else {
      setLocalError(null);
      // Only fire parent update if this specific date string hasn't been successfully pushed up yet
      if (lastValidatedDateStr.current !== currentDateStr) {
        lastValidatedDateStr.current = currentDateStr;
        onValidDate(selectedDate);
      }
    }
  }, [data, selectedDate, onValidDate, isFetching]);

  // Handle date selection from calendar
  const handleDateChange = (dateValue: Date | string | undefined) => {
    if (!dateValue) {
      setSelectedDate(null);
      lastValidatedDateStr.current = null;
      setLocalError(null);
      return;
    }

    const newDate = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    if (isNaN(newDate.getTime())) return;

    // prevent unnecessary rerender if same date clicked
    const oldDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
    const newDateStr = format(newDate, "yyyy-MM-dd");

    if (newDateStr === oldDateStr) return;

    setLocalError(null); // Clear errors immediately as user is picking something new
    setSelectedDate(newDate);
    // onValidDate is NOT called here; it will be called by the useEffect after holiday check finishes
  };

  return (
    <DatePicker
      label={label}
      id={id}
      value={selectedDate ?? undefined}
      error={localError || error}
      disabled={disabled}
      onDateChange={handleDateChange}
    />
  );
};

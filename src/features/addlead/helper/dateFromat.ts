export const parseAPIDate = (apiDate?: string) => {
  if (!apiDate) return undefined;
  // Take only YYYY-MM-DD part, ignore time and timezone
  const datePart = apiDate.split("T")[0];
  return new Date(datePart); // interprets as local date midnight
};


import { format } from "date-fns";
import { useCheckIsHoliday } from "../hooks/useCheckHoliday";
import { useEffect } from "react";

export const useHolidayValidation = (
  selectedDate?: Date,
  onInvalid?: () => void
) => {
  const formattedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : undefined;

  const { data, isFetching } = useCheckIsHoliday(formattedDate);

  useEffect(() => {
    // Only validate if we have data, a date, and we're NOT currently fetching a new result
    if (!isFetching && data?.Table?.[0]?.IsHoliday) {
      onInvalid?.();
    }
  }, [data, onInvalid, isFetching]);

  return {
    isHoliday: !isFetching && (data?.Table?.[0]?.IsHoliday ?? false),
    isFetching,
  };
};

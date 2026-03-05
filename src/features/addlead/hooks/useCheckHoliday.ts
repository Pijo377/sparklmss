import { useQuery } from "@tanstack/react-query";
import { checkIsHoliday, type CheckIsHolidayResponse } from "../api/checkHoliday.api";

export const useCheckIsHoliday = (paydate?: string) =>
  useQuery<CheckIsHolidayResponse>({
    queryKey: ["check-is-holiday", paydate],
    queryFn: () => checkIsHoliday(paydate!),
    enabled: !!paydate, // 👈 only call when date exists
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });

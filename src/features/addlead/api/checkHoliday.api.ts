import api from "@/shared/lib/apiClient";

export interface HolidayCheck {
  IsWeekday: boolean;
  IsHoliday: boolean;
}

export interface CheckIsHolidayResponse {
  Table: HolidayCheck[];
}
export const checkIsHoliday = async (
  paydate: string // format: YYYY-MM-DD
): Promise<CheckIsHolidayResponse> => {
  const res = await api.get<CheckIsHolidayResponse>(
    "/api/LMGeneral/v1/CheckIsHoliday",
    {
      params: {
        paydate,
      },
    }
  );

  return res.data;
};

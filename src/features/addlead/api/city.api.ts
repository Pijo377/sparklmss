import api from "@/shared/lib/apiClient";

export interface City {
  CityName: string;
}

export interface GetCityInfoResponse {
  Table: City[];
}

export const getCityInfo = async (
  stateName: string
): Promise<GetCityInfoResponse> => {
  const res = await api.get<GetCityInfoResponse>(
    `/api/LMGeneral/v1/GetcityInfo`,
    {
      params: {
        contextKey: stateName, // e.g. "Arizona"
      },
    }
  );

  return res.data;
};

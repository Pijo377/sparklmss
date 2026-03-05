import api from "@/shared/lib/apiClient";

export interface ZipInfo {
  Zip: number;
}

export interface GetZipInfoResponse {
  Table: ZipInfo[];
}

export const getZipInfo = async (
  stateName: string,
  cityName: string
): Promise<GetZipInfoResponse> => {
  const res = await api.get<GetZipInfoResponse>(
    "/api/LMGeneral/v1/GetzipInfo",
    {
      params: {
        contextKey: `${stateName},${cityName}`, // e.g. "Arizona,Pinetop"
      },
    }
  );

  return res.data;
};

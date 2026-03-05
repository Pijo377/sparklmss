import { useQuery } from "@tanstack/react-query";
import { loadStates, type LoadStatesResponse, } from "../api/states.api";
import { getCityInfo, type GetCityInfoResponse } from "../api/city.api";
import { getZipInfo, type GetZipInfoResponse } from "../api/zip.api";


export const useStates = () =>
  useQuery<LoadStatesResponse>({
    queryKey: ["states"],
    queryFn: loadStates,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });



export const useCityInfo = (stateName?: string) =>
  useQuery<GetCityInfoResponse>({
    queryKey: ["city-info", stateName],
    queryFn: () => getCityInfo(stateName!),
    enabled: !!stateName, // 👈 only runs when state is selected
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });


export const useZipInfo = (
  stateName?: string,
  cityName?: string
) =>
  useQuery<GetZipInfoResponse>({
    queryKey: ["zip-info", stateName, cityName],
    queryFn: () => getZipInfo(stateName!, cityName!),
    enabled: !!stateName && !!cityName, // 👈 dependent query
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });

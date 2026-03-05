import { useQuery } from "@tanstack/react-query";
import { getPreferredLanguages, type GetPreferredLanguagesResponse } from "../api/language.api";

export const usePreferredLanguages = () =>
  useQuery<GetPreferredLanguagesResponse>({
    queryKey: ["preferred-languages"],
    queryFn: getPreferredLanguages,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });
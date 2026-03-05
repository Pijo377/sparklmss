import { useQuery } from "@tanstack/react-query";
import { getCampaignDetailsForInternalLeads, type GetCampaignDetailsResponse } from "../api/GetCampaignDetailsForInternalLeads.api";

export const useCampaignDetailsForInternalLeads = (
  leadFrom: string = "ADD",
  loanID: number = 0,
  merchandiseType: string = "I"
) =>
  useQuery<GetCampaignDetailsResponse>({
    queryKey: [
      "campaign-details-internal",
      leadFrom,
      loanID,
      merchandiseType,
    ],
    queryFn: () =>
      getCampaignDetailsForInternalLeads(
        leadFrom,
        loanID,
        merchandiseType
      ),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });

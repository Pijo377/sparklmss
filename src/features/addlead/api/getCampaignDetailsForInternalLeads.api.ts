import api from "@/shared/lib/apiClient";

export interface CampaignDetails {
  _id: string;
  MerchandiseName: string;
  MerchandiseType: string;
  CampaignName: string;
  CampaignUser: string;
  MinMonthSalary: number;
  MaxMonthSalary: number;
  CampaignPassword: string;
  Subaffiliateid: number;
}

export interface GetCampaignDetailsResponse {
  Table: CampaignDetails[];
}

export const getCampaignDetailsForInternalLeads = async (
  leadFrom: string = "ADD",
  loanID: number = 0,
  merchandiseType: string = "I"
): Promise<GetCampaignDetailsResponse> => {
  const res = await api.get<GetCampaignDetailsResponse>(
    "/api/LMManageLeads/v1/GetCampaignDetailsForInternalLeads",
    {
      params: {
        LeadFrom: leadFrom,
        LoanID: loanID,
        merchandiseType: merchandiseType,
      },
    }
  );

  return res.data;
};

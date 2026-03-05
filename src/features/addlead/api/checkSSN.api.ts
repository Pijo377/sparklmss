import api from "@/shared/lib/apiClient";

// Table4 entries can vary, so keep it flexible
export interface Table4Row {
  LoanAmount?: number;
  MerchandiseType?: string;
}

// Generic table row (fallback-safe)
export type AnyTableRow = Record<string, any>;

export interface FindCustomerDetailsResponse {
  Table: AnyTableRow[];
  Table1: AnyTableRow[];
  Table2: AnyTableRow[];
  Table3: AnyTableRow[];
  Table4: Table4Row[];
  Table5: AnyTableRow[];
  Table6: AnyTableRow[];
}
export const findCustomerDetails = async (
  ssn: string
): Promise<FindCustomerDetailsResponse> => {
  const res = await api.post<FindCustomerDetailsResponse>(
    "/api/LMDashboard/v1/FindCustomerDetails",
    null, // no body
    {
      params: { SSN: ssn }, // query param
    }
  );

  return res.data;
};

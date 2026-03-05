import { useQuery } from "@tanstack/react-query";
import { findCustomerDetails, type FindCustomerDetailsResponse } from "../api/checkSSN.api";

export const useFindCustomerDetails = (ssn?: string) =>
  useQuery<FindCustomerDetailsResponse>({
    queryKey: ["find-customer-details", ssn],
    queryFn: () => findCustomerDetails(ssn!),
    enabled: false,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    gcTime: 5 * 60 * 1000,
  });

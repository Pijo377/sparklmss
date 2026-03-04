import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

// --- Types ---
export interface AchProviderMappingRow {
    id: string;
    providerName: string;
    productName: string;
}

// --- Mock Data ---
export const initialAchProviderData: AchProviderMappingRow[] = [
    { id: "1", providerName: "PeopleFirstBank", productName: "SplitFeePaymentProduct" },
    { id: "2", providerName: "Transact24", productName: "ATMND50" },
    { id: "3", providerName: "Transact24", productName: "AutoTitleCABProduct" },
    { id: "4", providerName: "Transact24", productName: "TXCABCSO_MN" },
    { id: "5", providerName: "ATFinancial", productName: "PDTN_15" },
];

export const providerOptions = ["PeopleFirstBank", "Transact24", "ATFinancial", "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",
    "PDTN_15","PDTN_15",
    "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",];
export const productOptions = [
    "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",
    "PDTN_15",
    "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",
    "PDTN_15",
    "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",
    "PDTN_15",
    "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",
    "PDTN_15",
    "SplitFeePaymentProduct",
    "ATMND50",
    "AutoTitleCABProduct",
    "TXCABCSO_MN",
    "PDTN_15",
];

// --- Table Configuration ---
export const achProviderColumns: ColumnDef<AchProviderMappingRow>[] = [
    { key: "providerName", header: "ACH Provider Name", sortable: true, width: "50%" },
    { key: "productName", header: "Product Name", sortable: true, width: "50%" },
];

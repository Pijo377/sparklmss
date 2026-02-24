import { Briefcase, Package, Tag, GitBranch } from "lucide-react";
import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface MappingRow {
    id: string;
    name: string;
    field: string;
}

export interface TabConfig {
    value: string;
    label: string;
    icon: React.ReactNode;
    selectLabel1: string;
    selectLabel2: string;
    options1: string[];
    options2: string[];
    data: MappingRow[];
    tableTitle: string;
    nameHeader: string;
    fieldHeader: string;
}

// ─── Mock data per tab ──────────────────────────────────────────────────────────
const portfolioProductData: MappingRow[] = [
    { id: "1", name: "Default Portfolio", field: "CSO2025jultesting" },
    { id: "2", name: "Default Portfolio", field: "FggvyProduct" },
    { id: "3", name: "Premium Portfolio", field: "PDWI_MN_5" },
    { id: "4", name: "Premium Portfolio", field: "PDSC_MN_8.75" },
    { id: "5", name: "Standard Portfolio", field: "PDMN_MN_50" },
];

const productCampaignData: MappingRow[] = [
    { id: "1", name: "CSO2025jultesting", field: "CabTypeCampWeekly" },
    { id: "2", name: "FggvyProduct", field: "SplitFeePaymentWeekly" },
    { id: "3", name: "PDWI_MN_5", field: "CabTypeCampMonth" },
    { id: "4", name: "PDSC_MN_8.75", field: "ScheduleIntallType%Weekly" },
    { id: "5", name: "PDMN_MN_50", field: "CMPMO_BWSM_400" },
];

const rebateCampaignData: MappingRow[] = [
    { id: "1", name: "Thanksgiving Rebate", field: "CabTypeCampWeekly" },
    { id: "2", name: "Thanksgiving Rebate", field: "SplitFeePaymentWeekly" },
    { id: "3", name: "Thanksgiving Rebate", field: "CabTypeCampMonth" },
    { id: "4", name: "Thanksgiving Rebate", field: "ScheduleIntallType%Weekly" },
    { id: "5", name: "Thanksgiving Rebate", field: "CMPMO_BWSM_400" },
    { id: "6", name: "Thanksgiving Rebate", field: "CMPMO_WK_400" },
    { id: "7", name: "Thanksgiving Rebate", field: "CABBiWeekly25" },
];

const hierarchicalData: MappingRow[] = [
    { id: "1", name: "Parent Portfolio A", field: "Child Portfolio A1" },
    { id: "2", name: "Parent Portfolio A", field: "Child Portfolio A2" },
    { id: "3", name: "Parent Portfolio B", field: "Child Portfolio B1" },
    { id: "4", name: "Parent Portfolio B", field: "Child Portfolio B2" },
    { id: "5", name: "Parent Portfolio C", field: "Child Portfolio C1" },
];

// ─── Tab Configurations ─────────────────────────────────────────────────────────
export const tabConfigs: TabConfig[] = [
    {
        value: "portfolio-product",
        label: "Portfolio & Product Mapping",
        icon: <Briefcase className="h-4 w-4" />,
        selectLabel1: "Portfolio",
        selectLabel2: "Product",
        options1: ["Default Portfolio", "Premium Portfolio", "Standard Portfolio"],
        options2: ["CSO2025jultesting", "FggvyProduct", "PDWI_MN_5", "PDSC_MN_8.75", "PDMN_MN_50"],
        data: portfolioProductData,
        tableTitle: "Portfolio & Product Mapping",
        nameHeader: "Portfolio Name",
        fieldHeader: "Product Name",
    },
    {
        value: "product-campaign",
        label: "Product & Campaign Mapping",
        icon: <Package className="h-4 w-4" />,
        selectLabel1: "Product",
        selectLabel2: "Campaign",
        options1: ["CSO2025jultesting", "FggvyProduct", "PDWI_MN_5", "PDSC_MN_8.75", "PDMN_MN_50"],
        options2: ["CabTypeCampWeekly", "SplitFeePaymentWeekly", "CabTypeCampMonth", "ScheduleIntallType%Weekly", "CMPMO_BWSM_400"],
        data: productCampaignData,
        tableTitle: "Product & Campaign Mapping",
        nameHeader: "Product Name",
        fieldHeader: "Campaign Name",
    },
    {
        value: "rebate-campaign",
        label: "Rebate/Promo Code & Campaign Mapping",
        icon: <Tag className="h-4 w-4" />,
        selectLabel1: "Rebate/Promo Code",
        selectLabel2: "Campaign",
        options1: ["Thanksgiving Rebate", "Holiday Promo", "New Year Rebate"],
        options2: ["CabTypeCampWeekly", "SplitFeePaymentWeekly", "CabTypeCampMonth", "ScheduleIntallType%Weekly", "CMPMO_BWSM_400", "CMPMO_WK_400", "CABBiWeekly25"],
        data: rebateCampaignData,
        tableTitle: "Rebate/Promo Code & Campaign Mapping",
        nameHeader: "Rebate/Promo Code Name",
        fieldHeader: "Campaign Name",
    },
    {
        value: "hierarchical",
        label: "Hierarchical View",
        icon: <GitBranch className="h-4 w-4" />,
        selectLabel1: "Select Parent",
        selectLabel2: "Select Child",
        options1: ["Parent Portfolio A", "Parent Portfolio B", "Parent Portfolio C"],
        options2: ["Child Portfolio A1", "Child Portfolio A2", "Child Portfolio B1", "Child Portfolio B2", "Child Portfolio C1"],
        data: hierarchicalData,
        tableTitle: "Hierarchical View",
        nameHeader: "Parent Name",
        fieldHeader: "Child Name",
    },
];

// ─── Column Builder ─────────────────────────────────────────────────────────────
export const buildColumns = (nameHeader: string, fieldHeader: string): ColumnDef<MappingRow>[] => [
    { key: "name", header: nameHeader, sortable: true, width: 400 },
    { key: "field", header: fieldHeader, sortable: true, width: 400 },
];

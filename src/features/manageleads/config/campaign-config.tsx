
import type { EditSheetField } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

export interface Campaign {
    id: string;
    campaignName: string;
    userName: string;
    password: string;
    maxHourlyLead: number;
    maxDailyLeads: number;
    active: boolean;
    minLoanAmount: number;
    maxLoanAmount: number;
    firstPaymentMinDuration: number;
    firstPaymentMaxDuration: number;
    loanToIncomeRatio: number;
    isAchCoolOffNeeded: boolean;
    achCoolOffDays?: number;
    leadCost: number;
    autoOriginateGroup: string;
    bureauGroupName: string;
    movePayDateOnHoliday: string;
    sellRejectedLeads: boolean;
    campaignType: string;
    description?: string;
    submissionSchedule?: any[];
    [key: string]: any;
}

export const initialData: Campaign[] = [
    { id: "1", campaignName: "CSOJul2025", userName: "admin", password: "Tql@dmin#2019", maxHourlyLead: 100, maxDailyLeads: 100, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A", description: "Standard campaign description" },
    { id: "2", campaignName: "testWEB", userName: "Johndoe", password: "Tql@dmin#2019", maxHourlyLead: 2, maxDailyLeads: 7, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
    { id: "3", campaignName: "EggvyAutoCampaign", userName: "AutoCampai", password: "Eggvy@#2024", maxHourlyLead: 20, maxDailyLeads: 100, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
    { id: "4", campaignName: "EggvyCAMP", userName: "eggvy", password: "Eggvy#@2024", maxHourlyLead: 0, maxDailyLeads: 200, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
    { id: "5", campaignName: "CMPWI_WK_5", userName: "Wisconsin5", password: "Wiscon$5", maxHourlyLead: 50, maxDailyLeads: 100, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
    { id: "6", campaignName: "CMPWI_BWSM_5", userName: "Wisconsin5", password: "Wiscon$5", maxHourlyLead: 50, maxDailyLeads: 100, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
    { id: "7", campaignName: "CMPWI_MN_5", userName: "Wisconsin5", password: "Wiscon$5", maxHourlyLead: 50, maxDailyLeads: 100, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
    { id: "8", campaignName: "CMPSC_WK_8_75", userName: "SCarol8_75", password: "C@rol875", maxHourlyLead: 50, maxDailyLeads: 100, active: true, minLoanAmount: 100, maxLoanAmount: 1000, firstPaymentMinDuration: 10, firstPaymentMaxDuration: 30, loanToIncomeRatio: 0.5, isAchCoolOffNeeded: false, leadCost: 10, autoOriginateGroup: "Group A", bureauGroupName: "Bureau A", movePayDateOnHoliday: "Before", sellRejectedLeads: false, campaignType: "Type A" },
];

export const columns: ColumnDef<Campaign>[] = [
    { header: "Campaign Name", key: "campaignName" },
    { header: "User Name", key: "userName" },
    { header: "Password", key: "password" },
    { header: "Max Hourly Lead", key: "maxHourlyLead" },
    { header: "Max Daily Leads", key: "maxDailyLeads" },
];

export const editSheetFields: EditSheetField[] = [
    { key: "campaignName", label: "Campaign Name", type: "text", required: true, placeholder: "Enter Campaign Name" },
    { key: "userName", label: "User Name", type: "text", required: true, placeholder: "Enter User Name" },
    { key: "password", label: "Password", type: "password", required: true, placeholder: "Enter Password" },
    { key: "maxHourlyLead", label: "Max Hourly Lead", type: "number", required: true, placeholder: "Enter Max Hourly Lead", validate: (val) => Number(val) < 0 ? "Must be positive" : null },
    {
        key: "maxDailyLeads",
        label: "Max Daily Leads",
        type: "number",
        required: true,
        placeholder: "Enter Max Daily Leads",
        validate: (val) => {
            if (Number(val) < 0) return "Must be positive";
            return null;
        }
    },
    { key: "minLoanAmount", label: "Min Loan Amount", type: "number", required: true, placeholder: "Enter Min Loan Amount", validate: (val) => Number(val) < 0 ? "Must be positive" : null },
    {
        key: "maxLoanAmount",
        label: "Max Loan Amount",
        type: "number",
        required: true,
        placeholder: "Enter Max Loan Amount",
        validate: (val, data) => {
            if (Number(val) < 0) return "Must be positive";
            if (Number(val) < Number(data.minLoanAmount)) return "Cannot be less than Min Loan Amount";
            return null;
        }
    },
    { key: "firstPaymentMinDuration", label: "First Payment Min Duration", type: "number", required: true, placeholder: "Enter Min Duration", validate: (val) => Number(val) < 0 ? "Must be positive" : null },
    {
        key: "firstPaymentMaxDuration",
        label: "First Payment Max Duration",
        type: "number",
        required: true,
        placeholder: "Enter Max Duration",
        validate: (val, data) => {
            if (Number(val) < 0) return "Must be positive";
            if (Number(val) < Number(data.firstPaymentMinDuration)) return "Cannot be less than Min Duration";
            return null;
        }
    },
    { key: "loanToIncomeRatio", label: "Loan to Income Ratio", type: "number", required: true, placeholder: "Enter Ratio", validate: (val) => Number(val) < 0 ? "Must be positive" : null },
    { key: "isAchCoolOffNeeded", label: "Is ACH Cool-Off Needed?", type: "checkbox" },
    {
        key: "achCoolOffDays",
        label: "ACH Cool-Off Days",
        type: "number",
        hiddenIf: (data: Record<string, any>) => !data.isAchCoolOffNeeded,
        placeholder: "Enter Days"
    },
    { key: "leadCost", label: "Lead Cost", type: "number", required: true, placeholder: "Enter Lead Cost", validate: (val) => Number(val) < 0 ? "Must be positive" : null },
    {
        key: "autoOriginateGroup",
        label: "Auto Originate Group",
        type: "select",
        options: [{ label: "Group A", value: "Group A" }, { label: "Group B", value: "Group B" }],
        required: true
    },
    {
        key: "bureauGroupName",
        label: "Bureau Group Name",
        type: "select",
        options: [{ label: "Bureau A", value: "Bureau A" }, { label: "Bureau B", value: "Bureau B" }],
        required: true
    },
    {
        key: "movePayDateOnHoliday",
        label: "Move Pay Date on Holiday",
        type: "select",
        options: [{ label: "Before", value: "Before" }, { label: "After", value: "After" }],
        required: true
    },
    { key: "sellRejectedLeads", label: "Sell Rejected Leads", type: "checkbox" },
    { key: "active", label: "Is this Campaign active?", type: "checkbox" },
    {
        key: "campaignType",
        label: "Campaign Type",
        type: "select",
        options: [{ label: "Type A", value: "Type A" }, { label: "Type B", value: "Type B" }],
        required: true
    },
    {
        key: "description",
        label: "Campaign Description",
        type: "textarea",
        placeholder: "Enter Campaign Description"
    },
    {
        key: "submissionSchedule",
        label: "Allocated Time for Submission",
        type: "schedule",

    }
];

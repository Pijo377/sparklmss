
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
    // 1️⃣ Campaign Name
    {
        key: "campaignName",
        label: "Campaign Name",
        type: "text",
        required: true,
        maxLength: 25,
        placeholder: "Enter Campaign Name",
        validate: (val) => {
            const s = String(val ?? "");
            if (s.trim().length === 0) return "* Please enter Campaign Name.";
            if (s.length > 0 && s.trim().length === 0) return "* Please enter  Campaign Name."; // This is for empty space specifically in Angular logic
            return null;
        }
    },
    // 2️⃣ User Name
    {
        key: "userName",
        label: "User Name",
        type: "text",
        required: true,
        maxLength: 10,
        placeholder: "Enter User Name",
        validate: (val) => {
            const s = String(val ?? "");
            if (s.trim().length === 0) return "* Please enter User Name.";
            if (s.length > 0 && s.trim().length === 0) return "* Please enter  User Name.";
            return null;
        }
    },
    // 3️⃣ Password
    {
        key: "password",
        label: "Password",
        type: "password",
        required: true,
        maxLength: 32,
        placeholder: "Enter Password",
        validate: (val) => {
            const s = String(val ?? "");
            if (s.trim().length === 0) return "* Please enter Password.";
            if (s.length > 0 && s.trim().length === 0) return "* Please enter Password.";
            return null;
        }
    },
    // 4️⃣ Campaign Type
    {
        key: "campaignType",
        label: "Campaign Type",
        type: "select",
        options: [
            { label: "–Select–", value: "0" },
            { label: "Internal", value: "i" },
            { label: "External", value: "e" },
        ],
        required: true,
        validate: (val) => {
            if (String(val) === "0" || !val) return "* Please select the Campaign Type.";
            return null;
        }
    },
    // 5️⃣ Max Hourly Lead
    {
        key: "maxHourlyLead",
        label: "Max Hourly Lead",
        type: "text",
        required: true,
        maxLength: 25,
        format: (val: string) => val.replace(/\D/g, ""),
        placeholder: "Enter Max Hourly Lead",
        validate: (val) => {
            if (val === "" || val === null || val === undefined) return "* Please enter Max Hourly Leads.";
            const n = Number(val);
            if (Number.isFinite(n) && n < 0) return "* Please enter Max Hourly Leads.";
            return null;
        }
    },
    // 6️⃣ Max Daily Leads
    {
        key: "maxDailyLeads",
        label: "Max Daily Leads",
        type: "text",
        required: true,
        maxLength: 25,
        format: (val: string) => val.replace(/\D/g, ""),
        placeholder: "Enter Max Daily Leads",
        validate: (val) => {
            if (val === "" || val === null || val === undefined) return "* Please enter Max Daily Leads.";
            const n = Number(val);
            if (Number.isFinite(n) && n < 0) return "* Please enter Max Daily Leads.";
            return null;
        }
    },
    // 7️⃣ Min Loan Amount
    {
        key: "minLoanAmount",
        label: "Min Loan Amount",
        type: "currency",
        required: true,
        max: 9999999999,
        maxLength: 32,
        placeholder: "Enter Min Loan Amount",
        validate: (val) => {
            if (val === "" || val === null || val === undefined) return "* Please enter Min Loan Amount.";
            const n = Number(String(val).replace(/,/g, ""));
            if (Number.isFinite(n) && n < 0) return "* Please enter Min Loan Amount.";
            return null;
        }
    },
    // 8️⃣ Max Loan Amount
    {
        key: "maxLoanAmount",
        label: "Max Loan Amount",
        type: "currency",
        required: true,
        max: 9999999999,
        maxLength: 32,
        placeholder: "Enter Max Loan Amount",
        validate: (val, data) => {
            if (val === "" || val === null || val === undefined) return "* Please enter Max Loan Amount.";
            const n = Number(String(val).replace(/,/g, ""));
            if (Number.isFinite(n) && n < 0) return "* Please enter Max Loan Amount.";
            const minVal = Number(String(data.minLoanAmount).replace(/,/g, ""));
            if (Number.isFinite(n) && Number.isFinite(minVal) && n <= minVal)
                return "* Max Loan Amount must be greater than Min Loan Amount.";
            return null;
        }
    },
    // 9️⃣ First Payment Min Duration
    {
        key: "firstPaymentMinDuration",
        label: "First Payment Min Duration",
        type: "text",
        required: true,
        maxLength: 25,
        format: (val: string) => val.replace(/\D/g, ""),
        placeholder: "Enter Min Duration",
        validate: (val) => {
            if (val === "" || val === null || val === undefined) return "* Please enter First Payment Min Duration.";
            const n = Number(val);
            if (Number.isFinite(n) && n < 0) return "* Please enter First Payment Min Duration.";
            return null;
        }
    },
    // 1️⃣0️⃣ First Payment Max Duration
    {
        key: "firstPaymentMaxDuration",
        label: "First Payment Max Duration",
        type: "text",
        required: true,
        maxLength: 25,
        format: (val: string) => val.replace(/\D/g, ""),
        placeholder: "Enter Max Duration",
        validate: (val, data) => {
            if (val === "" || val === null || val === undefined) return "* Please enter First Payment Max Duration.";
            const n = Number(val);
            if (Number.isFinite(n) && n < 0) return "* Please enter First Payment Max Duration.";
            const minVal = Number(data.firstPaymentMinDuration);
            if (Number.isFinite(n) && Number.isFinite(minVal) && n <= minVal)
                return "* First Payment Max Duration must be greater than First Payment Min Duration.";
            return null;
        }
    },
    // 1️⃣1️⃣ Loan to Income Ratio
    {
        key: "loanToIncomeRatio",
        label: "Loan to Income Ratio",
        type: "text",
        required: true,
        maxLength: 25,
        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        placeholder: "Enter Ratio (e.g. 50.000)",
        validate: (val) => {
            if (val === "" || val === null || val === undefined) return "* Please enter Loan to Income Ratio.";
            const n = Number(val);
            if (Number.isFinite(n) && n < 0) return "* Please enter Loan to Income Ratio.";
            return null;
        }
    },
    // 1️⃣2️⃣ Is ACH Cool-Off Needed?
    { key: "isAchCoolOffNeeded", label: "Is ACH Cool-Off Needed?", type: "checkbox" },
    // 1️⃣3️⃣ ACH Cool-Off Days
    {
        key: "achCoolOffDays",
        label: "ACH Cool-Off Days",
        type: "text",
        maxLength: 25,
        format: (val: string) => val.replace(/\D/g, ""),
        hiddenIf: (data: Record<string, any>) => !data.isAchCoolOffNeeded,
        placeholder: "Enter Days",
        validate: (val, data) => {
            if (!data.isAchCoolOffNeeded) return null; // skip validation when hidden
            const s = String(val ?? "").trim();
            if (s === "") return "* Please enter the Days";
            const n = Number(val);
            if (!Number.isFinite(n) || n < 0) return "* Please enter the Days";
            return null;
        }
    },
    // 1️⃣4️⃣ Lead Cost
    {
        key: "leadCost",
        label: "Lead Cost",
        type: "currency",
        required: true,
        max: 9999999999,
        maxLength: 32,
        placeholder: "Enter Lead Cost",
        validate: (val) => {
            if (val === "" || val === null || val === undefined) return "* Please enter the Lead Cost";
            const n = Number(String(val).replace(/,/g, ""));
            if (Number.isFinite(n) && n < 0) return "* Please enter the Lead Cost";
            return null;
        }
    },
    // 1️⃣5️⃣ Auto Originate Group
    {
        key: "autoOriginateGroup",
        label: "Auto Originate Group",
        type: "select",
        options: [
            { label: "–Select–", value: "0" },
            { label: "Group A", value: "Group A" },
            { label: "Group B", value: "Group B" },
        ],
        required: false,
    },
    // 1️⃣6️⃣ Bureau Group Name
    {
        key: "bureauGroupName",
        label: "Bureau Group Name",
        type: "select",
        options: [
            { label: "–Select–", value: "0" },
            { label: "Bureau A", value: "Bureau A" },
            { label: "Bureau B", value: "Bureau B" },
        ],
        required: false,
    },
    // 1️⃣7️⃣ Move Pay Date on Holiday
    {
        key: "movePayDateOnHoliday",
        label: "Move Pay Date on Holiday",
        type: "select",
        options: [
            { label: "Before", value: "B" },
            { label: "After", value: "A" },
        ],
        required: true
    },
    // 1️⃣8️⃣ Sell Rejected Leads
    { key: "sellRejectedLeads", label: "Sell Rejected Leads", type: "checkbox" },
    // 1️⃣9️⃣ Is this Campaign active?
    { key: "active", label: "Is this Campaign active?", type: "checkbox" },
    // 2️⃣0️⃣ Description
    {
        key: "description",
        label: "Campaign Description",
        type: "textarea",
        maxLength: 255,
        placeholder: "Enter Campaign Description"
    },
    // 2️⃣1️⃣ Allocated Time for Submission (Schedule)
    {
        key: "submissionSchedule",
        label: "Allocated Time for Submission",
        type: "schedule",
        validate: (val) => {
            if (!Array.isArray(val)) return null;

            const timeToMinutes = (time: string): number => {
                if (!time) return 0;
                const [h, m] = time.split(":").map(Number);
                return h * 60 + m;
            };

            for (const entry of val) {
                const start = timeToMinutes(entry.startTime);
                const end = timeToMinutes(entry.endTime);

                if (start >= end) {
                    if (entry.day === "Monday") {
                        return "* End Time must be greater than Start Time.";
                    } else {
                        return "* End Time must be greater that Start Time.";
                    }
                }
            }
            return null;
        }
    }
];

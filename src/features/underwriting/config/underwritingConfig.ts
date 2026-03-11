import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

export interface UnderwritingRule {
    id: string;
    name: string;
}

export interface ConfigurableRule extends UnderwritingRule {
    checked: boolean;
}

export const mandatoryData: UnderwritingRule[] = [
    { id: "1", name: "Validate SSN" },
    { id: "2", name: "Validate Customer Paydates" },
    { id: "3", name: "Validate Pay Frequency" },
    { id: "4", name: "Validate Primary Phone Number" },
    { id: "5", name: "Validate Home Phone Number" },
    { id: "6", name: "Validate Zip Code" },
    { id: "7", name: "Validate First Name" },
    { id: "8", name: "Validate Last Name" },
    { id: "9", name: "Validate Bank Account Number" },
    { id: "10", name: "Validate Due date on Holidays or weekends" },
    { id: "11", name: "Validate Portfolio Name" },
    { id: "12", name: "Validate Campaign Name" },
    { id: "13", name: "Validate Product Name" },
    { id: "14", name: "Validate ABA Number." },
    { id: "15", name: "Validate Customer SSN has been denied in the last x Days" },
    { id: "16", name: "Validate Customer has bad contact information" },
    { id: "17", name: "Validate Customer Already have In-Process Loan" },
    { id: "18", name: "Validate Mapping" },
    { id: "19", name: "Validate Maximum Loan amount" },
    { id: "20", name: "Validate Duplicate Email" },
    { id: "21", name: "Validate Duplicate PhoneNo" },
    { id: "22", name: "Validate Duplicate BankAccountNo" },
];

export const initialConfigurableData: ConfigurableRule[] = [
    { id: "1", name: "Validate Existing Customer", checked: false },
    { id: "2", name: "Validate Mobile phone number", checked: false },
    { id: "3", name: "Validate Work phone number", checked: false },
    { id: "4", name: "Validate Maximum Leads per hour", checked: false },
    { id: "5", name: "Validate Maximum Leads per day", checked: false },
    { id: "6", name: "Validate Bankruptcy", checked: false },
    { id: "7", name: "Validate Monthly Paid customer", checked: false },
    { id: "8", name: "Validate Weekly Paid customer", checked: false },
    { id: "9", name: "Validate Driving License Number", checked: false },
    { id: "10", name: "Validate Driving License State", checked: false },
    { id: "11", name: "Validate Bank account Number length", checked: false },
    { id: "12", name: "Validate Customer Age", checked: false },
    { id: "13", name: "Validate Customer is Military Applicants", checked: false },
    { id: "14", name: "Validate Customer Bad State", checked: false },
    { id: "15", name: "Validate Customer Total Income", checked: false },
    { id: "16", name: "Validate Customer is Employed", checked: false },
    { id: "17", name: "Validate Checking Account", checked: false },
    { id: "18", name: "Validate SubAffiliateID", checked: false },
    { id: "19", name: "Validate Customer State", checked: false },
    { id: "20", name: "Validate xVerify", checked: false },
    { id: "21", name: "Validate Payment Type Must be Direct Deposit", checked: false },
    { id: "22", name: "Validate ABA Screening", checked: false },
    { id: "23", name: "Check Existing Account Number", checked: false },
    { id: "24", name: "Validate Chassis Number", checked: false },
    { id: "25", name: "Validate Insurance Number", checked: false },
    { id: "26", name: "Validate Mileage", checked: false },
    { id: "27", name: "Validate Email Address", checked: false },
    { id: "28", name: "Validate Bad Email", checked: false },
    { id: "29", name: "Validate Bad SSN", checked: false },
    { id: "30", name: "Validate Bad IPAddress", checked: false },
    { id: "31", name: "Validate Customer Maximum Income", checked: false },
    { id: "32", name: "Validate Bad Customer", checked: false },
];

export const mandatoryColumns: ColumnDef<UnderwritingRule>[] = [
    { key: "name", header: "Underwriting Name" },
];

export const configurableColumns: ColumnDef<ConfigurableRule>[] = [
    { key: "name", header: "Underwriting Name" },
];

export const productRulesMapping: Record<string, boolean[]> = {
    "product1": new Array(32).fill(false).map((_, i) => i % 2 === 0),
    "product2": new Array(32).fill(false).map((_, i) => i % 3 === 0),
    "product3": new Array(32).fill(true),
};

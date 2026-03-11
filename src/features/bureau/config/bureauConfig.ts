import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

// --- Types ---

export interface BureauRow {
    id: string;
    bureauName: string;
    postingType: string;
    responseType: string;
    productionUrl: string;
    testUrl: string;
    isActive: boolean;
}

export interface BureauFieldFormData {
    bureauName: string;
    bureauFieldName: string;
    bureauParameter: string;
    isActive: boolean;
}

export interface BureauControlFormData {
    searchControlName: string; // For Card 1
    bureauName: string;
    bureauControlName: string;
    bureauFieldName: string;
    bureauFieldValue: string;
    isActive: boolean;
}

export const bureauOptions = [
    { value: "MicroBilt", label: "MicroBilt" },
    { value: "DataX", label: "DataX" },
    { value: "Clarity", label: "Clarity" },
    { value: "FactorTrust", label: "FactorTrust" },
];

export const bureauFieldOptions = [
    { value: "LicenseKey", label: "LicenseKey" },
    { value: "Password", label: "Password" },
    { value: "Score", label: "Score" },
];

export const operatorTypeOptions = [
    { value: "Alphabets", label: "Alphabets" },
    { value: "Numeric", label: "Numeric" },
    { value: "Alpha-numeric", label: "Alpha-numeric" },
];

export const operatorOptions = [
    { value: "=", label: "=" },
    { value: "!=", label: "!=" },
    { value: ">", label: ">" },
    { value: "<", label: "<" },
    { value: ">=", label: ">=" },
    { value: "<=", label: "<=" },
    { value: "contains", label: "contains" },
];

export const conditionOptions = [
    { value: "AND", label: "AND" },
    { value: "OR", label: "OR" },
];

export const postingTypeOptions = [
    { value: "JSON", label: "JSON" },
    { value: "XML", label: "XML" },
    { value: "FORM", label: "FORM" },
];

export const responseTypeOptions = [
    { value: "JSON", label: "JSON" },
    { value: "XML", label: "XML" },
];

export const statusOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
];

export interface BureauFieldRow {
    id: string;
    bureauName: string;
    bureauFieldName: string;
    bureauParameter: string;
    status: string;
}

export interface BureauControlRow {
    id: string;
    bureauControlName: string;
    bureauName: string;
    bureauFieldName: string;
    bureauFieldValue: string;
    status: string;
    isActive: boolean;
}

export interface BureauGroupFormData {
    bureauGroupNameTop: string;
    isActiveTop: boolean;
    bureauGroupNameBottom: string;
    isActiveBottom: boolean;
}

export interface BureauVerificationFormData {
    bureauGroupName: string;
    controlFile: string;
    bureauName: string;
    parameterTag: string;
    decisionDataType: string;
    decisionOperator: string;
    decisionValue: string;
    condition: string;
    isActive: boolean;
}

export interface BureauGroupRow {
    id: string;
    bureauGroupName: string;
    mappedFiles: string;
    status: string;
    isActive: boolean;
}

export interface BureauVerificationRow {
    id: string;
    bureauGroupName: string;
    bureauName: string;
    bureauControlName: string;
    parameter: string;
    operatorType: string;
    operator: string;
    value: string;
    condition: string;
    status: string;
}

// --- Columns ---

export const bureauColumns: ColumnDef<BureauRow>[] = [
    { key: "bureauName", header: "Bureau Name" },
    { key: "postingType", header: "Posting Type" },
    { key: "responseType", header: "Response Type" },
    { key: "productionUrl", header: "Production URL" },
    { key: "testUrl", header: "Test URL" },
];

export const bureauFieldColumns: ColumnDef<BureauFieldRow>[] = [
    { key: "bureauName", header: "Bureau Name" },
    { key: "bureauFieldName", header: "Bureau Field Name" },
    { key: "bureauParameter", header: "Bureau Parameter" },
    { key: "status", header: "Status" },
];

export const bureauControlColumns: ColumnDef<BureauControlRow>[] = [
    { key: "bureauControlName", header: "Bureau Control Name" },
    { key: "bureauName", header: "Bureau Name" },
    { key: "bureauFieldName", header: "Bureau Field Name" },
    { key: "bureauFieldValue", header: "Bureau Field Value" },
    { key: "status", header: "Status" },
];

export const bureauGroupColumns: ColumnDef<BureauGroupRow>[] = [
    { key: "bureauGroupName", header: "Bureau Group Name" },
    { key: "mappedFiles", header: "Mapped Control Files" },
    { key: "status", header: "Status" },
];

export const bureauVerificationColumns: ColumnDef<BureauVerificationRow>[] = [
    { key: "bureauGroupName", header: "Bureau Group Name" },
    { key: "bureauName", header: "Bureau Name" },
    { key: "bureauControlName", header: "Bureau Control Name" },
    { key: "parameter", header: "Parameter" },
    { key: "operatorType", header: "Operator Type" },
    { key: "operator", header: "Operator" },
    { key: "value", header: "Value" },
    { key: "condition", header: "Condition" },
    { key: "status", header: "Status" },
];

// --- Dummy Data ---

export const bureauData: BureauRow[] = [
    {
        id: "1",
        bureauName: "MicroBilt",
        postingType: "JSON",
        responseType: "JSON",
        productionUrl: "https://api.microbilt.com",
        testUrl: "https://apitest.microbilt.com",
        isActive: true,
    },
];

export const bureauFieldData: BureauFieldRow[] = [
    {
        id: "1",
        bureauName: "DataX",
        bureauFieldName: "LicenseKey",
        bureauParameter: "DataX_CRA",
        status: "Yes",
    },
    {
        id: "2",
        bureauName: "DataX",
        bureauFieldName: "Password",
        bureauParameter: "DataX_CRA",
        status: "Yes",
    },
    {
        id: "3",
        bureauName: "DataX",
        bureauFieldName: "Posting Type",
        bureauParameter: "DataX_CRA",
        status: "Yes",
    },
    {
        id: "4",
        bureauName: "DataX",
        bureauFieldName: "Response Type",
        bureauParameter: "DataX_CRA",
        status: "Yes",
    },
    {
        id: "5",
        bureauName: "DataX",
        bureauFieldName: "Status",
        bureauParameter: "DataX_CRA",
        status: "Yes",
    },
    {
        id: "8",
        bureauName: "DataX",
        bureauFieldName: "IsActive",
        bureauParameter: "DataX_CRA",
        status: "Yes",
    },
    {
        id: "6",
        bureauName: "MicroBilt",
        bureauFieldName: "Score",
        bureauParameter: "MicroBilt_Score",
        status: "Yes",
    },
    {
        id: "7",
        bureauName: "MicroBilt",
        bureauFieldName: "Status",
        bureauParameter: "MicroBilt_Score",
        status: "Yes",
    },
    {
        id: "9",
        bureauName: "MicroBilt",
        bureauFieldName: "IsActive",
        bureauParameter: "MicroBilt_Score",
        status: "Yes",
    },
];

export const bureauControlData: BureauControlRow[] = [
    {
        id: "1",
        bureauControlName: "MicroBilt_Control",
        bureauName: "MicroBilt",
        bureauFieldName: "Score",
        bureauFieldValue: "600",
        status: "Yes",
        isActive: true,
    },
    {
        id: "2",
        bureauControlName: "DataX_Control",
        bureauName: "DataX",
        bureauFieldName: "LicenseKey",
        bureauFieldValue: "DATAX123",
        status: "Yes",
        isActive: true,
    },
];

export const bureauVerificationData: BureauVerificationRow[] = [
    {
        id: "1",
        bureauGroupName: "Standard",
        bureauName: "MicroBilt",
        bureauControlName: "MicroBilt_Control",
        parameter: "Score",
        operatorType: "Numeric",
        operator: ">",
        value: "600",
        condition: "AND",
        status: "Yes",
    },
];

export const bureauGroupData: BureauGroupRow[] = [
    {
        id: "1",
        bureauGroupName: "DataXModGroup",
        mappedFiles: "DX_BAV_MVS, UpStreamCustom",
        status: "Yes",
        isActive: true,
    }
];

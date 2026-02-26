
import type { EditSheetField } from "@/features/scoringcost/ui/edit-sheet/EditSheet";
import type { ColumnDef } from "@/features/scoringcost/ui/data-table/types";

// Type definitions for ScoringCost
export interface ScoringCost {
    id: string;
    bureau: string;
    verificationName: string;
    parameterTag: string;
    parameterDataType: string;
    decisionOperator: string;
    decisionValue: string;
    cost: string;
    isActive: boolean;
    [key: string]: any;
}

// Mock Data based on the provided image
export const initialData: ScoringCost[] = [
    {
        id: "1",
        bureau: "UpStream-Logix",
        verificationName: "IDNetworkAttributesforFraud",
        parameterTag: "Risk Score",
        parameterDataType: "Integer",
        decisionOperator: "Equals",
        decisionValue: "100",
        cost: "0.260000",
        isActive: true,
    },
    {
        id: "2",
        bureau: "UpStream-Logix",
        verificationName: "CreditOptics",
        parameterTag: "Credit Score",
        parameterDataType: "Integer",
        decisionOperator: "Greater Than",
        decisionValue: "600",
        cost: "0.430000",
        isActive: true,
    },
    {
        id: "3",
        bureau: "UpStream-Logix",
        verificationName: "IDNetworkAttributesforCompliance",
        parameterTag: "Compliance Check",
        parameterDataType: "Boolean",
        decisionOperator: "Equals",
        decisionValue: "True",
        cost: "0.260000",
        isActive: true,
    },
    {
        id: "4",
        bureau: "UpStream-Logix",
        verificationName: "IDScoreAction",
        parameterTag: "Action Code",
        parameterDataType: "String",
        decisionOperator: "Contains",
        decisionValue: "Review",
        cost: "0.490000",
        isActive: true,
    },
    {
        id: "5",
        bureau: "UpStream-Logix",
        verificationName: "IDScore",
        parameterTag: "Identity Score",
        parameterDataType: "Integer",
        decisionOperator: "Less Than",
        decisionValue: "50",
        cost: "0.260000",
        isActive: true,
    },
    {
        id: "6",
        bureau: "UpStream-Logix",
        verificationName: "Comply360",
        parameterTag: "Compliance 360",
        parameterDataType: "Boolean",
        decisionOperator: "Equals",
        decisionValue: "True",
        cost: "0.220000",
        isActive: true,
    },
    {
        id: "7",
        bureau: "DataX",
        verificationName: "IDSABucketCost",
        parameterTag: "Bucket ID",
        parameterDataType: "Integer",
        decisionOperator: "Equals",
        decisionValue: "5",
        cost: "0.650000",
        isActive: true,
    },
    {
        id: "8",
        bureau: "DataX",
        verificationName: "IDVBucketCost",
        parameterTag: "IDV Bucket",
        parameterDataType: "Integer",
        decisionOperator: "Equals",
        decisionValue: "2",
        cost: "0.250000",
        isActive: true,
    },
];

// Edit Sheet Fields Configuration
export const editSheetFields: EditSheetField[] = [
    {
        key: "bureau",
        label: "Bureau",
        type: "select",
        options: [
            { label: "–Select–", value: "0" },
            { label: "UpStream-Logix", value: "UpStream-Logix" },
            { label: "DataX", value: "DataX" },
        ],
        required: true,
        placeholder: "Select Bureau",
        validate: (val) => (!val || val === "0" ? "* Please select the Bureau." : null),
    },
    {
        key: "verificationName",
        label: "Verification Name",
        type: "text",
        required: true,
        placeholder: "Enter Verification Name",

        validate: (val) => (!val || String(val).trim().length === 0 ? "* Please enter Verification Name." : null),
    },
    {
        key: "parameterTag",
        label: "Parameter Tag",
        type: "text",
        required: true,
        placeholder: "Enter Parameter Tag",

        validate: (val) => (!val || String(val).trim().length === 0 ? "* Please enter Parameter Tag." : null),
    },
    {
        key: "parameterDataType",
        label: "Parameter Data Type",
        type: "select",
        options: [
            { value: "A", label: "Alphabets" },
            { value: "N", label: "Numeric" },
            { value: "S", label: "Alpha-Numeric" },
            { value: "E", label: "Exist" },
        ],
        required: true,
        placeholder: "Select Data Type",
        validate: (val) => (!val ? "* Please select the Parameter Data Type." : null),
    },
    {
        key: "decisionOperator",
        label: "Decision Operator",
        type: "select",
        options: [
            { value: "EQ", label: "=" },
            { value: "NE", label: "!=" },
            { value: "GT", label: ">" },
            { value: "GE", label: ">=" },
            { value: "LT", label: "<" },
            { value: "LE", label: "<=" },
        ],
        optionsIf: (data) => {
            const type = data.parameterDataType;
            if (type === "A" || type === "S") {
                return [
                    { value: "EQ", label: "=" },
                    { value: "NE", label: "!=" },
                ];
            }
            if (type === "N") {
                return [
                    { value: "GT", label: ">" },
                    { value: "GE", label: ">=" },
                    { value: "LT", label: "<" },
                    { value: "LE", label: "<=" },
                    { value: "EQ", label: "=" },
                    { value: "NE", label: "!=" },
                ];
            }
            return [];
        },
        disabledIf: (data) => data.parameterDataType === "E",
        required: true,
        placeholder: "Select Operator",
    },
    {
        key: "decisionValue",
        label: "Decision Value",
        type: "text",
        placeholder: "Enter Decision Value",

        disabledIf: (data) => data.parameterDataType === "E",
        validate: (val, data) => {
            if (data.parameterDataType !== "E" && (!val || String(val).trim().length === 0)) {
                return "* Please enter valid the Decision Value.";
            }
            return null;
        },
    },
    {
        key: "cost",
        label: "Cost [$]",
        type: "currency",
        required: true,
        placeholder: "0.000000",
        validate: (val) => {
            if (!val || String(val).trim().length === 0) return "* Please enter the Cost.";
            const num = parseFloat(String(val).replace(/,/g, ''));
            if (isNaN(num)) return "* Please enter valid the Cost.";
            return null;
        },
    },
    {
        key: "isActive",
        label: "Is this Scoring Cost active?",
        type: "checkbox",
    },
];

// Column Definitions
export const columns: ColumnDef<ScoringCost>[] = [
    {
        key: "bureau",
        header: "Bureau",
        sortable: true,
    },
    {
        key: "verificationName",
        header: "Verification Name",
        sortable: true,
    },
    {
        key: "cost",
        header: "Cost [$]",
        sortable: true,
    },
];

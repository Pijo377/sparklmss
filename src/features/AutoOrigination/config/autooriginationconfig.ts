import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";
import type { EditSheetField } from "@/features/manageleads/ui/edit-sheet/EditSheet.tsx";

// --- Auto Originate Group ---

export interface AutoOriginateGroup {
    id: string;
    groupName: string;
    bureauGroup: string;
    executeTime: number;
    status: "Active" | "Inactive";
    isActive: boolean;
    [key: string]: unknown;
}

export const groupColumns: ColumnDef<AutoOriginateGroup>[] = [
    {
        key: "groupName",
        header: "Auto Originate Group Name",
    },
    {
        key: "bureauGroup",
        header: "Bureau Group",
    },
    {
        key: "executeTime",
        header: "AO Job Execute Time Before ACH (Min)",
        align: "center",
    },
];

export const groupInitialData: AutoOriginateGroup[] = [
    {
        id: "1",
        groupName: "AOtestGrpup",
        bureauGroup: "testBureau_group",
        executeTime: 40,
        status: "Active",
        isActive: true,
    },
    {
        id: "2",
        groupName: "AODxBavMvsUPCustom",
        bureauGroup: "DXBAVMVS_UPSCustom",
        executeTime: 20,
        status: "Active",
        isActive: true,
    },
    {
        id: "3",
        groupName: "AODataXLowGroup",
        bureauGroup: "DataXLowGroup",
        executeTime: 20,
        status: "Active",
        isActive: true,
    },
    {
        id: "4",
        groupName: "AODataXModGroup",
        bureauGroup: "DataXModGroup",
        executeTime: 20,
        status: "Active",
        isActive: true,
    },
];

export const groupEditFields: EditSheetField[] = [
    {
        key: "groupName",
        label: "Auto Originate Group Name",
        type: "text",
        maxLength: 100,
        required: true,
    },
    {
        key: "bureauGroup",
        label: "Bureau Group",
        type: "select",
        options: [
            { value: "testBureau_group", label: "testBureau_group" },
            { value: "DXBAVMVS_UPSCustom", label: "DXBAVMVS_UPSCustom" },
            { value: "DataXLowGroup", label: "DataXLowGroup" },
            { value: "DataXModGroup", label: "DataXModGroup" },
        ],
        required: true,
    },
    {
        key: "executeTime",
        label: "AO Job Execute Time Before ACH (Min)",
        type: "minutes",
        required: true,
        min: 0,
        max: 999,
        validate: (value) => !value ? "* Please enter AO Job Execute Time." : (Number(value) < 0 ? "* Please enter AO Job Execute Time." : null)
    },
    {
        key: "isActive",
        label: "Is this Configuration active?",
        type: "checkbox",
        required: false,
    },
];

// --- Auto Originate Rule ---

export interface AutoOriginateRule {
    id: string;
    groupName: string;
    bureauGroup: string;
    bureau: string;
    bureauControl: string;
    parameterField: string;
    operatorType: string;
    operator1: string;
    check: string;
    condition?: string;
    status: "Active" | "Inactive";
    isActive: boolean;
    [key: string]: unknown;
}

export const ruleColumns: ColumnDef<AutoOriginateRule>[] = [
    {
        key: "groupName",
        header: "Auto Originate Group Name",
    },
    {
        key: "bureauGroup",
        header: "Bureau Group",
    },
    {
        key: "bureau",
        header: "Bureau",
    },
    {
        key: "bureauControl",
        header: "Bureau Control",
    },
    {
        key: "parameterField",
        header: "Parameter Field",
    },
    {
        key: "operatorType",
        header: "Operator Type",
        align: "center",
    },
    {
        key: "operator1",
        header: "Operator 1",
        align: "center",
    },
    {
        key: "check",
        header: "CheckValue 1",
        align: "center",
    },
    {
        key: "isActive",
        header: "Status",
        render: (value: any) => (value ? "True" : "False"),
        align: "center",
    },
];

export const ruleInitialData: AutoOriginateRule[] = [
    {
        id: "r1",
        groupName: "AODataXModGroup",
        bureauGroup: "DataXModGroup",
        bureau: "DataX",
        bureauControl: "DataXPrefMod",
        parameterField: "//DataxResponse/GlobalDecision/Result",
        operatorType: "Alphabets",
        operator1: "-",
        check: "Y",
        status: "Active",
        isActive: true,
    },
    {
        id: "r2",
        groupName: "AOtestGrpup",
        bureauGroup: "testBureau_group",
        bureau: "TestBureau",
        bureauControl: "Control_Test",
        parameterField: "test_field_1",
        operatorType: "Numeric",
        operator1: "=",
        check: "100",
        status: "Active",
        isActive: true,
    },
    {
        id: "r3",
        groupName: "AODataXLowGroup",
        bureauGroup: "DataXLowGroup",
        bureau: "DataX",
        bureauControl: "DataX_Low_Control",
        parameterField: "//DataxResponse/Score",
        operatorType: "Numeric",
        operator1: "<",
        check: "500",
        status: "Active",
        isActive: true,
    },
    {
        id: "r4",
        groupName: "AODxBavMvsUPCustom",
        bureauGroup: "DXBAVMVS_UPSCustom",
        bureau: "DataX",
        bureauControl: "DataX_Primary_Control",
        parameterField: "//DataxResponse/CustomScore",
        operatorType: "Numeric",
        operator1: ">",
        check: "700",
        status: "Active",
        isActive: true,
    },
    {
        id: "r5",
        groupName: "AODataXModGroup",
        bureauGroup: "DataXModGroup",
        bureau: "DataX",
        bureauControl: "DataXPrefMod",
        parameterField: "//DataxResponse/DetailedDecision/Code",
        operatorType: "Alphabets",
        operator1: "=",
        check: "A1",
        status: "Active",
        isActive: true,
    }
];

export const ruleEditFields: EditSheetField[] = [
    {
        key: "groupName",
        label: "Auto Originate Group Name",
        type: "select",
        options: [
            { value: "AODataXModGroup", label: "AODataXModGroup" },
            { value: "AODataXLowGroup", label: "AODataXLowGroup" },
            { value: "AOtestGrpup", label: "AOtestGrpup" },
            { value: "AODxBavMvsUPCustom", label: "AODxBavMvsUPCustom" },
        ],
        required: true,
    },
    {
        key: "bureauGroup",
        label: "Bureau Group Name",
        type: "text",
        required: true,
    },
    {
        key: "bureauControl",
        label: "Bureau Control Name",
        type: "select",
        options: [
            { value: "DataXPrefMod", label: "DataXPrefMod" },
            { value: "Control_Test", label: "Control_Test" },
        ],
        required: true,
    },
    {
        key: "bureau",
        label: "Bureau Name",
        type: "text",
        required: true,
    },
    {
        key: "parameterField",
        label: "Parameter Field",
        type: "text",
        maxLength: 500,
        required: true,
    },
    {
        key: "operatorType",
        label: "Operator Data Type",
        type: "select",
        options: [
            { value: "Alphabets", label: "Alphabets" },
            { value: "Numeric", label: "Numeric" },
            { value: "Alpha-Numeric", label: "Alpha-Numeric" },
        ],
        required: true,
    },
    {
        key: "operator1",
        label: "Operator 1",
        type: "select",
        options: [
            { value: "=", label: "=" },
            { value: ">", label: ">" },
            { value: "<", label: "<" },
            { value: "-", label: "-" },
        ],
        required: true,
    },
    {
        key: "check",
        label: "Check Value 1",
        type: "text",
        maxLength: 100,
        required: true,
    },
    {
        key: "condition",
        label: "Condition",
        type: "select",
        options: [
            { value: "AND", label: "AND" },
            { value: "OR", label: "OR" },
        ],
        required: true,
    },
    {
        key: "isActive",
        label: "Is this Configuration active?",
        type: "checkbox",
        required: false,
    },
];

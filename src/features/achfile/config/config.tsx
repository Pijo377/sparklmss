import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

// ── Types ──

export interface ACHConfig {
    id: string;
    fileType: string;
    groupName: string;
    destinationABA: string;
    originABA: string;
    destinationName: string;
    originName: string;
    companyId: string;
    achTaskName: string;
    returnsTaskName: string;
    returnFileExtension: string;
    provider: string;
}

// ── Initial drag-and-drop data ──

export const initialProducts = [
    { id: 'p1', name: 'Loan Product A' },
    { id: 'p2', name: 'Installment B' },
    { id: 'p3', name: 'Lease Option C' },
    { id: 'p4', name: 'Credit Line D' },
];

export const productsByProvider: Record<string, typeof initialProducts> = {
    provider1: [
        { id: 'p1', name: 'Loan Product A' },
        { id: 'p2', name: 'Installment B' },
    ],
    provider2: [
        { id: 'p3', name: 'Lease Option C' },
        { id: 'p4', name: 'Credit Line D' },
    ],
    provider3: [
        { id: 'p5', name: 'Fast Cash X' },
        { id: 'p6', name: 'Secure Loan Y' },
    ],
};

export const initialFields = [
    { id: 'f1', name: 'FirstName' },
    { id: 'f2', name: 'LastName' },
    { id: 'f3', name: 'AccountNumber' },
    { id: 'f4', name: 'RoutingNumber' },
    { id: 'f5', name: 'Amount' },
];

export const initialAddendaFields = [
    { id: 'af1', name: 'Addenda Field 1' },
    { id: 'af2', name: 'Addenda Field 2' },
    { id: 'af3', name: 'Addenda Field 3' },
];

// ── Table columns ──

export const allColumns: ColumnDef<ACHConfig>[] = [
    {
        key: "fileType",
        header: "ACH File Type",
        sortable: true,
    },
    {
        key: "groupName",
        header: "ACH Group Name",
        sortable: true,
    },
    {
        key: "destinationABA",
        header: "Immediate Destination ABA",
        sortable: true,
    },
    {
        key: "originABA",
        header: "Immediate Origin ABA",
        sortable: true,
    },
    {
        key: "destinationName",
        header: "Immediate Destination Name",
        sortable: true,
    },
    {
        key: "originName",
        header: "Immediate Origin Name",
        sortable: true,
    },
    {
        key: "companyId",
        header: "Company ID",
        sortable: true,
    },
    {
        key: "achTaskName",
        header: "ACH Task Name",
        sortable: true,
    },
    {
        key: "returnsTaskName",
        header: "Returns Task Name",
        sortable: true,
    },
];

// ── Mock data ──

export const mockData: ACHConfig[] = [
    {
        id: "1",
        fileType: "CSV",
        groupName: "Tetscsv3",
        destinationABA: "09100001",
        originABA: "09100001",
        destinationName: "WELLS FARGO",
        originName: "SPARKLMS",
        companyId: "SPARK001",
        achTaskName: "DailySync_Task_01",
        returnsTaskName: "Return_Sync_Task",
        returnFileExtension: ".csv",
        provider: "provider1",
    },
    {
        id: "2",
        fileType: "NACHA",
        groupName: "WellsFargo_Batch",
        destinationABA: "12345678",
        originABA: "87654321",
        destinationName: "CHASE",
        originName: "SPARKLMS",
        companyId: "SPARK002",
        achTaskName: "WF_Automated_Upload",
        returnsTaskName: "WF_Return_Process",
        returnFileExtension: ".nacha",
        provider: "provider2",
    },
    {
        id: "3",
        fileType: "PDS",
        groupName: "PDS_Payment_Grp",
        destinationABA: "111222333",
        originABA: "444555666",
        destinationName: "BANK OF AMERICA",
        originName: "SPARKLMS",
        companyId: "SPARK003",
        achTaskName: "PDS_Daily_Upload",
        returnsTaskName: "PDS_Return_Task",
        returnFileExtension: ".pds",
        provider: "provider3",
    },
];

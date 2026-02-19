import type { EditSheetField } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";

// Type definitions for RebatePromoCode
export interface RebatePromoCode {
    id: string;
    name: string;
    interestBy: string;
    value: string;
    applicableTo: string;
    validFrom: string;
    validTo: string;
    imageName?: string;
    imageField?: string;
    imageText?: string;
    [key: string]: any;
}

// Mock Data based on the provided image
export const initialData: RebatePromoCode[] = [
    {
        id: "1",
        name: "Test11-11",
        interestBy: "$ Amount",
        value: "10.00",
        applicableTo: "First Payment",
        validFrom: "11/12/2025",
        validTo: "11/30/2025",
        imageName: "Promo Banner 1",
        imageField: "Main Page",
        imageText: "Limited Time Offer"
    },
    {
        id: "2",
        name: "testing",
        interestBy: "$ Amount",
        value: "15.00",
        applicableTo: "First Payment",
        validFrom: "06/03/2025",
        validTo: "06/30/2025",
        imageName: "Testing Image",
        imageField: "Sidebar",
        imageText: "Test Promo"
    },
    {
        id: "3",
        name: "TestJul2025",
        interestBy: "$ Amount",
        value: "10.00",
        applicableTo: "First Payment",
        validFrom: "07/01/2025",
        validTo: "07/31/2025",
    },
    {
        id: "4",
        name: "testRebate1",
        interestBy: "Percentage",
        value: "89.00",
        applicableTo: "All Payments",
        validFrom: "N/A",
        validTo: "N/A",
    },
    {
        id: "5",
        name: "Thanksgiving Rebate",
        interestBy: "$ Amount",
        value: "10.00",
        applicableTo: "First Payment",
        validFrom: "11/01/2023",
        validTo: "11/30/2023",
    },
    {
        id: "6",
        name: "Thanksgiving Rebate",
        interestBy: "$ Amount",
        value: "10.00",
        applicableTo: "All Payments",
        validFrom: "11/15/2025",
        validTo: "11/30/2025",
    },
];

// Edit Sheet Fields Configuration
export const editSheetFields: EditSheetField[] = [
    {
        key: "name",
        label: "Rebate/Promo Code Name",
        type: "text",
        required: true,
        placeholder: "Enter code name",
    },
    {
        key: "interestBy",
        label: "Rebate/Promo Code On InterestBy",
        type: "select",
        options: [
            { value: "$ Amount", label: "$ Amount" },
            { value: "Percentage", label: "Percentage" },
        ],
        required: true,
    },
    {
        key: "value",
        label: "Rebate/Promo Code Value [$ (or) %]",
        type: "text",
        required: true,
        placeholder: "0.00",
    },
    {
        key: "applicableTo",
        label: "Applicable To",
        type: "select",
        options: [
            { value: "First Payment", label: "First Payment" },
            { value: "All Payments", label: "All Payments" },
        ],
        required: true,
    },
    {
        key: "validFrom",
        label: "Valid From",
        type: "date",
    },
    {
        key: "validTo",
        label: "Valid To",
        type: "date",
        minDate: (data) => {
            const validFrom = data.validFrom as string;
            // Handle both YYYY-MM-DD and MM/DD/YYYY formats
            if (!validFrom) return undefined;

            let date: Date;
            if (validFrom.includes('/')) {
                date = new Date(validFrom);
            } else {
                // Already YYYY-MM-DD
                date = new Date(validFrom);
            }

            if (isNaN(date.getTime())) return undefined;

            // Add 1 day
            date.setDate(date.getDate() + 1);

            // Return in YYYY-MM-DD format for the input min attribute
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        }
    },
    {
        key: "isActive",
        label: "Is this Rebate/Promo Code active?",
        type: "checkbox",
    },
];

// Column Definitions
export const columns: ColumnDef<RebatePromoCode>[] = [
    {
        key: "name",
        header: "Rebate/Promo Code Name",
        sortable: true,
    },
    {
        key: "interestBy",
        header: "Rebate/Promo Code On InterestBy",
        sortable: true,
    },
    {
        key: "value",
        header: "Rebate/Promo Code Value [$ (or) %]",
        sortable: true,
    },
    {
        key: "applicableTo",
        header: "Applicable To",
        sortable: true,
    },
    {
        key: "validFrom",
        header: "Valid From",
        sortable: true,
    },
    {
        key: "validTo",
        header: "Valid To",
        sortable: true,
    },
];

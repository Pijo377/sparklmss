import type { EditSheetField } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";
import { portfolioValidators, formatPhoneNumber, digitsOnly } from "@/features/manageleads/components/utils/utils";

// Type definitions for Portfolio
export interface Portfolio {
    id: string;
    portfolioName: string;
    address: string;
    state: string;
    cityName: string;
    zip: string;
    phone: string;
    fax: string;
    email: string;
    timeZone: string;
    movePayDateOnHoliday: string;
    withdrawLeadsAfter: number;
    maxTransactionTime: string;
    allowCustomEmail: boolean;
    prefLangEnglish: boolean;
    prefLangSpanish: boolean;
    prefLangFrench: boolean;
    [key: string]: any;
}

// Sample data matching the provided image
export const initialData: Portfolio[] = [
    {
        id: "1",
        portfolioName: "sparklms",
        address: "59 Balcones Drive",
        state: "Texas",
        cityName: "Abilene",
        zip: "79601",
        phone: "(224)-836-4174",
        fax: "(224)-836-4174",
        email: "sparklmsinfo@gmail.com",
        timeZone: "(UTC-06:00) US/Central",
        movePayDateOnHoliday: "Before",
        withdrawLeadsAfter: 7,
        maxTransactionTime: "14:30:00",
        allowCustomEmail: true,
        prefLangEnglish: true,
        prefLangSpanish: false,
        prefLangFrench: false,
    },
];

// Edit sheet fields configuration
export const editSheetFields: EditSheetField[] = [
    {
        key: "portfolioName",
        label: "Portfolio Name",
        type: "text",
        required: true,

        placeholder: "Enter portfolio name",
        validate: portfolioValidators.portfolioName,
    },
    {
        key: "address",
        label: "Address",
        type: "text",
        required: true,

        placeholder: "Enter address",
        validate: portfolioValidators.address,
    },
    {
        key: "state",
        label: "State",
        type: "select",
        required: true,
        validate: portfolioValidators.state,
        options: [
            { value: "Texas", label: "Texas" },
            { value: "California", label: "California" },
            { value: "New York", label: "New York" },
        ],
    },
    {
        key: "cityName",
        label: "City Name",
        type: "select",
        required: true,
        validate: portfolioValidators.city,
        options: [
            { value: "Abilene", label: "Abilene" },
            { value: "Los Angeles", label: "Los Angeles" },
            { value: "New York City", label: "New York City" },
        ],
    },
    {
        key: "zip",
        label: "Zip",
        type: "select",
        required: true,
        validate: portfolioValidators.zip,
        options: [
            { value: "79601", label: "79601" },
            { value: "90001", label: "90001" },
            { value: "10001", label: "10001" },
        ],
    },
    {
        key: "phone",
        label: "Phone",
        type: "text",
        required: true,
        hideMaxLimitMessage: true,
        placeholder: "Enter phone number",
        format: formatPhoneNumber,
        validate: portfolioValidators.phone,
    },
    {
        key: "fax",
        label: "Fax",
        type: "text",
        required: true,

        hideMaxLimitMessage: true,
        placeholder: "(000)-000-0000",
        format: formatPhoneNumber,
        validate: portfolioValidators.fax,
    },
    {
        key: "email",
        label: "Email",
        type: "text",
        required: true,

        placeholder: "Enter email address",
        validate: portfolioValidators.email,
    },
    {
        key: "timeZone",
        label: "TimeZone",
        type: "select",
        required: true,
        validate: portfolioValidators.timeZone,
        options: [
            { value: "(UTC-06:00) US/Central", label: "(UTC-06:00) US/Central" },
            { value: "(UTC-05:00) US/Eastern", label: "(UTC-05:00) US/Eastern" },
            { value: "(UTC-08:00) US/Pacific", label: "(UTC-08:00) US/Pacific" },
        ],
    },
    {
        key: "movePayDateOnHoliday",
        label: "Move Pay Date on Holiday",
        type: "select",
        required: true,
        validate: portfolioValidators.movePayDateOnHoliday,
        options: [
            { value: "Before", label: "Before" },
            { value: "After", label: "After" },
        ],
    },
    {
        key: "withdrawLeadsAfter",
        label: "Withdraw Leads After",
        type: "text",

        format: digitsOnly,
        placeholder: "7",
        validate: portfolioValidators.withdrawLeadsAfter,
    },
    {
        key: "maxTransactionTime",
        label: "Max Transaction Time",
        type: "time",
        required: true,
        placeholder: "HH:MM:SS",
    },
    {
        key: "allowCustomEmail",
        label: "Allow Custom Email",
        type: "checkbox",
    },
    {
        key: "prefLangEnglish",
        label: "English",
        type: "checkbox",
        groupLabel: "Preferred Languages",
    },
    {
        key: "prefLangSpanish",
        label: "Spanish",
        type: "checkbox",
        groupLabel: "Preferred Languages",
    },
    {
        key: "prefLangFrench",
        label: "French",
        type: "checkbox",
        groupLabel: "Preferred Languages",
    },
];

// Column definitions matching the image header
export const columns: ColumnDef<Portfolio>[] = [
    {
        key: "portfolioName",
        header: "Portfolio Name",
        sortable: true,
    },
    {
        key: "address",
        header: "Address",
        sortable: true,
    },
    {
        key: "state",
        header: "State",
        sortable: true,
    },
    {
        key: "cityName",
        header: "City Name",
        sortable: true,
    },
    {
        key: "zip",
        header: "Zip",
        sortable: true,
    },
    {
        key: "phone",
        header: "Phone",
        sortable: true,
    },
    {
        key: "email",
        header: "Email",
        sortable: true,
    },
    {
        key: "timeZone",
        header: "TimeZone",
        sortable: true,
    },
];

import type { ColumnDef } from "@/features/manageleads/ui/data-table/types";
import { type EditSheetField } from "@/features/manageleads/ui/edit-sheet/EditSheet";

export interface Product {
    id: string;
    productType: string;
    productName: string;
    interestRate: number;
    loanAgreementName: string;
    nsfFee: number;
    lateFee: number;
    paymentFrequency: string;
    softReturnCount: string;
    isActive: boolean;
    isOriginationFeeActive: boolean;
    originationFeeAmount: number;
    isNSFFeeActive: boolean;
    nsfFeeAmount: number;
    isLateFeeActive: boolean;
    lateFeeAmount: number;
    onlyCABCSO: boolean;
    featureOrder: Array<{ id: string; label: string }>;
    // New fields
    isPrincipalPaymentActive?: boolean;
    principalPaymentInterest?: number;
    principalPaymentAmount?: number;
    isExtensionNeeded?: boolean;
    extensionInterest?: number;
    extensionAmount?: number;
    accrueInterestOnDeferredPayment?: boolean;
    accrueInterestOnDelinquentPayment?: boolean;
    addDelinquentPrincipalToBalance?: boolean;
    deductDeferredPrincipalToBalance?: boolean;
    apr?: number;
    loanDurationMin?: number;
    loanDurationMax?: number;
    paymentDuringDrawingPeriod?: string;
    maxStandingAmount?: number;
    loanPeriodMonths?: number;
    loanPayPeriodMonths?: number;
    drawPeriodMonths?: number;
    isApplicableForAutoTitle?: boolean;
    splitCabCsoFeeForAllPayments?: boolean;
    splitCabCsoFeeAmount?: number;
    cabCsoFeePer100?: number;
    cabCsoType?: string;
    cabCsoInstallmentFeeType?: string;
    cabCsoInstallmentFeeValueCurrency?: number;
    cabCsoInstallmentFeeValueNumber?: number;
    minimumAmount?: number;
    fixedAmount?: number;
    // Dynamic fields mapping
    [key: string]: any;
}

export const columns: ColumnDef<Product>[] = [
    { key: "productType", header: "Product Type" },
    { key: "productName", header: "Product Name" },
    { key: "interestRate", header: "Interest Rate [%]" },
    { key: "loanAgreementName", header: "Loan Agreement Name" },
    { key: "nsfFee", header: "NSF Fee [$]" },
    { key: "lateFee", header: "Late Fee [$]" },
];

export const editSheetFields: EditSheetField[] = [
    {
        key: "productType",
        label: "Product Type",
        type: "select",
        options: [
            { value: "payday", label: "Payday" },
            { value: "installment", label: "Installment" },
            { value: "revolving_line_of_credit", label: "Revolving Line of Credit" },
            { value: "autotitle", label: "Auto Title" },
            { value: "cab_cso", label: "CAB/CSO" },
        ],
        placeholder: "Select Product Type",
        required: true,
        validate: (value) => !value ? "* Please select Product Type." : null
    },
    {
        key: "productName",
        label: "Product Name",
        type: "text",
        placeholder: "Enter Product Name",
        required: true,

        validate: (value) => !value ? "* Please enter Product Name." : null
    },
    {
        key: "interestRate",
        label: "Interest Rate [%]",
        type: "text",
        placeholder: "Enter Interest Rate",

        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        hiddenIf: (data: any) => data.productType === 'installment' || data.productType === 'autotitle',
        validate: (value) => !value ? "* Please enter Interest Rate." : (Number(value) < 0 ? "* Please enter Interest Rate." : null)
    },
    {
        key: "apr",
        label: "APR [%]",
        type: "text",
        placeholder: "Enter APR",
        required: false,

        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
        validate: (value: any) => !value ? "* Please enter Interest Rate." : (Number(value) < 0 ? "* Please enter Interest Rate." : null)
    },
    {
        key: "loanAgreementName",
        label: "Loan Agreement Name",
        type: "select",
        options: [
            { value: "CAB_CSO_Loanagreement.html", label: "CAB_CSO_Loanagreement.html" },
            { value: "Installment_Loanagreement.html", label: "Installment_Loanagreement.html" },
        ],
        required: true,
        validate: (value) => !value ? "* Please select the Loan Agreement Name." : null
    },
    {
        key: "paymentFrequency",
        label: "Payment Frequency",
        type: "select",
        options: [
            { value: "Weekly", label: "Weekly" },
            { value: "Bi-Weekly", label: "Bi-Weekly" },
            { value: "Monthly", label: "Monthly" },
            { value: "Semi-Monthly", label: "Semi-Monthly" },
        ],
        required: false,
        validate: (value: any, data: any) => {
            if ((data.productType === 'payday' || data.productType === 'autotitle') && !value) {
                return "* Please select the Payment Frequency.";
            }
            return null;
        }
    },
    {
        key: "softReturnCount",
        label: "Soft Return Count",
        type: "text",
        placeholder: "Enter Soft Return Count",
        required: true,
        maxLength: 25,
        format: (val) => val.replace(/\D/g, ""),
        validate: (value) => !value ? "* Please enter the Return Count Before Collection." : (Number(value) < 0 ? "* Please enter the Return Count Before Collection." : null)
    },
    {
        key: "paymentDuringDrawingPeriod",
        label: "Payment During Drawing Period",
        type: "select",
        options: [
            { value: "Minimum Amount", label: "Minimum Amount" },
            { value: "Amortization", label: "Amortization" },
            { value: "Fixed Amount", label: "Fixed Amount" },
        ],
        placeholder: "Select Payment Type",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && !value) return "* Please Select Payment During Drawing Period";
            return null;
        }
    },
    {
        key: "minimumAmount",
        label: "Minimum Amount [%]",
        type: "text",
        placeholder: "Enter Minimum Amount",
        required: false,

        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit' || data.paymentDuringDrawingPeriod !== 'Minimum Amount',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && data.paymentDuringDrawingPeriod === 'Minimum Amount' && (value === undefined || value === null || value === '')) {
                return "* Please enter the Minimum Amount";
            }
            if (value !== undefined && value !== null && Number(value) < 0) return "* Please enter the Minimum Amount";
            return null;
        }
    },
    {
        key: "fixedAmount",
        label: "Fixed Amount [$]",
        type: "currency",
        placeholder: "Enter Fixed Amount",
        required: false,

        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit' || data.paymentDuringDrawingPeriod !== 'Fixed Amount',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && data.paymentDuringDrawingPeriod === 'Fixed Amount' && (value === undefined || value === null || value === '')) {
                return "* Please enter the Fixed Amount";
            }
            const n = Number(String(value).replace(/,/g, ""));
            if (Number.isFinite(n) && n < 0) return "* Please enter the Fixed Amount";
            return null;
        }
    },
    {
        key: "maxStandingAmount",
        label: "Max Standing Amount [$]",
        type: "currency",
        placeholder: "Enter Max Standing Amount",
        required: false,

        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && (value === undefined || value === null || value === '')) {
                return "* Please enter the Max Standing Amount.";
            }
            const n = Number(String(value).replace(/,/g, ""));
            if (value !== undefined && value !== null && Number.isFinite(n) && n < 0) return "* Please enter the Max Standing Amount.";
            return null;
        }
    },
    {
        key: "loanPeriodMonths",
        label: "Loan Period [Months]",
        type: "text",
        placeholder: "Enter Loan Period",
        required: false,

        format: (val) => val.replace(/\D/g, ""),
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && (value === undefined || value === null || value === '')) {
                return "* Please enter Loan Period.";
            }
            if (value !== undefined && value !== null && Number(value) < 0) return "* Please enter Loan Period.";
            return null;
        }
    },
    {
        key: "loanPayPeriodMonths",
        label: "Loan Pay Period [Months]",
        type: "text",
        placeholder: "Enter Loan Pay Period",
        required: true,

        format: (val) => val.replace(/\D/g, ""),
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && (value === undefined || value === null || value === '')) {
                return "* Please enter Loan Pay Period.";
            }
            if (value !== undefined && value !== null && Number(value) < 0) return "* Please enter Loan Pay Period.";
            return null;
        }
    },
    {
        key: "drawPeriodMonths",
        label: "Draw Period [Months]",
        type: "text",
        placeholder: "Enter Draw Period",
        required: true,

        format: (val) => val.replace(/\D/g, ""),
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && (value === undefined || value === null || value === '')) {
                return "* Please enter Drawing Period.";
            }
            if (value !== undefined && value !== null && Number(value) < 0) return "* Please enter Drawing Period.";
            return null;
        }
    },
    {
        key: "isApplicableForAutoTitle",
        label: "Is Applicable for Auto Title",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'cab_cso',
    },
    {
        key: "splitCabCsoFeeForAllPayments",
        label: "Split CAB/CSO Fee for all Payments",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'cab_cso',
    },


    {
        key: "cabCsoType",
        label: "CAB/CSO Type",
        type: "select",
        options: [
            { value: "Single", label: "Single" },
            { value: "Installment", label: "Installment" },
        ],
        placeholder: "Select Type",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'cab_cso',
    },
    {
        key: "cabCsoInstallmentFeeType",
        label: "Type",
        type: "select",
        options: [
            { value: "$", label: "$" },
            { value: "%", label: "%" },
            { value: "#", label: "#" },
        ],
        placeholder: "Select Fee Type",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'cab_cso' || data.cabCsoType !== "Installment",
        validate: (value: any, data: any) => {
            if (data.productType === 'cab_cso' && data.cabCsoType === "Installment" && !value) return "* Required.";
            return null;
        }
    },
    {
        key: "cabCsoInstallmentFeeValueCurrency",
        label: "Value [$]",
        type: "currency",
        placeholder: "Enter Value",
        required: false,
        maxLength: 32,
        hiddenIf: (data: any) => data.productType !== 'cab_cso' || (data.cabCsoType !== "Installment" || data.cabCsoInstallmentFeeType !== "$"),
        validate: (value: any, data: any) => {
            if (data.cabCsoType === "Installment" && data.cabCsoInstallmentFeeType === "$" && (value === undefined || value === null || value === '')) {
                return "* Required.";
            }
            return null;
        }
    },
    {
        key: "cabCsoInstallmentFeeValueNumber",
        label: "Value",
        type: "text",
        placeholder: "Enter Value",
        required: false,
        maxLength: 25,
        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        hiddenIf: (data: any) => data.productType !== 'cab_cso' || (data.cabCsoType !== "Installment" || (data.cabCsoInstallmentFeeType !== "%" && data.cabCsoInstallmentFeeType !== "#")),
        validate: (value: any, data: any) => {
            if (data.cabCsoType === "Installment" && (data.cabCsoInstallmentFeeType === "%" || data.cabCsoInstallmentFeeType === "#") && (value === undefined || value === null || value === '')) {
                return "* Required.";
            }
            return null;
        }
    },
    {
        key: "cabCsoFeePer100",
        label: "CAB/CSO Fee (Per 100$)",
        type: "currency",
        placeholder: "Enter Fee per 100$",
        required: false,
        maxLength: 32,
        hiddenIf: (data: any) => data.productType !== 'cab_cso',
        validate: (value: any, data: any) => {
            if (data.productType === 'cab_cso' && (value === undefined || value === null || value === '')) {
                return "* Please enter the CAB Fee Value.";
            }
            return null;
        }
    },
    {
        key: "accrueInterestOnDeferredPayment",
        label: "Accrue Interest On Deferred Payment",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
    },
    {
        key: "accrueInterestOnDelinquentPayment",
        label: "Accrue Interest On Delinquent Payment",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
    },
    {
        key: "addDelinquentPrincipalToBalance",
        label: "Add Delinquent Principal To Balance",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
    },
    {
        key: "deductDeferredPrincipalToBalance",
        label: "Deduct Deferred Principal To Balance",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
    },

    {
        key: "isOriginationFeeActive",
        label: "Is Origination Fee Active?",
        type: "checkbox",
        required: false,
    },
    {
        key: "originationFeeAmount",
        label: "Origination Fee Amount [$]",
        type: "currency",
        placeholder: "Enter amount (e.g., $33.33)",
        required: false,
        maxLength: 32,
        hiddenIf: (data) => !data.isOriginationFeeActive,
        validate: (value, data) => {
            if (data.isOriginationFeeActive) {
                const s = String(value ?? "").replace(/,/g, "").trim();
                const numericValue = Number(s);
                const isBlankValue = !s || s === "";
                const isZero = !isBlankValue && numericValue === 0;
                // Regex from Angular: /^\d{1,3}(\.\d{1,3})?$/
                const isInvalidFormat = !isBlankValue && !/^\d{1,3}(\.\d{1,3})?$/.test(s);

                if (isBlankValue || isZero || isInvalidFormat || numericValue < 0) {
                    const msgs = ["* Please enter the origination fee."];

                    if (isInvalidFormat) msgs.push("* Orgination Fee allows values from 1-999 or 1.000-999.999.");
                    return msgs.join("\n");
                }
            }
            return null;
        }
    },
    {
        key: "isNSFFeeActive",
        label: "Is NSF Fee Active?",
        type: "checkbox",
        required: false,
    },
    {
        key: "nsfFeeAmount",
        label: "NSF Fee Amount [$]",
        type: "currency",
        placeholder: "Enter amount (e.g., $333.00)",
        required: false,
        maxLength: 32,
        hiddenIf: (data) => !data.isNSFFeeActive,
        validate: (value, data) => {
            if (data.isNSFFeeActive) {
                const s = String(value ?? "").replace(/,/g, "").trim();
                if (!s || s === "") return "* Please enter the NSF fee.";
                if (Number(s) < 0) return "* Please enter the NSF fee.";
            }
            return null;
        }
    },
    {
        key: "isLateFeeActive",
        label: "Is Late Fee Active?",
        type: "checkbox",
        required: false,
    },
    {
        key: "lateFeeAmount",
        label: "Late Fee Amount [$]",
        type: "currency",
        placeholder: "Enter amount (e.g., $34.00)",
        required: false,
        maxLength: 32,
        hiddenIf: (data) => !data.isLateFeeActive,
        validate: (value, data) => {
            if (data.isLateFeeActive) {
                const s = String(value ?? "").replace(/,/g, "").trim();
                if (!s || s === "") return "* Please enter the late fee.";
                if (Number(s) < 0) return "* Please enter the late fee.";
            }
            return null;
        }
    },
    {
        key: "loanDurationMin",
        label: "Min",
        type: "text",
        placeholder: "Enter Min Duration",
        groupLabel: "Loan Duration [Months]",
        required: false,
        maxLength: 25,
        format: (val) => val.replace(/\D/g, ""),
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
        validate: (value: any, data: any) => {
            if (data.productType === 'autotitle' && (value === undefined || value === null || value === '')) return "* Required.";
            if (value !== undefined && value !== null && value !== '' && Number(value) < 0) return "* Required.";
            return null;
        }
    },
    {
        key: "loanDurationMax",
        label: "Max",
        type: "text",
        placeholder: "Enter Max Duration",
        groupLabel: "Loan Duration [Months]",
        required: false,
        maxLength: 25,
        format: (val) => val.replace(/\D/g, ""),
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
        validate: (value: any, data: any) => {
            if (data.productType === 'autotitle' && (value === undefined || value === null || value === '')) return "* Required.";
            if (value !== undefined && value !== null && value !== '' && Number(value) < 0) return "* Required.";
            const minVal = Number(data.loanDurationMin);
            if (Number.isFinite(Number(value)) && Number.isFinite(minVal) && Number(value) <= minVal)
                return "Max Duration must be greater than Min Duration";
            return null;
        }
    },

    {
        key: "onlyCABCSO",
        label: "Only CAB/CSO Fee?",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'installment',
    },
    {
        key: "isActive",
        label: "Is this Product Active?",
        type: "checkbox",
        required: false,
    },
    {
        key: "isPrincipalPaymentActive",
        label: "Is Principal Payment active?",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'payday',
    },
    {
        key: "principalPaymentInterest",
        label: "Interest",
        type: "text",
        placeholder: "Enter Interest",
        required: false,
        maxLength: 25,
        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        hiddenIf: (data: any) => !data.isPrincipalPaymentActive || data.productType !== 'payday',
        validate: (value: any, data: any) => {
            if (data.isPrincipalPaymentActive && data.productType === 'payday') {
                if (value === undefined || value === null || value === '') return "* Required";
                if (Number(value) < 0) return "* Required";
            }
            return null;
        }
    },
    {
        key: "principalPaymentAmount",
        label: "Principal Amount [$]",
        type: "currency",
        placeholder: "$3434",
        required: false,
        maxLength: 32,
        hiddenIf: (data: any) => !data.isPrincipalPaymentActive || data.productType !== 'payday',
        validate: (value: any, data: any) => {
            if (data.isPrincipalPaymentActive && data.productType === 'payday') {
                const s = String(value ?? "").replace(/,/g, "").trim();
                if (!s || s === "") return "* Required";
                if (Number(s) < 0) return "* Required";
            }
            return null;
        }
    },
    {
        key: "isExtensionNeeded",
        label: "Is Extension Needed?",
        type: "checkbox",
        required: false,
        hiddenIf: (data: any) => data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle',
    },
    {
        key: "extensionInterest",
        label: "Interest",
        type: "text",
        placeholder: "Enter Interest",
        required: false,
        maxLength: 25,
        format: (val) => val.replace(/[^\d.]/g, "").replace(/(\..*?)\..*/g, '$1'),
        hiddenIf: (data: any) => !data.isExtensionNeeded || (data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle'),
        validate: (value: any, data: any) => {
            if (data.isExtensionNeeded && !(data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle')) {
                if (value === undefined || value === null || value === '') return "* Required.";
                if (Number(value) < 0) return "* Required.";
            }
            return null;
        }
    },
    {
        key: "extensionAmount",
        label: "Extension Amount [$]",
        type: "currency",
        placeholder: "$3434",
        required: false,
        maxLength: 32,
        hiddenIf: (data: any) => !data.isExtensionNeeded || (data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle'),
        validate: (value: any, data: any) => {
            if (data.isExtensionNeeded && !(data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle')) {
                const s = String(value ?? "").replace(/,/g, "").trim();
                if (!s || s === "") return "* Required.";
                if (Number(s) < 0) return "* Required.";
            }
            return null;
        }
    },

    {
        key: "featureOrder",
        label: "Paydown order (Drag to Reorder)",
        type: "drag-reorder",
        options: [
            { value: "f1", label: "Delinquent Principal" },
            { value: "f2", label: "Current Principal" },
            { value: "f3", label: "Delinquent Interest" },
            { value: "f4", label: "Deferred Interest" },
            { value: "f5", label: "Deferred Principal" },
            { value: "f6", label: "Fees" },
        ],
        required: false,
    },
];

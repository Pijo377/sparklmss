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
        validate: (value) => !value ? "Product Type is required" : null
    },
    {
        key: "productName",
        label: "Product Name",
        type: "text",
        placeholder: "Enter Product Name",
        required: true,
        validate: (value) => !value ? "Product Name is required" : null
    },
    {
        key: "interestRate",
        label: "Interest Rate [%]",
        type: "number",
        placeholder: "Enter Interest Rate",
        hiddenIf: (data: any) => data.productType === 'installment' || data.productType === 'autotitle',
        validate: (value) => Number(value) < 0 ? "Interest Rate must be 0 or greater" : null
    },
     {
        key: "apr",
        label: "APR [%]",
        type: "number",
        placeholder: "Enter APR",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "APR must be 0 or greater" : null
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
        validate: (value) => !value ? "Loan Agreement Name is required" : null
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
        required: true,
        validate: (value) => !value ? "Payment Frequency is required" : null
    },
    {
        key: "softReturnCount",
        label: "Soft Return Count",
        type: "number",
        placeholder: "Enter Soft Return Count",
        required: true,
        validate: (value) => Number(value) < 0 ? "Soft Return Count must be 0 or greater" : null
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
    },
    {
        key: "minimumAmount",
        label: "Minimum Amount [%]",
        type: "number",
        placeholder: "Enter Minimum Amount",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit' || data.paymentDuringDrawingPeriod !== 'Minimum Amount',
        validate: (value: any, data: any) => {
            if (data.productType === 'revolving_line_of_credit' && data.paymentDuringDrawingPeriod === 'Minimum Amount' && (value === undefined || value === null || value === '')) {
                return "Minimum Amount is required";
            }
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
                return "Fixed Amount is required";
            }
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
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "Max Standing Amount must be 0 or greater" : null
    },
    {
        key: "loanPeriodMonths",
        label: "Loan Period [Months]",
        type: "number",
        placeholder: "Enter Loan Period",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "Loan Period must be 0 or greater" : null
    },
    {
        key: "loanPayPeriodMonths",
        label: "Loan Pay Period [Months]",
        type: "number",
        placeholder: "Enter Loan Pay Period",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "Loan Pay Period must be 0 or greater" : null
    },
    {
        key: "drawPeriodMonths",
        label: "Draw Period [Months]",
        type: "number",
        placeholder: "Enter Draw Period",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'revolving_line_of_credit',
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "Draw Period must be 0 or greater" : null
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
    },
    {
        key: "cabCsoInstallmentFeeValueCurrency",
        label: "Value [$]",
        type: "currency",
        placeholder: "Enter Value",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'cab_cso' || (data.cabCsoType !== "Installment" || data.cabCsoInstallmentFeeType !== "$"),
        validate: (value: any, data: any) => {
            if (data.cabCsoType === "Installment" && data.cabCsoInstallmentFeeType === "$" && (value === undefined || value === null || value === '')) {
                return "Value is required";
            }
            return null;
        }
    },
    {
        key: "cabCsoInstallmentFeeValueNumber",
        label: "Value",
        type: "number",
        placeholder: "Enter Value",
        required: false,
        hiddenIf: (data: any) => data.productType !== 'cab_cso' || (data.cabCsoType !== "Installment" || (data.cabCsoInstallmentFeeType !== "%" && data.cabCsoInstallmentFeeType !== "#")),
        validate: (value: any, data: any) => {
            if (data.cabCsoType === "Installment" && (data.cabCsoInstallmentFeeType === "%" || data.cabCsoInstallmentFeeType === "#") && (value === undefined || value === null || value === '')) {
                return "Value is required";
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
        hiddenIf: (data: any) => data.productType !== 'cab_cso',
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
        hiddenIf: (data) => !data.isOriginationFeeActive,
        validate: (value, data) => {
            if (data.isOriginationFeeActive && (!value || Number(value) < 0)) {
                return "Origination Fee Amount must be 0 or greater when fee is active";
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
        hiddenIf: (data) => !data.isNSFFeeActive,
        validate: (value, data) => {
            if (data.isNSFFeeActive && (!value || Number(value) < 0)) {
                return "NSF Fee Amount must be 0 or greater when fee is active";
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
        hiddenIf: (data) => !data.isLateFeeActive,
        validate: (value, data) => {
            if (data.isLateFeeActive && (!value || Number(value) < 0)) {
                return "Late Fee Amount must be 0 or greater when fee is active";
            }
            return null;
        }
    },
     {
        key: "loanDurationMin",
        label: "Min",
        type: "number",
        placeholder: "Enter Min Duration",
        groupLabel: "Loan Duration [Months]",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "Min Duration must be 0 or greater" : null
    },
    {
        key: "loanDurationMax",
        label: "Max",
        type: "number",
        placeholder: "Enter Max Duration",
        groupLabel: "Loan Duration [Months]",
        required: false,
        hiddenIf: (data: any) => data.productType === 'payday' || data.productType === 'revolving_line_of_credit' || data.productType === 'cab_cso',
        validate: (value: any) => value !== undefined && value !== null && Number(value) < 0 ? "Max Duration must be 0 or greater" : null
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
        type: "number",
        placeholder: "Enter Interest",
        required: false,
        hiddenIf: (data: any) => !data.isPrincipalPaymentActive || data.productType !== 'payday',
        validate: (value: any, data: any) => {
            if (data.isPrincipalPaymentActive && !data.hiddenIf?.(data) && (value === undefined || value === null || value === '')) {
                return "Interest is required when Principal Payment is active";
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
        hiddenIf: (data: any) => !data.isPrincipalPaymentActive || data.productType !== 'payday',
        validate: (value: any, data: any) => {
            if (data.isPrincipalPaymentActive && !data.hiddenIf?.(data) && (value === undefined || value === null || value === '')) {
                return "Principal Amount is required when Principal Payment is active";
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
        type: "number",
        placeholder: "Enter Interest",
        required: false,
        hiddenIf: (data: any) => !data.isExtensionNeeded || (data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle'),
        validate: (value: any, data: any) => {
            if (data.isExtensionNeeded && !data.hiddenIf?.(data) && (value === undefined || value === null || value === '')) {
                return "Interest is required when Extension is needed";
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
        hiddenIf: (data: any) => !data.isExtensionNeeded || (data.productType === 'installment' || data.productType === 'revolving_line_of_credit' || data.productType === 'autotitle'),
        validate: (value: any, data: any) => {
            if (data.isExtensionNeeded && !data.hiddenIf?.(data) && (value === undefined || value === null || value === '')) {
                return "Extension Amount is required when Extension is needed";
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

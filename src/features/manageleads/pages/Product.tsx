import  { useState, useCallback } from "react";
import { Edit2, Plus, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { EditSheet } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import type { ActionDef, ToolbarButtonDef } from "@/features/manageleads/ui/data-table/types";
import { columns, editSheetFields } from "@/features/manageleads/config/productconfig";
import type { Product } from "@/features/manageleads/config/productconfig";

// Mock Data
const initialData: Product[] = [
    { id: "1", productType: "CAB/CSO", productName: "CSO2025jultesting", interestRate: 10.00, loanAgreementName: "CAB_CSO_Loanagreement.html", nsfFee: 0.00, lateFee: 0.00, paymentFrequency: "Monthly", softReturnCount: "0", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: false, nsfFeeAmount: 0, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: true, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" },{ id: "f7", label: "Feess" },{ id: "f8", label: "Fees" },{ id: "f9", label: "Fees" },{ id: "f10", label: "Fees" },] },
    { id: "2", productType: "CAB/CSO", productName: "FggvyProduct", interestRate: 10.00, loanAgreementName: "CAB_CSO_Loanagreement.html", nsfFee: 7.50, lateFee: 0.00, paymentFrequency: "Monthly", softReturnCount: "1", isActive: true, isOriginationFeeActive: true, originationFeeAmount: 33.33, isNSFFeeActive: true, nsfFeeAmount: 7.50, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: true, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "3", productType: "Installment", productName: "PDWI_MN_5", interestRate: 5.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Bi-Weekly", softReturnCount: "2", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "4", productType: "Installment", productName: "PDSC_MN_8.75", interestRate: 8.75, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Bi-Weekly", softReturnCount: "0", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "5", productType: "Installment", productName: "PDMN_MN_50", interestRate: 50.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Weekly", softReturnCount: "0", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "6", productType: "Installment", productName: "PDMI_MN_25", interestRate: 25.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Weekly", softReturnCount: "5", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "7", productType: "Installment", productName: "PDIA_MN_21", interestRate: 21.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Monthly", softReturnCount: "0", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "8", productType: "Installment", productName: "PDIN_MN_21", interestRate: 21.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Monthly", softReturnCount: "0", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "9", productType: "Installment", productName: "PDAR_MN_17", interestRate: 17.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Monthly", softReturnCount: "0", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
    { id: "10", productType: "Installment", productName: "PDMO_BWSM_400", interestRate: 400.00, loanAgreementName: "Installment_Loanagreement.html", nsfFee: 25.00, lateFee: 0.00, paymentFrequency: "Weekly", softReturnCount: "1", isActive: true, isOriginationFeeActive: false, originationFeeAmount: 0, isNSFFeeActive: true, nsfFeeAmount: 25.00, isLateFeeActive: false, lateFeeAmount: 0, onlyCABCSO: false, featureOrder: [{ id: "f1", label: "Delinquent Principal" }, { id: "f2", label: "Current Principal" }, { id: "f3", label: "Delinquent Interest" }, { id: "f4", label: "Deferred Interest" }, { id: "f5", label: "Deferred Principal" }, { id: "f6", label: "Fees" }] },
];

const ProductPage = () => {
    const [data, setData] = useState<Product[]>(initialData);
    const [isActive, setIsActive] = useState(true);
    const [editSheet, setEditSheet] = useState<{
        open: boolean;
        mode: "add" | "edit";
        data?: Product | null;
    }>({
        open: false,
        mode: "edit",
        data: null,
    });

    // Handle Edit Action
    const handleEdit = useCallback((item: Product) => {
        setEditSheet({
            open: true,
            mode: "edit",
            data: item,
        });
    }, []);

    // Handle Save Action
    const handleSave = useCallback((formData: Product) => {
        if (editSheet.mode === "add") {
            const newId = Math.max(...data.map(item => parseInt(item.id)), 0) + 1;
            setData((prev) => [...prev, { ...formData, id: String(newId), isActive: true }]);
        } else if (editSheet.mode === "edit" && editSheet.data) {
            setData((prev) =>
                prev.map((item) => (item.id === editSheet.data?.id ? { ...formData, id: item.id } : item))
            );
        }
        setEditSheet({ open: false, mode: "edit", data: null });
    }, [editSheet.mode, editSheet.data, data]);


    // Define Actions
    const actions: ActionDef<Product>[] = [
        {
            icon: <Edit2 size={16} className="text-blue-600" />,
            label: "Edit",
            onClick: handleEdit,
        },
    ];

    // Define Toolbar Buttons
    const toolbarButtons: ToolbarButtonDef[] = [
        {
            icon: <Plus size={16} />,
            label: "Add",
            onClick: () => setEditSheet({
                open: true,
                mode: "add",
                data: null,
            }),
            variant: "default",
            className: "bg-blue-600 hover:bg-blue-700 text-white",
        },
        {
            icon: isActive ? <CheckCircle size={16} /> : <XCircle size={16} />,
            label: isActive ? "Active" : "Inactive",
            onClick: () => setIsActive(!isActive),
            variant: isActive ? "default" : "outline",
            className: isActive
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "border-red-400 text-red-600 hover:bg-red-50",
        },
    ];

    const filteredData = data.filter((item) => item.isActive === isActive);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Product</h1>
            </div>

            <TableCard>
                <DataTable<Product>
                    data={filteredData}
                    columns={columns}
                    actions={{
                        header: "Edit",
                        width: "80px",
                        items: actions,
                    }}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    initialPageSize={100}
                    pageSizeOptions={[10, 25, 50, 100]}
                    title={`Product (${isActive ? "Active" : "Inactive"})`}
                    toolbarButtons={toolbarButtons}
                />

                <EditSheet<Product>
                    open={editSheet.open}
                    onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
                    title={editSheet.mode === "add" ? "Add Product" : "Edit Product"}
                    description="Enter values to manage product details."
                    data={editSheet.data}
                    fields={editSheetFields}
                    onSave={handleSave}
                    mode={editSheet.mode}
                />
            </TableCard>
        </div>
    );
};

export default ProductPage;

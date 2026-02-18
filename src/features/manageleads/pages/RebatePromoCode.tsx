import  { useState, useCallback } from "react";
import { Edit2, Trash2,  Plus, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { EditSheet } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import type { ActionDef, ToolbarButtonDef } from "@/features/manageleads/ui/data-table/types";
import { initialData, editSheetFields, columns } from "@/features/manageleads/config/rebatepromocodeconfig";
import type { RebatePromoCode } from "@/features/manageleads/config/rebatepromocodeconfig";

const RebatePromoCodePage = () => {
    const [data, setData] = useState<RebatePromoCode[]>(initialData);
    const [isActive, setIsActive] = useState(true);
    const [editSheet, setEditSheet] = useState<{
        open: boolean;
        mode: "add" | "edit";
        data?: RebatePromoCode | null;
    }>({
        open: false,
        mode: "edit",
        data: null,
    });

    // Convert date format from MM/DD/YYYY to YYYY-MM-DD for date picker
    const formatDateForPicker = (dateStr: string) => {
        if (!dateStr || dateStr === "N/A") return dateStr;
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            return `${parts[2]}-${parts[0]}-${parts[1]}`;
        }
        return dateStr;
    };

    // Convert date format from YYYY-MM-DD to MM/DD/YYYY for display
    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr || dateStr === "N/A") return dateStr;
        const dateObj = new Date(dateStr + "T00:00:00");
        if (isNaN(dateObj.getTime())) return dateStr;
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const year = dateObj.getFullYear();
        return `${month}/${day}/${year}`;
    };

    // Handle Edit action
    const handleEdit = useCallback((code: RebatePromoCode) => {
        setEditSheet({
            open: true,
            mode: "edit",
            data: {
                ...code,
                validFrom: formatDateForPicker(code.validFrom),
                validTo: formatDateForPicker(code.validTo),
            },
        });
    }, []);

    // Handle Delete action
    const handleDelete = useCallback((code: RebatePromoCode) => {
        setData((prev) => prev.filter((item) => item.id !== code.id));
    }, []);

    // Handle Save changes
    const handleSave = useCallback((formData: RebatePromoCode) => {
        // Convert dates from YYYY-MM-DD to MM/DD/YYYY format for storage
        const dataToSave = {
            ...formData,
            validFrom: formatDateForDisplay(formData.validFrom),
            validTo: formatDateForDisplay(formData.validTo),
        };

        if (editSheet.mode === "add") {
            // Add new record with generated ID
            const newId = Math.max(...data.map(item => parseInt(item.id)), 0) + 1;
            setData((prev) => [...prev, { ...dataToSave, id: String(newId) }]);
        } else if (editSheet.mode === "edit" && editSheet.data) {
            // Update existing record
            setData((prev) =>
                prev.map((item) => (item.id === editSheet.data?.id ? { ...dataToSave, id: item.id } : item))
            );
        }
        setEditSheet({ open: false, mode: "edit", data: null });
    }, [editSheet.data, editSheet.mode, data]);

    // Define table actions
    const tableActions: ActionDef<RebatePromoCode>[] = [
        {
            icon: <Edit2 size={16} className="text-blue-600" />,
            label: "Edit",
            onClick: handleEdit,
        },
        {
            icon: <Trash2 size={16} className="text-red-600" />,
            label: "Delete",
            onClick: handleDelete,
        },
    ];

    // Define toolbar buttons
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

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Rebate/Promo Code</h1>
            </div>

            <TableCard>
                <DataTable<RebatePromoCode>
                    data={data}
                    columns={columns}
                    actions={{
                        header: "Actions",
                        width: "100px",
                        items: tableActions,
                    }}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    initialPageSize={100}
                    pageSizeOptions={[10, 25, 50, 100]}
                    title="Rebate/Promo Code (Active)"
                    toolbarButtons={toolbarButtons}
                />

                <EditSheet<RebatePromoCode>
                    open={editSheet.open}
                    onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
                    title={editSheet.mode === "add" ? "Add Rebate/Promo Code" : "Edit Rebate/Promo Code"}
                    description="Enter values to Manage Rebate/Promo code details."
                    data={editSheet.data}
                    fields={editSheetFields}
                    onSave={handleSave}
                    mode={editSheet.mode}
                />
            </TableCard>
        </div>
    );
};

export default RebatePromoCodePage;

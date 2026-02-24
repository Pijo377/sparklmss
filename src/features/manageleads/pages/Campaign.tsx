import { useState, useCallback } from "react";
import { Edit2, CopyPlus, Plus, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import EditSheet from "@/features/manageleads/ui/edit-sheet/EditSheet";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import type { ActionDef, ToolbarButtonDef } from "@/features/manageleads/ui/data-table/types";

// --- Configuration Section (Imported to fix Fast Refresh lint error) ---
import {
    type Campaign,
    initialData,
    columns,
    editSheetFields,
} from "@/features/manageleads/config/campaign-config";

// --- Utility Sections ---
// Utility to convert number to string without scientific notation
const toNonExponential = (num: any) => {
    if (typeof num !== 'number') return String(num ?? "");
    return num.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 });
};

const fieldsToNumber = [
    "maxHourlyLead", "maxDailyLeads", "firstPaymentMinDuration",
    "firstPaymentMaxDuration", "loanToIncomeRatio", "achCoolOffDays"
];


// --- Component Section ---

const CampaignPage = () => {
    const [data, setData] = useState<Campaign[]>(initialData);
    const [isActive, setIsActive] = useState(true);
    const [editSheet, setEditSheet] = useState<{
        open: boolean;
        mode: "add" | "edit";
        data?: Campaign | null;
    }>({
        open: false,
        mode: "edit",
        data: null,
    });

    // Handle Edit action
    const handleEdit = useCallback((campaign: Campaign) => {
        // Convert numbers to non-scientific strings for the form
        const formattedData = { ...campaign } as any;
        fieldsToNumber.forEach(field => {
            if (typeof formattedData[field] === 'number') {
                formattedData[field] = toNonExponential(formattedData[field]);
            }
        });

        setEditSheet({
            open: true,
            mode: "edit",
            data: formattedData as Campaign,
        });
    }, []);

    // Handle Copy action
    const handleCopy = useCallback((campaign: Campaign) => {
        setEditSheet({
            open: true,
            mode: "add",
            data: { ...campaign, campaignName: `${campaign.campaignName} (Copy)` },
        });
    }, []);

    // Handle Save changes
    const handleSave = useCallback((formData: Campaign) => {
        // Convert strings back to numbers before saving for numeric fields
        const dataToSave = { ...formData } as any;
        fieldsToNumber.forEach(field => {
            if (dataToSave[field] !== undefined && dataToSave[field] !== null && dataToSave[field] !== "") {
                const val = String(dataToSave[field]).replace(/,/g, '');
                dataToSave[field] = isNaN(Number(val)) ? 0 : Number(val);
            }
        });

        console.log("Saved Data:", dataToSave);
        console.log("Mode:", editSheet.mode);
        if (editSheet.mode === "add") {
            // Add new record with generated ID
            const newId = String(Math.max(...data.map(item => parseInt(item.id) || 0), 0) + 1);
            setData((prev) => [...prev, { ...dataToSave, id: newId, active: true }]);
            console.log("Adding Campaign:", dataToSave);
        } else if (editSheet.mode === "edit" && editSheet.data) {
            // Update existing record
            setData((prev) =>
                prev.map((item) => (item.id === editSheet.data?.id ? { ...dataToSave, id: item.id } : item))
            );
        }
        setEditSheet({ open: false, mode: "edit", data: null });
    }, [editSheet.data, editSheet.mode, data]);

    // Define table actions
    const tableActions: ActionDef<Campaign>[] = [
        {
            icon: <Edit2 size={16} className="text-blue-600" />,
            label: "Edit",
            onClick: handleEdit,
        },
        {
            icon: <CopyPlus size={16} className="text-orange-600" />,
            label: "Copy",
            onClick: handleCopy,
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
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Campaign</h1>
            </div>

            <TableCard>
                <DataTable<Campaign>
                    data={data}
                    columns={columns}
                    actions={{
                        header: "Action",
                        width: "100px",
                        items: tableActions,
                    }}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    initialPageSize={100}
                    pageSizeOptions={[10, 25, 50, 100]}
                    title={`Campaign (${isActive ? "Active" : "Inactive"})`}
                    toolbarButtons={toolbarButtons}
                />

                <EditSheet<Campaign>
                    open={editSheet.open}
                    onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
                    title={editSheet.mode === "add" ? "Add Campaign" : "Edit Campaign"}
                    description="Enter values to manage campaign details."
                    data={editSheet.data}
                    fields={editSheetFields}
                    onSave={handleSave}
                    mode={editSheet.mode}
                />
            </TableCard>
        </div>
    );
};

export default CampaignPage;

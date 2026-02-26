
import { useState, useCallback } from "react";
import { Edit2, Trash2, Plus, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/features/scoringcost/ui/data-table/DataTable";
import { EditSheet } from "@/features/scoringcost/ui/edit-sheet/EditSheet";
import { TableCard } from "@/features/scoringcost/ui/table-card/TableCard";
import type { ActionDef, ToolbarButtonDef } from "@/features/scoringcost/ui/data-table/types";
import { initialData, editSheetFields, columns, type ScoringCost } from "@/features/scoringcost/config/scoringcostconfig";

const ScoringCostPage = () => {
    const [data, setData] = useState<ScoringCost[]>(initialData);
    const [isActive, setIsActive] = useState(true);
    const [editSheet, setEditSheet] = useState<{
        open: boolean;
        mode: "add" | "edit";
        data?: ScoringCost | null;
    }>({
        open: false,
        mode: "edit",
        data: null,
    });

    // Handle Edit action
    const handleEdit = useCallback((item: ScoringCost) => {
        setEditSheet({
            open: true,
            mode: "edit",
            data: item,
        });
    }, []);

    // Handle Delete action
    const handleDelete = useCallback((item: ScoringCost) => {
        setData((prev) => prev.filter((i) => i.id !== item.id));
    }, []);

    // Handle Save changes
    const handleSave = useCallback((formData: ScoringCost) => {
        if (editSheet.mode === "add") {
            const newId = Math.max(...data.map(item => parseInt(item.id)), 0) + 1;
            setData((prev) => [...prev, { ...formData, id: String(newId) }]);
        } else if (editSheet.mode === "edit" && editSheet.data) {
            setData((prev) =>
                prev.map((item) => (item.id === editSheet.data?.id ? { ...formData, id: item.id } : item))
            );
        }
        setEditSheet({ open: false, mode: "edit", data: null });
    }, [editSheet.data, editSheet.mode, data]);

    // Define table actions
    const tableActions: ActionDef<ScoringCost>[] = [
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
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Scoring Cost</h1>
            </div>

            <TableCard>
                <DataTable<ScoringCost>
                    data={data}
                    columns={columns}
                    actions={{
                        header: "Edit",
                        width: "100px",
                        items: tableActions,
                    }}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    initialPageSize={100}
                    pageSizeOptions={[10, 25, 50, 100]}
                    title={`Scoring Cost (${isActive ? "Active" : "Inactive"})`}
                    toolbarButtons={toolbarButtons}
                />

                <EditSheet<ScoringCost>
                    open={editSheet.open}
                    onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
                    title={editSheet.mode === "add" ? "Add Scoring Cost" : "Edit Scoring Cost"}
                    description="Enter details for the Scoring Cost."
                    data={editSheet.data}
                    fields={editSheetFields}
                    onSave={handleSave}
                    mode={editSheet.mode}
                />
            </TableCard>
        </div>
    );
};

export default ScoringCostPage;

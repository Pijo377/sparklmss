import React, { useState, useCallback } from "react";
import { Edit2 } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { EditSheet } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import type { ActionDef } from "@/features/manageleads/ui/data-table/types";
import type { Portfolio } from "@/features/manageleads/config/portfolioconfig";
import { 
    initialData, 
    editSheetFields, 
    columns 
} from "@/features/manageleads/config/portfolioconfig";

const Portfolio = () => {
    const [data, setData] = useState<Portfolio[]>(initialData);
    const [editSheet, setEditSheet] = useState<{
        open: boolean;
        data?: Portfolio | null;
    }>({
        open: false,
        data: null,
    });

    // Handle opening the EditSheet
    const handleEdit = useCallback((portfolio: Portfolio) => {
        setEditSheet({
            open: true,
            data: portfolio,
        });
    }, []);

    // Handle saving the edited data
    const handleSave = useCallback((formData: Portfolio) => {
        setData((prev) =>
            prev.map((item) => (item.id === editSheet.data?.id ? { ...formData, id: item.id } : item))
        );
        setEditSheet({ open: false, data: null });
    }, [editSheet.data]);

    // Define actions (Only Edit action as requested)
    const actions: ActionDef<Portfolio>[] = [
        {
            icon: <Edit2 size={16} className="text-blue-600" />,
            label: "Edit",
            onClick: handleEdit,
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Portfolio</h1>

            <TableCard>
                <DataTable<Portfolio>
                    data={data}
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
                    title="Portfolio"
                />

                <EditSheet<Portfolio>
                    open={editSheet.open}
                    onOpenChange={(open) => setEditSheet((prev) => ({ ...prev, open }))}
                    title="Edit Portfolio"
                    description="Update portfolio information details."
                    data={editSheet.data}
                    fields={editSheetFields}
                    onSave={handleSave}
                    mode="edit"
                />
            </TableCard>
        </div>
    );
};

export default Portfolio;

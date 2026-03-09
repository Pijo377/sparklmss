import { Plus, CheckCircle, XCircle, Edit2 } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { EditSheet } from "@/features/manageleads/ui/edit-sheet/EditSheet";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import type { ActionDef } from "@/features/manageleads/ui/data-table/types";
import {
    groupColumns,
    groupEditFields,
    type AutoOriginateGroup,
} from "../config/autooriginationconfig";

interface GroupTabProps {
    groupData: AutoOriginateGroup[];
    isGroupActive: boolean;
    setIsGroupActive: (active: boolean) => void;
    groupEditSheet: {
        open: boolean;
        data?: AutoOriginateGroup | null;
        mode: "add" | "edit";
    };
    setGroupEditSheet: (sheet: any) => void;
    handleEditGroup: (group: AutoOriginateGroup) => void;
    handleAddGroup: () => void;
    handleSaveGroup: (formData: AutoOriginateGroup) => void;
}

export const GroupTab = ({
    groupData,
    isGroupActive,
    setIsGroupActive,
    groupEditSheet,
    setGroupEditSheet,
    handleEditGroup,
    handleAddGroup,
    handleSaveGroup,
}: GroupTabProps) => {
    const groupActions: ActionDef<AutoOriginateGroup>[] = [
        {
            icon: <Edit2 size={16} className="text-blue-600" />,
            label: "Edit",
            onClick: handleEditGroup,
        },
    ];

    return (
        <TableCard>
            <DataTable<AutoOriginateGroup>
                data={groupData.filter(g => g.isActive === isGroupActive)}
                columns={groupColumns}
                actions={{
                    header: "Edit",
                    width: "80px",
                    items: groupActions,
                }}
                toolbarButtons={[
                    {
                        icon: <Plus size={16} />,
                        label: "Add",
                        onClick: handleAddGroup,
                        className: "bg-blue-600 hover:bg-blue-700 text-white",
                    },
                    {
                        icon: isGroupActive ? <CheckCircle size={16} /> : <XCircle size={16} />,
                        label: isGroupActive ? "Active" : "Inactive",
                        onClick: () => setIsGroupActive(!isGroupActive),
                        variant: isGroupActive ? "default" : "outline",
                        className: isGroupActive
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "border-red-400 text-red-600 hover:bg-red-50",
                    },
                ]}
                enableColumnFilters={true}
                enableGlobalSearch={true}
                initialPageSize={100}
                pageSizeOptions={[10, 25, 50, 100]}
                title={`Auto Originate Group (${isGroupActive ? "Active" : "Inactive"})`}
            />

            <EditSheet<AutoOriginateGroup>
                open={groupEditSheet.open}
                onOpenChange={(open) => setGroupEditSheet((prev: any) => ({ ...prev, open }))}
                title={groupEditSheet.mode === "add" ? "Add Auto Originate Group" : "Edit Auto Originate Group"}
                description={groupEditSheet.mode === "add" ? "Create a new auto originate group." : "Update group information detail."}
                data={groupEditSheet.data}
                fields={groupEditFields}
                onSave={handleSaveGroup}
                mode={groupEditSheet.mode}
            />
        </TableCard>
    );
};

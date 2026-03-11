import { DataTable } from "@/features/bureau/ui/data-table/DataTable";
import { TableCard } from "@/features/bureau/ui/table-card/TableCard";
import Card from "@/features/bureau/ui/card";
import { Input } from "@/features/bureau/ui/input";
import { Label } from "@/features/bureau/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/bureau/ui/select";
import { Check, LayoutGrid, Pencil, Plus, Save, X } from "lucide-react";
import { type BureauFieldRow, bureauFieldColumns, bureauOptions } from "../config/bureauConfig";

interface BureauFieldsTabProps {
    showFieldForm: boolean;
    fieldFormMode: "add" | "edit";
    fieldForm: any;
    fieldErrors: Record<string, string>;
    handleFieldInputChange: (field: any, value: any) => void;
    handleSaveField: () => void;
    handleCancelField: () => void;
    handleAddField: () => void;
    handleEditField: (row: BureauFieldRow) => void;
    bureauFieldData: BureauFieldRow[];
}

export const BureauFieldsTab = ({
    showFieldForm,
    fieldFormMode,
    fieldForm,
    fieldErrors,
    handleFieldInputChange,
    handleSaveField,
    handleCancelField,
    handleAddField,
    handleEditField,
    bureauFieldData
}: BureauFieldsTabProps) => {
    return (
        <div className="space-y-4">
            {showFieldForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-3 mb-4 border-b border-blue-100 pb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LayoutGrid size={16} className="text-blue-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-blue-600">
                                {fieldFormMode === "edit" ? "Edit Bureau Field" : "Add Bureau Field"}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Bureau Name <span className="text-red-500">*</span></Label>
                                <Select
                                    value={fieldForm.bureauName}
                                    onValueChange={(val) => handleFieldInputChange("bureauName", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bureauOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldErrors.bureauName && <span className="text-red-500 text-[10px] mt-1 block">{fieldErrors.bureauName}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Bureau Field Name <span className="text-red-500">*</span></Label>
                                <Input
                                    value={fieldForm.bureauFieldName}
                                    onChange={(e) => handleFieldInputChange("bureauFieldName", e.target.value)}
                                    placeholder="Enter field name"
                                    className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                {fieldErrors.bureauFieldName && <span className="text-red-500 text-[10px] mt-1 block">{fieldErrors.bureauFieldName}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Bureau Parameter <span className="text-red-500">*</span></Label>
                                <Input
                                    value={fieldForm.bureauParameter}
                                    onChange={(e) => handleFieldInputChange("bureauParameter", e.target.value)}
                                    placeholder="Enter parameter"
                                    className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                {fieldErrors.bureauParameter && <span className="text-red-500 text-[10px] mt-1 block">{fieldErrors.bureauParameter}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900 invisible">Status</Label>
                                <div
                                    onClick={() => handleFieldInputChange("isActive", !fieldForm.isActive)}
                                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11 select-none"
                                >
                                    <div className={`
                                        w-5 h-5 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                        ${fieldForm.isActive
                                            ? 'bg-[#84cc16] border-[#84cc16] shadow-sm'
                                            : 'bg-white border-slate-300'}
                                    `}>
                                        {fieldForm.isActive && <Check size={14} className="text-white stroke-[3.5]" />}
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 truncate tracking-tight">Is this Configuration active?</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handleSaveField}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={18} />
                            {fieldFormMode === "edit" ? "Save Changes" : "Submit"}
                        </button>
                        <button
                            onClick={handleCancelField}
                            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <TableCard>
                <DataTable<BureauFieldRow>
                    data={bureauFieldData}
                    columns={bureauFieldColumns}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    toolbarButtons={[
                        {
                            icon: <Plus size={16} />,
                            label: "Add",
                            onClick: handleAddField,
                            className: "bg-blue-600 hover:bg-blue-700 text-white",
                        }
                    ]}
                    actions={{
                        header: "Actions",
                        width: "80px",
                        items: (row) => [
                            {
                                icon: <Pencil size={16} className="text-blue-600" />,
                                label: "Edit",
                                onClick: () => handleEditField(row),
                            }
                        ],
                    }}
                />
            </TableCard>
        </div>
    );
};

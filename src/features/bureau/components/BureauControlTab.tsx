import { DataTable } from "@/features/bureau/ui/data-table/DataTable";
import { TableCard } from "@/features/bureau/ui/table-card/TableCard";
import Card from "@/features/bureau/ui/card";
import { Input } from "@/features/bureau/ui/input";
import { Label } from "@/features/bureau/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/bureau/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/features/bureau/ui/tooltip";
import { Check, LayoutGrid, Plus, RotateCcw, Save, Search, Trash2, X } from "lucide-react";
import { type BureauControlRow, type BureauFieldRow, bureauControlColumns, bureauOptions, postingTypeOptions, responseTypeOptions, statusOptions } from "../config/bureauConfig";

interface BureauControlTabProps {
    showControlForm: boolean;
    controlFormMode: "add" | "edit";
    controlForm: any;
    controlErrors: Record<string, string>;
    handleControlInputChange: (field: any, value: any) => void;
    handleSaveControl: () => void;
    handleCancelControl: () => void;
    handleAddControl: () => void;
    handleDisplayControl: () => void;
    handleResetControl: () => void;
    bureauControlData: BureauControlRow[];
    bureauFieldData: BureauFieldRow[];
}

export const BureauControlTab = ({
    showControlForm,
    controlFormMode,
    controlForm,
    controlErrors,
    handleControlInputChange,
    handleSaveControl,
    handleCancelControl,
    handleAddControl,
    handleDisplayControl,
    handleResetControl,
    bureauControlData,
    bureauFieldData
}: BureauControlTabProps) => {
    // Filter field names based on selected bureauName
    const filteredFieldOptions = bureauFieldData
        .filter(field => field.bureauName === controlForm.bureauName)
        .map(field => ({ value: field.bureauFieldName, label: field.bureauFieldName }));

    // Remove duplicates
    const uniqueFieldOptions = Array.from(new Set(filteredFieldOptions.map(o => o.value)))
        .map(value => filteredFieldOptions.find(o => o.value === value));
    return (
        <div className="space-y-4">
            {showControlForm && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 flex flex-col gap-4">
                    <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white flex items-end justify-between gap-6">
                        <div className="space-y-1.5 flex-1 max-w-sm">
                            <Label className="text-sm font-medium text-slate-900">Bureau Control Name</Label>
                            <Select
                                value={controlForm.searchControlName}
                                onValueChange={(val) => handleControlInputChange("searchControlName", val)}
                            >
                                <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MicroBilt_Control">MicroBilt_Control</SelectItem>
                                    <SelectItem value="DataX_Control">DataX_Control</SelectItem>
                                </SelectContent>
                            </Select>
                            {controlErrors.searchControlName && <span className="text-red-500 text-[10px] mt-1 block">{controlErrors.searchControlName}</span>}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDisplayControl}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm cursor-pointer flex items-center gap-2"
                            >
                                <Search size={16} />
                                Display
                            </button>
                            <button
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm cursor-pointer shadow-sm flex items-center gap-2"
                                onClick={handleResetControl}
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                        </div>
                    </Card>

                    <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-3 mb-4 border-b border-blue-100 pb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LayoutGrid size={16} className="text-blue-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-blue-600">
                                {controlFormMode === "edit" ? "Edit Bureau Control" : "Add Bureau Control"}
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Bureau Name <span className="text-red-500">*</span></Label>
                                <Select
                                    value={controlForm.bureauName}
                                    onValueChange={(val) => handleControlInputChange("bureauName", val)}
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
                                {controlErrors.bureauName && <span className="text-red-500 text-[10px] mt-1 block">{controlErrors.bureauName}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <label className="block text-sm font-medium text-slate-900 mb-1 truncate max-w-[180px] cursor-pointer">
                                                Bureau Control Name<span className="text-red-500">*</span>
                                            </label>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Bureau Control Name
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Input
                                    value={controlForm.bureauControlName}
                                    onChange={(e) => handleControlInputChange("bureauControlName", e.target.value)}
                                    placeholder="Enter control name"
                                    className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                {controlErrors.bureauControlName && <span className="text-red-500 text-[10px] mt-1 block">{controlErrors.bureauControlName}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Field Names <span className="text-red-500">*</span></Label>
                                <Select
                                    value={controlForm.bureauFieldName}
                                    onValueChange={(val) => handleControlInputChange("bureauFieldName", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(uniqueFieldOptions as any[]).map(opt => (
                                            <SelectItem key={opt?.value} value={opt?.value}>{opt?.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {controlErrors.bureauFieldName && <span className="text-red-500 text-[10px] mt-1 block">{controlErrors.bureauFieldName}</span>}
                            </div>

                            <div className="space-y-1.5" key={controlForm.bureauFieldName}>
                                <Label className="text-sm font-medium text-slate-900">Field Value <span className="text-red-500">*</span></Label>
                                {["posting type", "response type", "status", "isactive"].includes(controlForm.bureauFieldName?.toLowerCase()) ? (
                                    <Select
                                        value={controlForm.bureauFieldValue}
                                        onValueChange={(val) => handleControlInputChange("bureauFieldValue", val)}
                                    >
                                        <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {controlForm.bureauFieldName?.toLowerCase() === "posting type" && postingTypeOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                            {controlForm.bureauFieldName?.toLowerCase() === "response type" && responseTypeOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                            {(controlForm.bureauFieldName?.toLowerCase() === "status" || controlForm.bureauFieldName?.toLowerCase() === "isactive") && statusOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={controlForm.bureauFieldValue}
                                        onChange={(e) => handleControlInputChange("bureauFieldValue", e.target.value)}
                                        placeholder="Enter value"
                                        className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                )}
                                {controlErrors.bureauFieldValue && <span className="text-red-500 text-[10px] mt-1 block">{controlErrors.bureauFieldValue}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900 invisible">Status</Label>
                                <div
                                    onClick={() => handleControlInputChange("isActive", !controlForm.isActive)}
                                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11 select-none"
                                >
                                    <div className={`
                                        w-5 h-5 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                        ${controlForm.isActive
                                            ? 'bg-[#84cc16] border-[#84cc16] shadow-sm'
                                            : 'bg-white border-slate-300'}
                                    `}>
                                        {controlForm.isActive && <Check size={14} className="text-white stroke-[3.5]" />}
                                    </div>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <label className="block text-sm font-medium text-slate-900 mb-1 truncate max-w-[180px] cursor-pointer">
                                                    Is this Configuration active?<span className="text-red-500">*</span>
                                                </label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Is this Configuration active?
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider></div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-center gap-4 mt-2">
                        <button
                            onClick={handleSaveControl}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={18} />
                            {controlFormMode === "edit" ? "Save Changes" : "Submit"}
                        </button>
                        <button
                            onClick={handleCancelControl}
                            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <TableCard>
                <DataTable<BureauControlRow>
                    data={bureauControlData}
                    columns={bureauControlColumns}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    toolbarButtons={[
                        {
                            icon: <Plus size={16} />,
                            label: "Add",
                            onClick: handleAddControl,
                            className: "bg-blue-600 hover:bg-blue-700 text-white",
                        }
                    ]}
                    actions={{
                        header: "Actions",
                        width: "100px",
                        items: (row) => [
                            {
                                icon: <Trash2 size={16} className="text-red-500" />,
                                label: "Delete",
                                onClick: () => console.log("Delete control", row.id),
                            }
                        ],
                    }}
                />
            </TableCard>
        </div>
    );
};

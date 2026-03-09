import { LayoutGrid, FileText, Edit2, Trash2 } from "lucide-react";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import Card from "@/shared/components/ui/card";
import type { ActionDef } from "@/features/manageleads/ui/data-table/types";
import {
    ruleColumns,
    ruleEditFields,
    type AutoOriginateRule,
} from "../config/autooriginationconfig";

interface RuleTabProps {
    filteredRuleData: AutoOriginateRule[];
    selectedRuleGroupId: string | null;
    ruleEditMode: "add" | "edit";
    ruleForm: Partial<AutoOriginateRule>;
    ruleErrors: Record<string, string>;
    isRuleSubmitted: boolean;
    operatorOptions: { value: string; label: string }[];
    bureauControlOptions: { value: string; label: string }[];
    tableRef: React.RefObject<HTMLDivElement>;
    ruleFormRef: React.RefObject<HTMLDivElement>;
    handleRuleInputChange: (key: string, value: any) => void;
    handleSaveRule: () => void;
    handleEditRule: (rule: AutoOriginateRule) => void;
    handleDeleteRule: (rule: AutoOriginateRule) => void;
    resetRuleForm: () => void;
}

export const RuleTab = ({
    filteredRuleData,
    selectedRuleGroupId,
    ruleEditMode,
    ruleForm,
    ruleErrors,
    isRuleSubmitted,
    operatorOptions,
    bureauControlOptions,
    tableRef,
    ruleFormRef,
    handleRuleInputChange,
    handleSaveRule,
    handleEditRule,
    handleDeleteRule,
    resetRuleForm,
}: RuleTabProps) => {
    const ruleActions: ActionDef<AutoOriginateRule>[] = [
        {
            icon: <Edit2 size={16} className="text-blue-600" />,
            label: "Edit",
            onClick: handleEditRule,
        },
        {
            icon: <Trash2 size={16} className="text-red-500" />,
            label: "Delete",
            onClick: handleDeleteRule,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Auto Originate Rule</h2>
            </div>

            <div className="flex flex-col gap-4" ref={ruleFormRef}>
                {/* Card 1: Bureau Information */}
                <Card className="p-5 border-purple-200 border-2 shadow-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-4 border-b border-purple-100 pb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <LayoutGrid size={16} className="text-purple-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-purple-600">Bureau Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
                        <div>
                            <Label className="block text-sm font-medium text-slate-900 mb-1.5">Auto Originate Group Name <span className="text-red-500">*</span></Label>
                            <Select
                                value={ruleForm.groupName as string}
                                onValueChange={(val) => handleRuleInputChange("groupName", val)}
                            >
                                <SelectTrigger className={`h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.groupName ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"}`}>
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ruleEditFields.find(f => f.key === "groupName")?.options?.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isRuleSubmitted && ruleErrors.groupName && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.groupName}</p>}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-slate-900 mb-1.5">Bureau Group Name <span className="text-red-500">*</span></Label>
                            <Input
                                value={ruleForm.bureauGroup as string}
                                onChange={(e) => handleRuleInputChange("bureauGroup", e.target.value)}
                                placeholder="Enter name"
                                readOnly
                                className="h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed italic text-slate-500"
                            />
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-slate-900 mb-1.5">Bureau Control Name <span className="text-red-500">*</span></Label>
                            <Select
                                value={ruleForm.bureauControl as string}
                                onValueChange={(val) => handleRuleInputChange("bureauControl", val)}
                            >
                                <SelectTrigger className={`h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.bureauControl ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"}`}>
                                    <SelectValue placeholder="--Select--" />
                                </SelectTrigger>
                                <SelectContent>
                                    {bureauControlOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isRuleSubmitted && ruleErrors.bureauControl && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.bureauControl}</p>}
                        </div>

                        <div>
                            <Label className="block text-sm font-medium text-slate-900 mb-1.5">Bureau Name <span className="text-red-500">*</span></Label>
                            <Input
                                value={ruleForm.bureau as string}
                                onChange={(e) => handleRuleInputChange("bureau", e.target.value)}
                                placeholder="Enter bureau"
                                readOnly
                                className="h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none cursor-not-allowed italic text-slate-500"
                            />
                        </div>
                    </div>
                </Card>

                {/* Card 2: Rule Details */}
                <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl">
                    <div className="flex items-center gap-3 mb-4 border-b border-blue-100 pb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText size={16} className="text-blue-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-blue-600">Rule Details</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                            <div>
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Parameter Field <span className="text-red-500">*</span></Label>
                                <Input
                                    value={ruleForm.parameterField as string}
                                    onChange={(e) => handleRuleInputChange("parameterField", e.target.value)}
                                    placeholder="Enter field"
                                    maxLength={500}
                                    className={`h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.parameterField ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"}`}
                                />
                                {(ruleForm.parameterField as string)?.length >= 500 && (
                                    <p className="mt-1 text-[11px] text-red-600 block">* max limit for the fields is 500</p>
                                )}
                                {isRuleSubmitted && ruleErrors.parameterField && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.parameterField}</p>}
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Operator Data Type <span className="text-red-500">*</span></Label>
                                <Select
                                    value={ruleForm.operatorType as string}
                                    onValueChange={(val) => handleRuleInputChange("operatorType", val)}
                                >
                                    <SelectTrigger className={`h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.operatorType ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"}`}>
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ruleEditFields.find(f => f.key === "operatorType")?.options?.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isRuleSubmitted && ruleErrors.operatorType && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.operatorType}</p>}
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Operator 1 <span className="text-red-500">*</span></Label>
                                <span className="flex items-center gap-2">
                                    <Select
                                        value={ruleForm.operator1 as string}
                                        onValueChange={(val) => handleRuleInputChange("operator1", val)}
                                        disabled={!ruleForm.operatorType}
                                    >
                                        <SelectTrigger className={`h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.operator1 ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"} disabled:bg-gray-50 disabled:cursor-not-allowed`}>
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {operatorOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </span>
                                {isRuleSubmitted && ruleErrors.operator1 && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.operator1}</p>}
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Check Value 1 <span className="text-red-500">*</span></Label>
                                <Input
                                    value={ruleForm.check as string}
                                    onChange={(e) => handleRuleInputChange("check", e.target.value)}
                                    placeholder="Enter value"
                                    maxLength={100}
                                    className={`h-11 px-4 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.check ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"}`}
                                />
                                {(ruleForm.check as string)?.length >= 100 && (
                                    <p className="mt-1 text-[11px] text-red-600 block">* max limit for the fields is 100</p>
                                )}
                                {isRuleSubmitted && ruleErrors.check && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.check}</p>}
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-slate-900 mb-1.5">Condition <span className="text-red-500">*</span></Label>
                                <Select
                                    value={ruleForm.condition as string}
                                    onValueChange={(val) => handleRuleInputChange("condition", val)}
                                >
                                    <SelectTrigger className={`h-11 px-4 text-sm bg-white border rounded-xl focus:ring-2 transition-all duration-200 ${isRuleSubmitted && ruleErrors.condition ? "border-red-500 focus:ring-red-200" : "border-gray-200 focus:ring-blue-500 focus:border-transparent"}`}>
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ruleEditFields.find(f => f.key === "condition")?.options?.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isRuleSubmitted && ruleErrors.condition && <p className="text-red-500 text-[11px] mt-1 font-medium">{ruleErrors.condition}</p>}
                            </div>

                            <div className="pt-7">
                                <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11">
                                    <input
                                        type="checkbox"
                                        checked={ruleForm.isActive === true}
                                        onChange={(e) => handleRuleInputChange("isActive", e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                                    />
                                    <span className="text-sm font-medium text-slate-900 truncate">Is this Configuration active?</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-center gap-4 py-8 mt-6">
                <button
                    className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                    onClick={handleSaveRule}
                >
                    <span className="material-symbols-outlined text-lg">save</span>
                    {ruleEditMode === "edit" ? "Save Changes" : "Submit"}
                </button>
                <button
                    className="px-10 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                    onClick={resetRuleForm}
                >
                    <span className="material-symbols-outlined text-lg">close</span> Cancel
                </button>
            </div>

            {selectedRuleGroupId && (
                <div ref={tableRef} className="pt-6 animate-in fade-in duration-500">
                    <TableCard>
                        <DataTable<AutoOriginateRule>
                            data={filteredRuleData}
                            columns={ruleColumns}
                            actions={{
                                header: "Actions",
                                width: "100px",
                                items: ruleActions,
                            }}
                            enableColumnFilters={false}
                            enableGlobalSearch={false}
                            initialPageSize={10}
                            pageSizeOptions={[5, 10, 25]}
                            title="Auto Originate Rule (Active)"
                        />
                    </TableCard>
                </div>
            )}
        </div>
    );
};

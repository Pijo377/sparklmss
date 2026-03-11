import { DataTable } from "@/features/bureau/ui/data-table/DataTable";
import { TableCard } from "@/features/bureau/ui/table-card/TableCard";
import Card from "@/features/bureau/ui/card";
import { Input } from "@/features/bureau/ui/input";
import { Label } from "@/features/bureau/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/bureau/ui/select";
import { Check, FileText, Save, ShieldCheck, Trash2, X } from "lucide-react";
import { type RefObject } from "react";
import { type BureauVerificationRow, bureauVerificationColumns, conditionOptions, operatorOptions, operatorTypeOptions } from "../config/bureauConfig";

interface BureauVerificationTabProps {
    verificationForm: any;
    verificationErrors: Record<string, string>;
    handleVerificationInputChange: (field: any, value: any) => void;
    handleSaveVerification: () => void;
    handleCancelVerification: () => void;
    verificationFormMode: "add" | "edit";
    verificationData: BureauVerificationRow[];
    handleDeleteVerification: (id: string) => void;
    tableRef: RefObject<HTMLDivElement>;
}

export const BureauVerificationTab = ({
    verificationForm,
    verificationErrors,
    handleVerificationInputChange,
    handleSaveVerification,
    handleCancelVerification,
    verificationFormMode,
    verificationData,
    handleDeleteVerification,
    tableRef
}: BureauVerificationTabProps) => {
    // Derived state for dynamic options
    const controlFileOptions = verificationForm.bureauGroupName === "DataXModGroup"
        ? [{ value: "DX_BAV_MVS", label: "DX_BAV_MVS" }, { value: "UpStreamCustom", label: "UpStreamCustom" }]
        : verificationForm.bureauGroupName === "Standard"
            ? [{ value: "MicroBilt_Control", label: "MicroBilt_Control" }]
            : [];

    const parameterTagOptions = verificationForm.bureauName === "DataX"
        ? [{ value: "LicenseKey", label: "LicenseKey" }, { value: "Password", label: "Password" }]
        : verificationForm.bureauName === "MicroBilt"
            ? [{ value: "Score", label: "Score" }]
            : [];

    const dynamicOperatorOptions = verificationForm.decisionDataType === "Numeric"
        ? operatorOptions.filter(opt => ["=", "!=", ">", ">=", "<", "<="].includes(opt.value))
        : (verificationForm.decisionDataType === "Alphabets" || verificationForm.decisionDataType === "Alpha-numeric")
            ? operatorOptions.filter(opt => ["=", "!=", "contains"].includes(opt.value))
            : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <Card className="p-5 border-emerald-200 border-2 shadow-sm rounded-2xl bg-white h-full">
                        <div className="flex items-center gap-3 mb-6 border-b border-emerald-100 pb-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <ShieldCheck size={16} className="text-emerald-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-emerald-600">
                                Verification Basics
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Bureau Group Name</Label>
                                <Select
                                    value={verificationForm.bureauGroupName}
                                    onValueChange={(val) => handleVerificationInputChange("bureauGroupName", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DataXModGroup">DataXModGroup</SelectItem>
                                        <SelectItem value="Standard">Standard</SelectItem>
                                    </SelectContent>
                                </Select>
                                {verificationErrors.bureauGroupName && <span className="text-red-500 text-[10px] mt-1 block">{verificationErrors.bureauGroupName}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Control File</Label>
                                <Select
                                    value={verificationForm.controlFile}
                                    onValueChange={(val) => handleVerificationInputChange("controlFile", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {controlFileOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {verificationErrors.controlFile && <span className="text-red-500 text-[10px] mt-1 block">{verificationErrors.controlFile}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Bureau Name</Label>
                                <Input
                                    value={verificationForm.bureauName}
                                    readOnly
                                    placeholder="Auto-filled"
                                    className="h-11 px-4 text-sm bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Parameter Tag</Label>
                                {verificationForm.controlFile === "DX_BAV_MVS" ? (
                                    <Select
                                        value={verificationForm.parameterTag}
                                        onValueChange={(val) => handleVerificationInputChange("parameterTag", val)}
                                    >
                                        <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200">
                                            <SelectValue placeholder="--Select--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {parameterTagOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={verificationForm.parameterTag}
                                        onChange={(e) => handleVerificationInputChange("parameterTag", e.target.value)}
                                        placeholder="Enter parameter tag"
                                        className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                    />
                                )}
                                {verificationErrors.parameterTag && <span className="text-red-500 text-[10px] mt-1 block">{verificationErrors.parameterTag}</span>}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 border-purple-200 border-2 shadow-sm rounded-2xl bg-white h-full">
                        <div className="flex items-center gap-3 mb-6 border-b border-purple-100 pb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FileText size={16} className="text-purple-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-purple-600">
                                Decision Rules
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Decision Data Type</Label>
                                <Select
                                    value={verificationForm.decisionDataType}
                                    onValueChange={(val) => handleVerificationInputChange("decisionDataType", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {operatorTypeOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {verificationErrors.decisionDataType && <span className="text-red-500 text-[10px] mt-1 block">{verificationErrors.decisionDataType}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Decision Operator</Label>
                                <Select
                                    value={verificationForm.decisionOperator}
                                    onValueChange={(val) => handleVerificationInputChange("decisionOperator", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dynamicOperatorOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {verificationErrors.decisionOperator && <span className="text-red-500 text-[10px] mt-1 block">{verificationErrors.decisionOperator}</span>}
                            </div>
                            <div className="space-y-1.5 col-span-1">
                                <Label className="text-sm font-medium text-slate-900">Decision Value</Label>
                                <Input
                                    value={verificationForm.decisionValue}
                                    onChange={(e) => handleVerificationInputChange("decisionValue", e.target.value)}
                                    placeholder="Enter value"
                                    className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                                />
                                {verificationErrors.decisionValue && <span className="text-red-500 text-[10px] mt-1 block">{verificationErrors.decisionValue}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-slate-900">Condition</Label>
                                <Select
                                    value={verificationForm.condition}
                                    onValueChange={(val) => handleVerificationInputChange("condition", val)}
                                >
                                    <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200">
                                        <SelectValue placeholder="--Select--" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {conditionOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white flex flex-row items-center justify-between gap-6">
                    <div
                        onClick={() => handleVerificationInputChange("isActive", !verificationForm.isActive)}
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11 w-80 px-6 select-none"
                    >
                        <div className={`
                                w-5 h-5 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                ${verificationForm.isActive
                                ? 'bg-[#84cc16] border-[#84cc16] shadow-sm'
                                : 'bg-white border-slate-300'}
                            `}>
                            {verificationForm.isActive && <Check size={14} className="text-white stroke-[3.5]" />}
                        </div>
                        <span className="text-sm font-medium text-slate-900 truncate tracking-tight">Is this Configuration active?</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSaveVerification}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                        >
                            <Save size={18} />
                            {verificationFormMode === "edit" ? "Save Changes" : "Submit"}
                        </button>
                        <button
                            onClick={handleCancelVerification}
                            className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    </div>
                </Card>
            </div>

            {verificationForm.bureauGroupName && (
                <div ref={tableRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <TableCard>
                        <DataTable<BureauVerificationRow>
                            data={verificationData.filter(d => d.bureauGroupName === verificationForm.bureauGroupName)}
                            columns={bureauVerificationColumns}
                            enableColumnFilters={true}
                            enableGlobalSearch={true}
                            actions={{
                                header: "Actions",
                                width: "80px",
                                items: (row) => [
                                    {
                                        icon: <Trash2 size={16} className="text-red-500" />,
                                        label: "Delete",
                                        onClick: () => handleDeleteVerification(row.id),
                                    }
                                ],
                            }}
                        />
                    </TableCard>
                </div>
            )}
        </div>
    );
};

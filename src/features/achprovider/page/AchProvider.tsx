import { useMemo } from "react";
import { Trash2, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/features/achprovider/ui/select";
import { Badge } from "@/features/achprovider/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/features/achprovider/ui/popover";
import { DataTable } from "@/features/achprovider/ui/data-table/DataTable";
import { TableCard } from "@/features/achprovider/ui/table-card/TableCard";
import type { ActionDef } from "@/features/achprovider/ui/data-table/types";

// --- Imports from modular files ---
import {
    type AchProviderMappingRow,
    achProviderColumns,
    providerOptions,
    productOptions
} from "../config/config";
import { useAchProvider } from "../hooks/useAchProvider";

const AchProvider = () => {
    const {
        selections,
        isOpen,
        setIsOpen,
        errors,
        data,
        handleSelectionChange,
        toggleProduct,
        selectAllProducts,
        handleMap,
        handleCancel,
        handleUnmap
    } = useAchProvider();

    // --- Table Configuration ---
    const actions: ActionDef<AchProviderMappingRow>[] = useMemo(() => [
        {
            icon: <Trash2 size={16} className="text-blue-600" />,
            label: "UnMap",
            onClick: (row) => handleUnmap(row),
        },
    ], [handleUnmap]);

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">ACH Provider Mapping</h1>
            </div>

            {/* Select fields + Buttons — single row */}
            <div className="flex flex-wrap items-start gap-4 ">
                {/* Select 1 */}
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <label className="text-sm font-medium text-slate-700">
                        Select ACH Provider
                    </label>
                    <Select
                        value={selections.provider}
                        onValueChange={(value) => handleSelectionChange("provider", value)}
                    >
                        <SelectTrigger className={`w-full h-9 bg-white border-1 shadow-none hover:bg-white focus:ring-0 focus:outline-none ${errors.provider ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                            {providerOptions.map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.provider && (
                        <span className="text-xs text-red-500">{errors.provider}</span>
                    )}
                </div>

                {/* Multi-Select Products */}
                <div className="flex flex-col gap-1 min-w-[300px] max-w-[450px]">
                    <label className="text-sm font-medium text-slate-700">
                        Select Product(s)
                    </label>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <div
                                className={`flex min-h-9 w-full flex-wrap items-center gap-1 rounded-md border bg-white px-3 py-1 text-sm ring-offset-background cursor-pointer ${errors.product ? "border-red-500" : "border-input"} shadow-none hover:bg-white focus:ring-0 focus:outline-none`}
                            >
                                {selections.products.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 items-center">
                                        {selections.products.slice(0, 2).map((product) => (
                                            <Badge
                                                key={product}
                                                variant="default"
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-normal px-2 py-0.5 rounded flex items-center gap-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleProduct(product);
                                                }}
                                            >
                                                {product}
                                                <X size={12} className="cursor-pointer" />
                                            </Badge>
                                        ))}
                                        {selections.products.length > 2 && (
                                            <Badge
                                                variant="outline"
                                                className="border-blue-200 bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded shadow-none"
                                            >
                                                +{selections.products.length - 2} more
                                            </Badge>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-slate-500">-- Select --</span>
                                )}
                                <div className="ml-auto flex items-center shrink-0 opacity-50">
                                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                            <div className="flex flex-col">
                                <div
                                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-100 text-sm border-b"
                                    onClick={selectAllProducts}
                                >
                                    <div className={`w-4 h-4 border rounded flex items-center justify-center ${selections.products.length === productOptions.length ? "bg-blue-600 border-blue-600" : "bg-white"}`}>
                                        {selections.products.length === productOptions.length && <Check size={12} className="text-white" />}
                                    </div>
                                    <span className="font-medium text-slate-900">Select All</span>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {productOptions.map((opt) => {
                                        const isSelected = selections.products.includes(opt);
                                        return (
                                            <div
                                                key={opt}
                                                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-100 text-sm"
                                                onClick={() => toggleProduct(opt)}
                                            >
                                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "bg-white"}`}>
                                                    {isSelected && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className={`${isSelected ? "font-medium" : ""} text-slate-700`}>{opt}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    {errors.product && (
                        <span className="text-xs text-red-500">{errors.product}</span>
                    )}
                </div>

                {/* Buttons — pushed to the right */}
                <div className="flex items-center gap-2 ml-auto mt-6">
                    <button
                        onClick={handleMap}
                        className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                    >
                        Map
                    </button>
                    <button
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-red-600 border border-red-400 hover:bg-red-50 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* DataTable inside TableCard */}
            <TableCard>
                <DataTable<AchProviderMappingRow>
                    data={data}
                    columns={achProviderColumns}
                    actions={{
                        header: "UnMap",
                        width: "80px",
                        items: actions,
                    }}
                    enableColumnFilters={true}
                    enableGlobalSearch={true}
                    initialPageSize={100}
                    pageSizeOptions={[10, 25, 50, 100]}
                    title="ACH Provider Map"
                />
            </TableCard>
        </div>
    );
};

export default AchProvider;

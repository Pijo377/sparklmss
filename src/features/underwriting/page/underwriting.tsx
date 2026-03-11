import { DataTable } from "@/features/underwriting/ui/data-table/DataTable";
import { TableCard } from "@/features/underwriting/ui/table-card/TableCard";
import { Check } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

import {
    mandatoryData,
    mandatoryColumns,
    configurableColumns,
    type UnderwritingRule,
    type ConfigurableRule
} from "../config/underwritingConfig";
import { useUnderwriting } from "../hooks/useUnderwriting";

const UnderwritingPage = () => {
    const {
        configurableData,
        selectedProduct,
        error,
        handleToggle,
        handleProductChange,
        handleSubmit,
        handleCancel
    } = useUnderwriting();

    return (
        <div className="flex flex-col gap-6 p-4 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Underwriting</h1>
            </div>

            {/* Header Section: Select and Buttons */}
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <label className="text-sm font-medium text-slate-700">
                        Select Campaign
                    </label>
                    <Select
                        value={selectedProduct}
                        onValueChange={handleProductChange}
                    >
                        <SelectTrigger className={`w-full h-9 bg-white border-1 shadow-none focus:ring-0 ${error ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="product1">Product 1</SelectItem>
                            <SelectItem value="product2">Product 2</SelectItem>
                            <SelectItem value="product3">Product 3</SelectItem>
                        </SelectContent>
                    </Select>
                    {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm"
                    >
                        Submit
                    </button>
                    <button
                        onClick={handleCancel}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 rounded-md transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <TableCard>
                    <DataTable<UnderwritingRule>
                        data={mandatoryData}
                        columns={mandatoryColumns}
                        enablePagination={true}
                        enableColumnFilters={true}
                        enableGlobalSearch={true}
                        initialPageSize={100}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                </TableCard>

                <TableCard>
                    <DataTable<ConfigurableRule>
                        data={configurableData}
                        columns={configurableColumns}
                        actions={{
                            header: "Check",
                            width: "80px",
                            items: (row) => [
                                {
                                    icon: (
                                        <div className={`w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center shrink-0 ${row.checked ? 'bg-[#84cc16] border-[#84cc16] shadow-sm' : 'bg-white border-slate-300'}`}>
                                            {row.checked && <Check size={12} className="text-white stroke-[3.5]" />}
                                        </div>
                                    ),
                                    label: "Check",
                                    onClick: (r) => handleToggle(r.id),
                                }
                            ],
                        }}
                        enablePagination={true}
                        enableColumnFilters={true}
                        enableGlobalSearch={true}
                        initialPageSize={100}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                </TableCard>
            </div>
        </div>
    );
};

export default UnderwritingPage;

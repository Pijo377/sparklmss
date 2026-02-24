import { useState } from "react";
import { Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { DataTable } from "@/features/manageleads/ui/data-table/DataTable";
import { TableCard } from "@/features/manageleads/ui/table-card/TableCard";
import type { ActionDef } from "@/features/manageleads/ui/data-table/types";
//import HierarchicalView from "@/features/manageleads/components/HierarchicalView";
import MappingPage from "@/features/manageleads/ui/tree.ui/tree.ui/MappingPage";

import { tabConfigs, buildColumns, type MappingRow } from "@/features/manageleads/config/portfoliomappingconfig";

const PortfolioMapping = () => {
    // Per-tab state for select values
    const [selections, setSelections] = useState<Record<string, { select1: string; select2: string }>>(() => {
        const initial: Record<string, { select1: string; select2: string }> = {};
        tabConfigs.forEach((tab) => {
            initial[tab.value] = { select1: "", select2: "" };
        });
        return initial;
    });
    const [tabData, setTabData] = useState<Record<string, MappingRow[]>>(() => {
        const initial: Record<string, MappingRow[]> = {};
        tabConfigs.forEach((tab) => {
            initial[tab.value] = tab.data;
        });
        return initial;
    });
    const [activeTab, setActiveTab] = useState("portfolio-product");
    const [expandAll, setExpandAll] = useState<boolean>(true);
    const [errors, setErrors] = useState<Record<string, { select1?: string; select2?: string }>>({
    });

    const handleSelectionChange = (tabValue: string, field: "select1" | "select2", value: string) => {
        setSelections((prev) => ({
            ...prev,
            [tabValue]: { ...prev[tabValue], [field]: value },
        }));
        // Clear the error for this field when user selects a value
        setErrors((prev) => ({
            ...prev,
            [tabValue]: { ...prev[tabValue], [field]: undefined },
        }));
    };

    const handleUnmap = (tabValue: string, row: MappingRow) => {
        setTabData((prev) => ({
            ...prev,
            [tabValue]: prev[tabValue].filter((item) => item.id !== row.id),
        }));
    };

    const handleMap = (tabValue: string) => {
        const sel = selections[tabValue];
        const tab = tabConfigs.find((t) => t.value === tabValue);
        const newErrors: { select1?: string; select2?: string } = {};

        if (!sel.select1) {
            newErrors.select1 = `Please select ${tab?.selectLabel1 || "a value"}`;
        }
        if (!sel.select2) {
            newErrors.select2 = `Please select ${tab?.selectLabel2 || "a value"}`;
        }

        if (newErrors.select1 || newErrors.select2) {
            setErrors((prev) => ({ ...prev, [tabValue]: newErrors }));
            return;
        }

        // Clear errors and proceed with mapping
        setErrors((prev) => ({ ...prev, [tabValue]: {} }));
        console.log(`Mapping for ${tabValue}:`, sel);
    };

    const handleCancel = (tabValue: string) => {
        setSelections((prev) => ({
            ...prev,
            [tabValue]: { select1: "", select2: "" },
        }));
        setErrors((prev) => ({ ...prev, [tabValue]: {} }));
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Portfolio Mapping</h1>
            </div>

            <Tabs defaultValue="portfolio-product" className="w-full" onValueChange={setActiveTab}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <TabsList className="bg-muted p-1 rounded-lg inline-flex flex-wrap justify-start gap-1 h-auto w-auto">
                        {tabConfigs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="
                                    flex items-center gap-2 px-3 py-2.5 text-sm
                                    data-[state=active]:bg-blue-600
                                    data-[state=active]:text-white
                                    data-[state=active]:shadow-sm
                                "
                            >
                                {tab.icon}
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {activeTab === "hierarchical" && (
                        <button
                            onClick={() => setExpandAll((prev) => !prev)}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${expandAll
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "border border-blue-400 text-blue-600 hover:bg-blue-50"
                                }`}
                        >
                            {expandAll ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            {expandAll ? "Collapse" : "Expand"}
                        </button>
                    )}
                </div>

                {tabConfigs.map((tab) => {
                    const sel = selections[tab.value];
                    const actions: ActionDef<MappingRow>[] = [
                        {
                            icon: <Trash2 size={16} className="text-blue-600" />,
                            label: "UnMap",
                            onClick: (row) => handleUnmap(tab.value, row),
                        },
                    ];

                    return (
                        <TabsContent key={tab.value} value={tab.value} className="mt-4">
                            {tab.value === "hierarchical" ? (
                                //   <HierarchicalView />
                                <MappingPage expandAll={expandAll} />
                            ) : (
                                <>
                                    {/* Select fields + Buttons — single row */}
                                    <div className="flex flex-wrap items-start gap-4 mb-4">
                                        {/* Select 1 */}
                                        <div className="flex flex-col gap-1 min-w-[200px]">
                                            <label className="text-sm font-medium text-slate-700">
                                                {tab.selectLabel1}
                                            </label>
                                            <Select
                                                value={sel.select1}
                                                onValueChange={(value) => handleSelectionChange(tab.value, "select1", value)}
                                            >
                                                <SelectTrigger className={`w-full h-9 bg-white border-1 shadow-none hover:bg-white focus:ring-0 focus:outline-none ${errors[tab.value]?.select1 ? "border-red-500" : ""}`}>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60 overflow-y-auto">
                                                    {tab.options1.map((opt) => (
                                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors[tab.value]?.select1 && (
                                                <span className="text-xs text-red-500">{errors[tab.value].select1}</span>
                                            )}
                                        </div>

                                        {/* Select 2 */}
                                        <div className="flex flex-col gap-1 min-w-[200px]">
                                            <label className="text-sm font-medium text-slate-700">
                                                {tab.selectLabel2}
                                            </label>
                                            <Select
                                                value={sel.select2}
                                                onValueChange={(value) => handleSelectionChange(tab.value, "select2", value)}
                                            >
                                                <SelectTrigger className={`w-full h-9 bg-white border-1 shadow-none hover:bg-white focus:ring-0 focus:outline-none ${errors[tab.value]?.select2 ? "border-red-500" : ""}`}>
                                                    <SelectValue placeholder="-- Select --" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-60 overflow-y-auto">
                                                    {tab.options2.map((opt) => (
                                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors[tab.value]?.select2 && (
                                                <span className="text-xs text-red-500">{errors[tab.value].select2}</span>
                                            )}
                                        </div>

                                        {/* Buttons — pushed to the right */}
                                        <div className="flex items-center gap-2 ml-auto mt-6">
                                            <button
                                                onClick={() => handleMap(tab.value)}
                                                className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                                            >
                                                Map
                                            </button>
                                            <button
                                                onClick={() => handleCancel(tab.value)}
                                                className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-red-600 border border-red-400 hover:bg-red-50 rounded-md transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>

                                    {/* DataTable inside TableCard */}
                                    <TableCard>
                                        <DataTable<MappingRow>
                                            data={tabData[tab.value]}
                                            columns={buildColumns(tab.nameHeader, tab.fieldHeader)}
                                            actions={{
                                                header: "UnMap",
                                                width: "80px",
                                                items: actions,
                                            }}
                                            enableColumnFilters={true}
                                            enableGlobalSearch={true}
                                            initialPageSize={100}
                                            pageSizeOptions={[10, 25, 50, 100]}
                                            title={tab.tableTitle}
                                        />
                                    </TableCard>
                                </>
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default PortfolioMapping;

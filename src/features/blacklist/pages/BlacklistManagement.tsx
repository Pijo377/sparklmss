import { useState, useMemo, useCallback } from "react";
import {
    Trash2,
    PlusCircle, Upload, Download, FileSpreadsheet
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/blacklistselect";
import { DisplayTable, type DisplayTableColumn } from "../components/DisplayTable";
import {
    type BlacklistEntry,
    type DeviceEntry,
    type Category,
    categoryPlaceholder,
    categories,
    initialData,
    initialCustomerData,
    initialEmailData,
    initialPhoneData,
    initialAccountData,
    initialEmployerData,
    initialAbaData,
    initialIpData,
    initialDomainData,
    initialDeviceData,
    campaignOptions,
    affiliateOptions,
    subaffiliateOptions,
    categoryLabels,
    categoryPlaceholders
} from "../config/blacklistmanagementconfig";
import { categoryFormatter, categoryValidator } from "../utils/blacklistutilis";

// ── Component ──────────────────────────────────────────────────────────
const BlacklistManagement = () => {
    const [activeCategory, setActiveCategory] = useState("Blacklist SSN");
    const [data, setData] = useState<BlacklistEntry[]>(initialData);
    const [deviceData, setDeviceData] = useState<DeviceEntry[]>(initialDeviceData);
    const [newEntry, setNewEntry] = useState("");
    const [entryError, setEntryError] = useState<string | null>(null);

    // Customer-specific state (first name / last name)
    const [customerFirstName, setCustomerFirstName] = useState("");
    const [customerLastName, setCustomerLastName] = useState("");
    const [customerFirstError, setCustomerFirstError] = useState<string | null>(null);
    const [customerLastError, setCustomerLastError] = useState<string | null>(null);

    // Subaffiliate-specific state
    const [subCampaign, setSubCampaign] = useState("");
    const [subAffiliate, setSubAffiliate] = useState("");
    const [subSubaffiliate, setSubSubaffiliate] = useState("");
    const [subErrors, setSubErrors] = useState<Record<string, string | null>>({});

    // Handlers
    const handleDelete = useCallback((id: number) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleDeviceDelete = useCallback((id: number) => {
        setDeviceData((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleInputChange = useCallback((value: string) => {
        const formatter = categoryFormatter[activeCategory];
        setNewEntry(formatter ? formatter(value) : value);
        setEntryError(null);
    }, [activeCategory]);

    // Generic add handler (for most categories)
    const handleAdd = useCallback(() => {
        if (!newEntry.trim()) {
            const categoryBase = activeCategory.replace("Blacklist ", "");
            setEntryError(`* please enter ${categoryBase.toLowerCase()}`);
            return;
        }
        const validator = categoryValidator[activeCategory];
        if (validator) {
            const error = validator(newEntry);
            if (error) {
                setEntryError(error);
                return;
            }
        }
        const newId = Math.max(...data.map((d) => d.id), 0) + 1;
        const today = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
        setData((prev) => [...prev, { id: newId, value: newEntry.trim(), date: today }]);
        setNewEntry("");
        setEntryError(null);
    }, [newEntry, data, activeCategory]);

    // Customer add handler
    const handleAddCustomer = useCallback(() => {
        let hasError = false;
        if (!customerFirstName.trim()) {
            setCustomerFirstError("* please enter First name");
            hasError = true;
        } else if (customerFirstName.trim().length < 2) {
            setCustomerFirstError("* please enter First name correctly");
            hasError = true;
        } else {
            setCustomerFirstError(null);
        }

        if (!customerLastName.trim()) {
            setCustomerLastError("* please enter Last name");
            hasError = true;
        } else if (customerLastName.trim().length < 2) {
            setCustomerLastError("* please enter Last name correctly");
            hasError = true;
        } else {
            setCustomerLastError(null);
        }

        if (hasError) return;

        const newId = Math.max(...data.map((d) => d.id), 0) + 1;
        const today = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
        const fullName = `${customerFirstName.trim()} ${customerLastName.trim()}`;
        setData((prev) => [...prev, {
            id: newId,
            firstName: customerFirstName.trim(),
            lastName: customerLastName.trim(),
            value: fullName,
            date: today
        }]);
        setCustomerFirstName("");
        setCustomerLastName("");
        setCustomerFirstError(null);
        setCustomerLastError(null);
    }, [customerFirstName, customerLastName, data]);

    // Subaffiliate add handler
    const handleAddSubaffiliate = useCallback(() => {
        const errors: Record<string, string | null> = {};
        if (!subCampaign) errors.campaign = "Select a Campaign Name";
        if (!subAffiliate) errors.affiliate = "Select an Affiliate ID";
        if (!subSubaffiliate) errors.subaffiliate = "Select a Subaffiliate ID";

        if (Object.keys(errors).length > 0) {
            setSubErrors(errors);
            return;
        }
        // Add logic here — for now just clear
        setSubCampaign("");
        setSubAffiliate("");
        setSubSubaffiliate("");
        setSubErrors({});
    }, [subCampaign, subAffiliate, subSubaffiliate]);

    // Reset all entry state on category change
    const handleCategoryChange = useCallback((name: string) => {
        setActiveCategory(name);
        setNewEntry("");
        setEntryError(null);
        setCustomerFirstName("");
        setCustomerLastName("");
        setCustomerFirstError(null);
        setCustomerLastError(null);
        setSubCampaign("");
        setSubAffiliate("");
        setSubSubaffiliate("");
        setSubErrors({});

        // Update data based on category (mock behavior)
        switch (name) {
            case "Blacklist Customer":
                setData(initialCustomerData);
                break;
            case "Blacklist Email":
                setData(initialEmailData);
                break;
            case "Blacklist Phone No":
                setData(initialPhoneData);
                break;
            case "Blacklist Account No":
                setData(initialAccountData);
                break;
            case "Blacklist Employer":
                setData(initialEmployerData);
                break;
            case "Blacklist ABA":
                setData(initialAbaData);
                break;
            case "Blacklist IPAddress":
                setData(initialIpData);
                break;
            case "Blacklist Domain":
                setData(initialDomainData);
                break;
            case "Blacklist Device":
                setDeviceData(initialDeviceData);
                break;
            default:
                setData(initialData);
        }
    }, []);

    // ── Columns ────────────────────────────────────────────────────────
    const columns: DisplayTableColumn<BlacklistEntry>[] = useMemo(
        () => {
            if (activeCategory === "Blacklist Customer") {
                return [
                    {
                        header: "#",
                        className: "w-12 text-center text-slate-500",
                        headerClassName: "w-12 text-center",
                        render: (_row: BlacklistEntry, rowIndex: number) => rowIndex + 1,
                    },
                    {
                        header: "First Name",
                        accessorKey: "firstName" as keyof BlacklistEntry,
                        className: "font-medium text-slate-700",
                    },
                    {
                        header: "Last Name",
                        accessorKey: "lastName" as keyof BlacklistEntry,
                        className: "font-medium text-slate-700",
                    },
                    {
                        header: "Actions",
                        headerClassName: "text-center",
                        className: "text-center",
                        render: (row: BlacklistEntry) => (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(row.id);
                                }}
                                className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                            >
                                <Trash2 size={15} />
                            </button>
                        ),
                    },
                ];
            }

            // Specific header mapping
            const headerMap: Record<string, string> = {
                "Blacklist Email": "Email ID",
                "Blacklist Phone No": "Phone Number",
                "Blacklist Account No": "Account Number",
                "Blacklist Employer": "Employer",
                "Blacklist ABA": "ABA Number",
                "Blacklist IPAddress": "IP Address",
                "Blacklist Domain": "Domain",
            };

            const valueHeader = headerMap[activeCategory] || `${activeCategory} Number`;

            return [
                {
                    header: "#",
                    className: "w-12 text-center text-slate-500",
                    headerClassName: "w-12 text-center",
                    render: (_row: BlacklistEntry, rowIndex: number) => rowIndex + 1,
                },
                {
                    header: valueHeader,
                    accessorKey: "value" as keyof BlacklistEntry,
                    className: "font-mono font-medium text-slate-700",
                },
                {
                    header: "Actions",
                    headerClassName: "text-center",
                    className: "text-center",
                    render: (row: BlacklistEntry) => (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(row.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                        >
                            <Trash2 size={15} />
                        </button>
                    ),
                },
            ];
        },
        [activeCategory, handleDelete]
    );

    const deviceColumns: DisplayTableColumn<DeviceEntry>[] = useMemo(
        () => [
            {
                header: "CustomerID",
                accessorKey: "customerId" as keyof DeviceEntry,
                className: "font-mono text-slate-700",
            },
            {
                header: "Browser",
                accessorKey: "browser" as keyof DeviceEntry,
                className: "text-slate-700",
            },
            {
                header: "Browser Version",
                accessorKey: "browserVersion" as keyof DeviceEntry,
                className: "font-mono text-slate-600",
            },
            {
                header: "Operating System",
                accessorKey: "operatingSystem" as keyof DeviceEntry,
                className: "text-slate-700",
            },
            {
                header: "OS Version",
                accessorKey: "osVersion" as keyof DeviceEntry,
                className: "font-mono text-slate-600",
            },
            {
                header: "Device Type",
                accessorKey: "deviceType" as keyof DeviceEntry,
                className: "text-slate-700",
            },
            {
                header: "IP Address",
                accessorKey: "ipAddress" as keyof DeviceEntry,
                className: "font-mono text-slate-600",
            },
            {
                header: "Action",
                headerClassName: "text-center",
                className: "text-center",
                render: (row: DeviceEntry) => (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeviceDelete(row.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                    >
                        <Trash2 size={15} />
                    </button>
                ),
            },
        ],
        [handleDeviceDelete]
    );

    // ── Helpers ─────────────────────────────────────────────────────────
    const isSubaffiliate = activeCategory === "Blacklist Subaffiliate ID";
    const isDevice = activeCategory === "Blacklist Device";
    const isCustomer = activeCategory === "Blacklist Customer";
    const showTable = !isSubaffiliate;
    const showRightPanel = !isSubaffiliate && !isDevice;


    // ── JSX ────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-4 p-4 h-full">
            <h1 className="text-2xl font-semibold text-slate-900 shrink-0">
                Blacklist Management
            </h1>

            {/* Main layout */}
            <div className="flex gap-4 items-stretch min-h-0 flex-1">

                {/* ── Left: Categories ── */}
                <div className="w-48 xl:w-56 shrink-0 flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden h-full">
                    <div className="p-4 border-b flex items-center gap-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Categories
                        </span>
                    </div>
                    <nav className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {categories.map((cat: Category) => (
                            <button
                                key={cat.name}
                                onClick={() => handleCategoryChange(cat.name)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${activeCategory === cat.name
                                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {cat.icon}
                                {cat.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* ── Center Panel ── */}
                <div className="flex-1 min-w-0 flex flex-col">

                    {/* Subaffiliate: 2 in row, 1 below, buttons at bottom */}
                    {isSubaffiliate && (
                        <div className="rounded-xl border bg-card shadow-sm p-6 h-full flex flex-col">
                            <h2 className="text-base font-semibold text-slate-800 mb-6">
                                Blacklist Subaffiliate ID
                            </h2>

                            <div className="space-y-6">
                                {/* First Row: 2 fields */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Campaign Name */}
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                                            Select the Campaign Name
                                        </label>
                                        <Select
                                            value={subCampaign}
                                            onValueChange={(value) => {
                                                setSubCampaign(value);
                                                setSubErrors((p) => ({ ...p, campaign: null }));
                                            }}
                                        >
                                            <SelectTrigger className={`w-full h-9 bg-slate-50 border-slate-200 text-xs shadow-none focus:ring-1 focus:ring-primary ${subErrors.campaign ? "border-red-400 focus:ring-red-400" : ""}`}>
                                                <SelectValue placeholder="-- Select Campaign --" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                {campaignOptions.map((o: string) => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {subErrors.campaign && (
                                            <p className="text-[10px] text-red-500 mt-1 font-medium">{subErrors.campaign}</p>
                                        )}
                                    </div>

                                    {/* Affiliate ID */}
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                                            Select Affiliate ID to Blacklist
                                        </label>
                                        <Select
                                            value={subAffiliate}
                                            onValueChange={(value) => {
                                                setSubAffiliate(value);
                                                setSubErrors((p) => ({ ...p, affiliate: null }));
                                            }}
                                        >
                                            <SelectTrigger className={`w-full h-9 bg-slate-50 border-slate-200 text-xs shadow-none focus:ring-1 focus:ring-primary ${subErrors.affiliate ? "border-red-400 focus:ring-red-400" : ""}`}>
                                                <SelectValue placeholder="-- Select Affiliate ID --" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                {affiliateOptions.map((o: string) => (
                                                    <SelectItem key={o} value={o}>{o}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {subErrors.affiliate && (
                                            <p className="text-[10px] text-red-500 mt-1 font-medium">{subErrors.affiliate}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Second Row: 1 field */}
                                <div className="w-1/2 pr-3">
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                                        Select Subaffiliate ID to Blacklist
                                    </label>
                                    <Select
                                        value={subSubaffiliate}
                                        onValueChange={(value) => {
                                            setSubSubaffiliate(value);
                                            setSubErrors((p) => ({ ...p, subaffiliate: null }));
                                        }}
                                    >
                                        <SelectTrigger className={`w-full h-9 bg-slate-50 border-slate-200 text-xs shadow-none focus:ring-1 focus:ring-primary ${subErrors.subaffiliate ? "border-red-400 focus:ring-red-400" : ""}`}>
                                            <SelectValue placeholder="-- Select Subaffiliate ID --" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {subaffiliateOptions.map((o: string) => (
                                                <option key={o} value={o}>{o}</option>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {subErrors.subaffiliate && (
                                        <p className="text-[10px] text-red-500 mt-1 font-medium">{subErrors.subaffiliate}</p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons centered at the bottom */}
                            <div className="flex justify-center gap-4 mt-auto pt-8">
                                <button
                                    onClick={handleAddSubaffiliate}
                                    className="min-w-[130px] bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                                >
                                    <PlusCircle size={14} />
                                    Add
                                </button>
                                <button
                                    onClick={() => {
                                        /* delete logic placeholder */
                                    }}
                                    className="min-w-[130px] bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold py-2.5 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setSubCampaign("");
                                        setSubAffiliate("");
                                        setSubSubaffiliate("");
                                        setSubErrors({});
                                    }}
                                    className="min-w-[130px] border border-slate-200 hover:bg-slate-50 text-slate-500 text-[11px] font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                                >
                                    <PlusCircle className="rotate-45" size={14} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Device: table with device columns */}
                    {isDevice && (
                        <DisplayTable<DeviceEntry>
                            className="h-full"
                            data={deviceData}
                            columns={deviceColumns}
                            title="Blacklist Device"
                            enableGlobalSearch
                            enableColumnFilters
                            enablePagination
                            initialPageSize={10}
                            pageSizeOptions={[10, 100, 150, 200]}
                            emptyMessage="No device entries found."
                        />
                    )}

                    {/* All other categories: standard blacklist table */}
                    {showTable && !isDevice && (
                        <DisplayTable<BlacklistEntry>
                            className="h-full"
                            data={data}
                            columns={columns}
                            title={activeCategory}
                            enableGlobalSearch
                            enableColumnFilters
                            enablePagination
                            enableExport
                            exportButtonClassName="bg-green-600 border-green-600 hover:bg-green-700"
                            exportFileName={activeCategory.replace(/\s+/g, "_")}
                            initialPageSize={10}
                            pageSizeOptions={[10, 100, 150, 200]}
                            emptyMessage="No blacklist entries found."
                        />
                    )}
                </div>

                {/* ── Right Panel: Add Entry & Bulk Import ── */}
                {showRightPanel && (
                    <div className="w-72 xl:w-80 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-6 shrink-0 rounded-lg border bg-card shadow-sm h-full">

                        {/* Add Entry */}
                        <section className="space-y-4">
                            <h2 className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                                <PlusCircle size={14} className="text-primary" />
                                Add Entry
                            </h2>
                            <div className="space-y-3">

                                {/* Customer: two fields (first name + last name) */}
                                {isCustomer ? (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                                                Enter the First name
                                            </label>
                                            <input
                                                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none focus:ring-1 ${customerFirstError
                                                    ? "border-red-400 focus:ring-red-400"
                                                    : "border-slate-200 focus:ring-primary"
                                                    }`}
                                                placeholder="Enter First Name"
                                                type="text"
                                                value={customerFirstName}
                                                onChange={(e) => {
                                                    setCustomerFirstName(e.target.value);
                                                    setCustomerFirstError(null);
                                                }}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddCustomer()}
                                            />
                                            {customerFirstError && (
                                                <p className="text-[10px] text-red-500 mt-1 font-medium">{customerFirstError}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                                                Enter the Last name
                                            </label>
                                            <input
                                                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none focus:ring-1 ${customerLastError
                                                    ? "border-red-400 focus:ring-red-400"
                                                    : "border-slate-200 focus:ring-primary"
                                                    }`}
                                                placeholder="Enter Last Name"
                                                type="text"
                                                value={customerLastName}
                                                onChange={(e) => {
                                                    setCustomerLastName(e.target.value);
                                                    setCustomerLastError(null);
                                                }}
                                                onKeyDown={(e) => e.key === "Enter" && handleAddCustomer()}
                                            />
                                            {customerLastError && (
                                                <p className="text-[10px] text-red-500 mt-1 font-medium">{customerLastError}</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    /* All other categories: single input */
                                    <div>
                                        <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                                            {categoryLabels[activeCategory] || activeCategory}
                                        </label>
                                        <input
                                            className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none focus:ring-1 ${entryError
                                                ? "border-red-400 focus:ring-red-400"
                                                : "border-slate-200 focus:ring-primary"
                                                }`}
                                            placeholder={categoryPlaceholders[activeCategory] || categoryPlaceholder[activeCategory] || `Enter ${activeCategory}`}
                                            type="text"
                                            value={newEntry}
                                            onChange={(e) => handleInputChange(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                                        />
                                        {entryError && (
                                            <p className="text-[10px] text-red-500 mt-1 font-medium">{entryError}</p>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={isCustomer ? handleAddCustomer : handleAdd}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => {
                                            setNewEntry("");
                                            setEntryError(null);
                                            setCustomerFirstName("");
                                            setCustomerLastName("");
                                            setCustomerFirstError(null);
                                            setCustomerLastError(null);
                                        }}
                                        className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[11px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="h-[1px] bg-slate-100" />

                        {/* Bulk Import */}
                        <section className="space-y-4">
                            <h2 className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                                <Upload size={14} className="text-primary" />
                                Bulk Import
                            </h2>
                            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-center gap-3">
                                <FileSpreadsheet size={18} className="text-primary" />
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold text-primary">Template</p>
                                    <p className="text-[9px] text-slate-500 font-medium">
                                        Download CSV format
                                    </p>
                                </div>
                                <button className="text-primary hover:opacity-70">
                                    <Download size={18} />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                                        Choose Import File
                                    </label>
                                    <input
                                        className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg p-1"
                                        type="file"
                                    />
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
                                    <Upload size={14} />
                                    Import
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlacklistManagement;

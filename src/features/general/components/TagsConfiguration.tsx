import { useState, useMemo, useCallback } from "react";
import { PlusCircle, Settings, Edit2, Trash2, Save, Check } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/components/ui/popover";
import { DisplayTable, type DisplayTableColumn } from "../../blacklist/components/DisplayTable";
import { INITIAL_TAGS, type TagItem } from "../config/generalconfig";

const TagsConfiguration = () => {
    const [data, setData] = useState<TagItem[]>(INITIAL_TAGS);
    const [newTag, setNewTag] = useState("");
    const [editingTag, setEditingTag] = useState<TagItem | null>(null);
    const [editTagValue, setEditTagValue] = useState(""); // Dedicated state for editing
    const [error, setError] = useState<string | null>(null);
    const [configError, setConfigError] = useState<string | null>(null);

    // Config Tags State
    const [loanChecked, setLoanChecked] = useState(true);
    const [customerChecked, setCustomerChecked] = useState(true);

    const handleConfigSubmit = useCallback(() => {
        if (!loanChecked && !customerChecked) {
            setConfigError("* Please select checkbox");
            return;
        }
        setConfigError(null);
        // TODO: handle actual submit logic here
    }, [loanChecked, customerChecked]);

    const handleDelete = useCallback((id: number) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleEdit = useCallback((tag: TagItem) => {
        setEditingTag(tag);
        setEditTagValue(tag.tag); // Use the dedicated edit state
        setError(null);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingTag(null);
        setEditTagValue("");
        setError(null);
    }, []);

    const handleAdd = useCallback(() => {
        if (editingTag) {
            if (!editTagValue.trim()) return;
            setData((prev) =>
                prev.map((item) =>
                    item.id === editingTag.id ? { ...item, tag: editTagValue.trim() } : item
                )
            );
            handleCancelEdit();
        } else {
            if (!newTag.trim()) {
                setError("* Please enter Tag.");
                return;
            }
            const newId = Math.max(...data.map((d) => d.id), 0) + 1;
            setData((prev) => [...prev, { id: newId, tag: newTag.trim() }]);
            setNewTag("");
            setError(null);
        }
    }, [newTag, editTagValue, data, editingTag, handleCancelEdit]);

    const handleCancel = useCallback(() => {
        if (editingTag) {
            handleCancelEdit();
        } else {
            setNewTag("");
            setError(null);
        }
    }, [editingTag, handleCancelEdit]);

    const columns: DisplayTableColumn<TagItem>[] = useMemo(
        () => [
            {
                header: "#",
                className: "w-12 text-center text-slate-500",
                headerClassName: "w-12 text-center",
                render: (_row: TagItem, rowIndex: number) => rowIndex + 1,
            },
            {
                header: "Tags",
                accessorKey: "tag",
                className: "font-medium text-slate-700 p-0",
                render: (row: TagItem) => {
                    const isEditing = editingTag?.id === row.id;
                    if (isEditing) {
                        return (
                            <div className="px-4 py-1.5 h-full flex items-center bg-blue-50/50">
                                <input
                                    autoFocus
                                    className="w-full bg-white border border-blue-400 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
                                    value={editTagValue}
                                    onChange={(e) => setEditTagValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAdd();
                                        if (e.key === "Escape") handleCancelEdit();
                                    }}
                                />
                            </div>
                        );
                    }
                    return <div className="px-4 py-3">{row.tag}</div>;
                },
            },
            {
                header: "Actions",
                headerClassName: "text-center w-24",
                className: "text-center w-24",
                render: (row: TagItem) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors group"
                                title="Settings"
                            >
                                <Settings size={16} className="text-blue-600 cursor-pointer" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="bottom"
                            align="end"
                            sideOffset={8}
                            className="w-auto p-1.5 bg-white border border-blue-500 rounded-[10px] flex items-center gap-1 shadow-lg z-50 animate-in fade-in zoom-in-95"
                        >
                            {editingTag?.id === row.id ? (
                                <PopoverPrimitive.Close asChild>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAdd(); // Save current edit
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium cursor-pointer"
                                    >
                                        <Save size={16} /> Update
                                    </button>
                                </PopoverPrimitive.Close>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(row);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                            )}
                            <PopoverPrimitive.Close asChild>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(row.id);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-medium cursor-pointer"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </PopoverPrimitive.Close>
                        </PopoverContent>
                    </Popover>
                ),
            },
        ],
        [handleDelete, handleEdit, editingTag, editTagValue, handleAdd, handleCancelEdit]
    );

    return (
        <div className="flex gap-4 items-stretch h-full overflow-hidden">
            {/* ── Left: Table ── */}
            <div className="flex-1 min-w-0 flex flex-col">
                <DisplayTable<TagItem>
                    className="h-full"
                    data={[...data].reverse()}
                    columns={columns}
                    title="Tags"
                    enableGlobalSearch
                    enableColumnFilters
                    enablePagination
                    initialPageSize={10}
                    pageSizeOptions={[10, 25, 50, 100]}
                    emptyMessage="No tags found."
                />
            </div>

            {/* ── Right Panel: Add/Update & Configure ── */}
            <div className="w-72 xl:w-80 overflow-y-auto custom-scrollbar flex flex-col shrink-0 rounded-lg border bg-card shadow-sm h-full bg-white">
                {/* Section 1: Add/Update Entry */}
                <section className="p-4 pt-[13px] space-y-4">
                    <h2 className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                        <PlusCircle size={14} className="text-primary" />
                        Add Entry
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                                Enter Tags
                            </label>
                            <input
                                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none focus:ring-1 ${error
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-slate-200 focus:ring-primary"
                                    }`}
                                placeholder="Enter Tag"
                                type="text"
                                value={newTag}
                                onChange={(e) => {
                                    setNewTag(e.target.value);
                                    setError(null);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            />
                            {error && (
                                <p className="text-[10px] text-red-500 mt-1 font-medium">{error}</p>
                            )}
                        </div>

                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleAdd}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                Add
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[11px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </section>

                <div className="h-[1px] bg-slate-100 mx-4" />

                {/* Section 2: Configure Tags */}
                <section className="p-4 pt-[13px] space-y-4">
                    <h2 className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                        <Settings size={14} className="text-primary" />
                        Configure Tags
                    </h2>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            {/* Loan Toggle */}
                            <div
                                onClick={() => { setLoanChecked(!loanChecked); setConfigError(null); }}
                                className="flex items-center gap-3 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors select-none"
                            >
                                <div className={`
                                    w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                    ${loanChecked ? 'bg-blue-600 border-blue-600 shadow-sm' : 'bg-white border-slate-300'}
                                `}>
                                    {loanChecked && <Check size={14} className="text-white stroke-[3.5]" />}
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-medium text-slate-900">Loan</span>
                                </div>
                            </div>

                            {/* Customer Toggle */}
                            <div
                                onClick={() => { setCustomerChecked(!customerChecked); setConfigError(null); }}
                                className="flex items-center gap-3 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors select-none"
                            >
                                <div className={`
                                    w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                    ${customerChecked ? 'bg-blue-600 border-blue-600 shadow-sm' : 'bg-white border-slate-300'}
                                `}>
                                    {customerChecked && <Check size={14} className="text-white stroke-[3.5]" />}
                                </div>
                                <div className="flex-1">
                                    <span className="text-xs font-medium text-slate-900">Customer</span>
                                </div>
                            </div>
                        </div>

                        {configError && (
                            <p className="text-[10px] text-red-500 font-medium -mt-2">{configError}</p>
                        )}

                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleConfigSubmit}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-2 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setConfigError(null)}
                                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[11px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TagsConfiguration;

import { useState, useMemo, useCallback } from "react";
import { PlusCircle, Settings, Edit2, Trash2, Save } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/components/ui/popover";
import { DisplayTable, type DisplayTableColumn } from "../../blacklist/components/DisplayTable";
import { INITIAL_NOTES_TOPICS, type NoteTopic } from "../config/generalconfig";

const NotesTopicConfiguration = () => {
    const [data, setData] = useState<NoteTopic[]>(INITIAL_NOTES_TOPICS);
    const [newTopic, setNewTopic] = useState("");
    const [editingTopic, setEditingTopic] = useState<NoteTopic | null>(null);
    const [editValue, setEditValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleDelete = useCallback((id: number) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const handleEdit = useCallback((topic: NoteTopic) => {
        setEditingTopic(topic);
        setEditValue(topic.topic);
        setError(null);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingTopic(null);
        setEditValue("");
        setError(null);
    }, []);

    const handleAdd = useCallback(() => {
        if (editingTopic) {
            if (!editValue.trim()) return;
            setData((prev) =>
                prev.map((item) =>
                    item.id === editingTopic.id ? { ...item, topic: editValue.trim() } : item
                )
            );
            handleCancelEdit();
        } else {
            if (!newTopic.trim()) {
                setError("* Please enter Topic.");
                return;
            }
            const newId = Math.max(...data.map((d) => d.id), 0) + 1;
            setData((prev) => [...prev, { id: newId, topic: newTopic.trim() }]);
            setNewTopic("");
            setError(null);
        }
    }, [newTopic, editValue, data, editingTopic, handleCancelEdit]);

    const handleCancel = useCallback(() => {
        if (editingTopic) {
            handleCancelEdit();
        } else {
            setNewTopic("");
            setError(null);
        }
    }, [editingTopic, handleCancelEdit]);

    const columns: DisplayTableColumn<NoteTopic>[] = useMemo(
        () => [
            {
                header: "#",
                className: "w-12 text-center text-slate-500",
                headerClassName: "w-12 text-center",
                render: (_row: NoteTopic, rowIndex: number) => rowIndex + 1,
            },
            {
                header: "Topic",
                accessorKey: "topic",
                className: "font-medium text-slate-700 p-0",
                render: (row: NoteTopic) => {
                    const isEditing = editingTopic?.id === row.id;
                    if (isEditing) {
                        return (
                            <div className="px-4 py-1.5 h-full flex items-center bg-blue-50/50">
                                <input
                                    autoFocus
                                    className="w-full bg-white border border-blue-400 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm animate-in fade-in zoom-in-95 duration-200"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleAdd();
                                        if (e.key === "Escape") handleCancelEdit();
                                    }}
                                    onBlur={() => {
                                        // Optional: save on blur if needed, but Enter/Escape is usually better
                                    }}
                                />
                            </div>
                        );
                    }
                    return <div className="px-4 py-3">{row.topic}</div>;
                },
            },
            {
                header: "Actions",
                headerClassName: "text-center w-24",
                className: "text-center w-24",
                render: (row: NoteTopic) => (
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors group"
                                title="Settings"
                            >
                                <Settings size={16} className="text-blue-600 cursor-pointer" />    </button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="bottom"
                            align="end"
                            sideOffset={8}
                            className="w-auto p-1.5 bg-white border border-blue-500 rounded-[10px] flex items-center gap-1 shadow-lg z-50 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95"
                        >
                            {editingTopic?.id === row.id ? (
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
        [handleDelete, editingTopic, editValue, handleAdd, handleCancelEdit, handleEdit]
    );

    return (
        <div className="flex gap-4 items-stretch h-full overflow-hidden">
            {/* ── Left: Table ── */}
            <div className="flex-1 min-w-0 flex flex-col">
                <DisplayTable<NoteTopic>
                    className="h-full"
                    data={[...data].reverse()}
                    columns={columns}
                    title="Notes Topic"
                    enableGlobalSearch
                    enableColumnFilters
                    enablePagination
                    initialPageSize={10}
                    pageSizeOptions={[10, 25, 50, 100]}
                    emptyMessage="No notes topics found."
                />
            </div>

            {/* ── Right Panel: Add/Update Entry ── */}
            <div className="w-72 xl:w-80 overflow-y-auto custom-scrollbar flex flex-col shrink-0 rounded-lg border bg-card shadow-sm h-full bg-white">
                {/* Form Section */}
                <section className="p-4 pt-[13px] space-y-4">
                    <h2 className="text-[11px] font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                        <PlusCircle size={14} className="text-primary" />
                        Add Entry
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                                Enter Notes Topic
                            </label>
                            <input
                                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-xs focus:outline-none focus:ring-1 ${error
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-slate-200 focus:ring-primary"
                                    }`}
                                placeholder="Enter Topic"
                                type="text"
                                value={newTopic}
                                onChange={(e) => {
                                    setNewTopic(e.target.value);
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
                                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 text-[11px] font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
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

export default NotesTopicConfiguration;

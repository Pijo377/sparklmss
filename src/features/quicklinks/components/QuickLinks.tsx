import { GripVertical, Trash2, Plus } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Shortcut } from "../types";
import { cn } from "@/lib/utils";

interface ActiveShortcutItemProps {
    shortcut: Shortcut;
    onRemove: (id: string) => void;
}

const ActiveShortcutItem = ({
    shortcut,
    onRemove,
}: ActiveShortcutItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: shortcut.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "active-item flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-sm group hover:border-primary transition-all cursor-move",
                isDragging && "opacity-50 z-50 border-primary"
            )}
        >
            <GripVertical
                {...attributes}
                {...listeners}
                size={20}
                className="text-slate-300 group-hover:text-slate-400 cursor-move"
            />
            <div className="size-10 rounded-lg flex items-center justify-center bg-slate-100 text-blue-600 group-hover:bg-blue-50 transition-colors">
                {(() => {
                    const Icon = shortcut.icon;
                    return <Icon size={20} />;
                })()}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 shortcut-name">
                    {shortcut.name}
                </p>
                <p className="text-[10px] text-slate-400 font-medium shortcut-category">
                    {shortcut.category}
                </p>
            </div>
            <button
                type="button"
                className="text-slate-300 hover:text-red-500 transition-colors"
                onClick={() => onRemove(shortcut.id)}
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

interface ActiveShortcutsProps {
    activeShortcuts: Shortcut[];
    onRemoveShortcut: (id: string) => void;
    setNodeRef: (node: HTMLElement | null) => void;
    maxLimit: number;
}

export const QuickLinks = ({
    activeShortcuts,
    onRemoveShortcut,
    setNodeRef,
    maxLimit,
}: ActiveShortcutsProps) => {
    const count = activeShortcuts.length;

    return (
        <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
            <div
                ref={setNodeRef}
                className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-sm relative transition-colors"
            >
                <div className="p-4 border-b border-blue-500 flex justify-center items-center bg-blue-600 rounded-t-xl shadow-sm">
                    <span className="text-sm font-semibold text-white tracking-wider">
                        Quick Links ({count}/{maxLimit})
                    </span>
                </div>
                <div className="p-2 flex-1  space-y-3">
                    {activeShortcuts.map((shortcut) => (
                        <ActiveShortcutItem
                            key={shortcut.id}
                            shortcut={shortcut}
                            onRemove={onRemoveShortcut}
                        />
                    ))}

                    {count === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group/empty">
                            {/* Decorative background elements */}
                            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/50"></div>

                            <div className="relative z-10 flex flex-col items-center max-w-[240px]">
                                <div className="mb-6 relative">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-40 group-hover/empty:opacity-60 transition-opacity"></div>
                                    <div className="size-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500 relative z-10 group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-transform duration-500">
                                        <Plus size={32} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-2">
                                    No Quick Links Yet
                                </h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Drag and drop menu items.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

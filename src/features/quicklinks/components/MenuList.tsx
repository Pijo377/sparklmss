import { useDraggable } from "@dnd-kit/core";
import { CATEGORIES } from "../data/menulist";
import type { Shortcut } from "../types";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface DraggableShortcutItemProps {
    shortcut: Shortcut;
    isHidden: boolean;
    onAdd: (shortcut: Shortcut) => void;
}

const DraggableShortcutItem = ({
    shortcut,
    isHidden,
    onAdd,
}: DraggableShortcutItemProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: shortcut.id,
            data: {
                type: "available",
                shortcut,
            },
        });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    if (isHidden) return null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 cursor-grab text-slate-600 group transition-colors",
                isDragging && "opacity-50"
            )}
        >
            <div className="flex items-center gap-2">
                {(() => {
                    const Icon = shortcut.icon;
                    return <Icon size={16} className="text-blue-600" />;
                })()}
                <span className="text-sm font-medium">{shortcut.name}</span>
            </div>
            <button
                type="button"
                className="hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                    e.stopPropagation();
                    onAdd(shortcut);
                }}
            >
                <PlusCircle size={18} />
            </button>
        </div>
    );
};

interface AvailablePathsProps {
    activeShortcuts: Shortcut[];
    onAddShortcut: (shortcut: Shortcut) => void;
    isLimitReached: boolean;
}

export const MenuList = ({
    activeShortcuts,
    onAddShortcut,

}: AvailablePathsProps) => {
    const activeIds = activeShortcuts.map((s) => s.id);

    return (
        <div className="w-full lg:w-1/4 flex flex-col gap-4 h-full">
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-sm">
                <div className="p-4 border-b border-slate-100 flex justify-center items-center">
                    <span className="text-sm font-semibold text-slate-900">
                        Menu List
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                    <Accordion
                        type="multiple"
                        defaultValue={["transaction"]}
                        className="space-y-2"
                    >
                        {CATEGORIES.map((category) => (
                            <AccordionItem
                                key={category.id}
                                value={category.id}
                                className="border-none"
                            >
                                <AccordionTrigger className="flex w-full items-center justify-between p-3 rounded-lg bg-blue-50/50 text-slate-900 font-semibold text-sm hover:bg-blue-100/50 transition-colors group hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const Icon = category.icon;
                                            return <Icon size={20} className="text-blue-600" />;
                                        })()}
                                        {category.name}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="ml-4 border-slate-200 mt-2 space-y-1">
                                    {category.shortcuts.map((shortcut) => (
                                        <DraggableShortcutItem
                                            key={shortcut.id}
                                            shortcut={shortcut}
                                            isHidden={activeIds.includes(shortcut.id)}
                                            onAdd={onAddShortcut}
                                        />
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

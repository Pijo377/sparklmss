import {
    DndContext,
    DragOverlay,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { MenuList } from "../components/MenuList";
import { QuickLinks } from "../components/QuickLinks";
import { Preview } from "../components/Preview";
import { useQuickLinks } from "../hooks/useQuickLinks";

export default function QuicklinksPage() {
    const {
        activeShortcuts,
        activeId,
        draggedShortcut,
        sensors,
        handleAddShortcut,
        handleRemoveShortcut,
        handleDragStart,
        handleDragEnd,
        handleSubmit,
        MAX_LIMIT,
        closestCenter,
    } = useQuickLinks();

    return (
        <div className="flex flex-col gap-4 min-h-[calc(100vh-110px)] lg:h-[calc(100vh-110px)] font-display overflow-y-auto lg:overflow-hidden p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 px-2 gap-4 sm:gap-0">
                <h1 className="text-2xl font-semibold text-slate-900">Quick Link</h1>
                <button
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <span className="material-symbols-outlined text-sm">save</span>
                    Submit
                </button>
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCenter}
            >
                <main className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 p-2">
                    <MenuList
                        activeShortcuts={activeShortcuts}
                        onAddShortcut={handleAddShortcut}
                        isLimitReached={activeShortcuts.length >= MAX_LIMIT}
                    />

                    <SortableContext
                        items={activeShortcuts.map((s) => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <QuickLinks
                            activeShortcuts={activeShortcuts}
                            onRemoveShortcut={handleRemoveShortcut}
                            setNodeRef={() => { }} // This can be used for the drop zone area
                            maxLimit={MAX_LIMIT}
                        />
                    </SortableContext>

                    <Preview activeShortcuts={activeShortcuts} />
                </main>

                <DragOverlay>
                    {activeId && draggedShortcut ? (
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-primary shadow-lg cursor-grabbing w-[300px] opacity-80">
                            <GripVertical size={20} className="text-slate-300" />
                            <div className="size-10 rounded-lg bg-slate-100 text-primary flex items-center justify-center">
                                {(() => {
                                    const Icon = draggedShortcut.icon;
                                    return <Icon size={20} />;
                                })()}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">
                                    {draggedShortcut.name}
                                </p>
                                <p className="text-[10px] text-slate-400 uppercase font-medium">
                                    {draggedShortcut.category}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

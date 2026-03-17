import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Info, Pencil, Plus } from 'lucide-react';
import { type QueueItem } from '../config/generalconfig';

// ─── Sortable Item Component ───────────────────────────────────────────
interface SortableItemProps {
    id: string;
    item: QueueItem;
    type: 'active' | 'inactive';
}

const SortableItem = ({ id, item, type }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const Icon = item.icon;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group flex items-center gap-3 p-3 rounded-[20px] border transition-all duration-200 
                ${isDragging
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : type === 'active'
                        ? 'border-[#7cb342]/30 bg-white shadow-sm hover:border-[#7cb342]'
                        : 'border-[#e57373]/30 bg-white shadow-sm hover:border-[#e57373]'
                }
            `}
        >
            <button
                {...attributes}
                {...listeners}
                className="p-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing transition-colors shrink-0"
                title="Drag to reorder"
            >
                <GripVertical size={16} />
            </button>

            <div className={`p-2.5 rounded-2xl transition-colors shrink-0 ${
                type === 'active' 
                    ? 'bg-green-50 text-green-600' 
                    : 'bg-red-50 text-red-500'
            }`}>
                {Icon && <Icon size={16} />}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-sm font-medium text-slate-900 leading-tight block">
                    {item.label}
                </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 pr-1">
                <button className="p-1 px-1.5 text-slate-300 hover:text-blue-500 transition-colors">
                    <Info size={18} strokeWidth={1.5} />
                </button>
                <div className="w-px h-3.5 bg-slate-200 mx-0.5" />
                <button className="p-1 px-1.5 text-slate-300 hover:text-blue-500 transition-colors">
                    <Pencil size={18} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
};

// ─── Column Component ───────────────────────────────────────────────
interface ColumnProps {
    title: string;
    items: QueueItem[];
    type: 'active' | 'inactive';
}

const Column = ({ title, items, type }: ColumnProps) => {
    const { setNodeRef } = useDroppable({
        id: type,
    });

    return (
        <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[420px]">
            <div className={`p-3.5 flex items-center justify-start px-5 relative shrink-0 ${type === 'active' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    {title}
                    <span className="inline-flex items-center justify-center bg-white/20 text-white min-w-5 h-5 px-1 rounded-full text-[10px] font-bold">
                        {items.length}
                    </span>
                </h3>
            </div>
            <div
                ref={setNodeRef}
                className={`p-4 flex-1 bg-[#f8fafc]/50 scrollbar-hide flex flex-col ${items.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'}`}
            >
                <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} item={item} type={type} />
                        ))}
                    </div>
                    {items.length === 0 && (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden group/empty rounded-xl">
                            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white/50"></div>

                            <div className="relative z-10 flex flex-col items-center max-w-[200px]">
                                <div className="mb-4 relative">
                                    <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-40 group-hover/empty:opacity-60 transition-opacity"></div>
                                    <div className="size-12 rounded-xl bg-white border border-blue-50 shadow-sm flex items-center justify-center text-blue-500 relative z-10 group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-transform duration-500">
                                        <Plus size={24} strokeWidth={1.5} />
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-1">
                                    No {title.toLowerCase()}
                                </h3>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Drag items here to {type === 'active' ? 'activate' : 'deactivate'} them.
                                </p>
                            </div>
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────
interface DraggableConfigProps {
    title: string;
    subtitle?: string;
    initialData: {
        active: QueueItem[];
        inactive: QueueItem[];
    };
    onSave?: (data: { active: QueueItem[]; inactive: QueueItem[] }) => void;
}

const DraggableConfig = ({ title, subtitle, initialData, onSave }: DraggableConfigProps) => {
    const [queues, setQueues] = useState(initialData);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        const overId = over.id;
        const activeId = active.id;

        const activeColumn = queues.active.some(i => i.id === activeId) ? 'active' : 'inactive';

        // Find over column: if over.id is a column key, use it; otherwise find which column contains the over.id
        let overColumn: 'active' | 'inactive' | null = null;
        if (overId === 'active' || overId === 'inactive') {
            overColumn = overId;
        } else {
            overColumn = queues.active.some(i => i.id === overId) ? 'active' : 'inactive';
        }

        if (overColumn && activeColumn !== overColumn) {
            setQueues(prev => {
                const activeItems = [...prev[activeColumn]];
                const overItems = [...prev[overColumn]];
                const activeIndex = activeItems.findIndex(i => i.id === activeId);
                const [movedItem] = activeItems.splice(activeIndex, 1);

                // Add to overItems
                const overIndex = overItems.findIndex(i => i.id === overId);
                const insertIndex = overIndex >= 0 ? overIndex : overItems.length;
                overItems.splice(insertIndex, 0, movedItem);

                return {
                    ...prev,
                    [activeColumn]: activeItems,
                    [overColumn]: overItems
                };
            });
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const overId = over.id;
            const activeId = active.id;

            const activeColumn = queues.active.some(i => i.id === activeId) ? 'active' : 'inactive';

            let overColumn: 'active' | 'inactive' | null = null;
            if (overId === 'active' || overId === 'inactive') {
                overColumn = overId;
            } else {
                overColumn = queues.active.some(i => i.id === overId) ? 'active' : 'inactive';
            }

            if (activeColumn === overColumn) {
                setQueues(prev => ({
                    ...prev,
                    [activeColumn]: arrayMove(
                        prev[activeColumn],
                        prev[activeColumn].findIndex(i => i.id === activeId),
                        prev[activeColumn].findIndex(i => i.id === overId)
                    )
                }));
            }
        }
        setActiveId(null);
    };

    const activeItem = activeId
        ? [...queues.active, ...queues.inactive].find(i => i.id === activeId)
        : null;

    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                    {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <button
                        onClick={() => onSave?.(queues)}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all shadow-sm"
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-slate-600 border border-slate-300 hover:bg-red-50 rounded-md transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Column title="Active Queues" items={queues.active} type="active" />
                    <Column title="InActive Queues" items={queues.inactive} type="inactive" />
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: { active: { opacity: '0.5' } },
                    }),
                }}>
                    {activeId && activeItem ? (
                        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-xl opacity-90 scale-105 cursor-grabbing">
                            <GripVertical size={16} className="text-slate-400" />
                            <div className="flex items-center gap-2 flex-1">
                                {activeItem.icon && (
                                    <div className={`p-2 rounded-lg ${
                                        queues.active.some(i => i.id === activeId) 
                                            ? "bg-green-50 text-green-600" 
                                            : "bg-red-50 text-red-500"
                                    }`}>
                                        <activeItem.icon size={16} />
                                    </div>
                                )}
                                <span className="text-sm font-semibold text-slate-800">{activeItem.label}</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default DraggableConfig;

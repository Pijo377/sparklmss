import React from 'react';
import {
    useDroppable,
} from '@dnd-kit/core';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
    id: string;
    name: string;
    icon?: string;
}

interface DragPreviewProps {
    name: string;
    icon?: string;
}

interface DroppableContainerProps {
    id: string;
    children: React.ReactNode;
    emptyLabel: string;
    icon?: string;
}

export const SortableItem = ({ id, name, icon }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 100 : 'auto',
        opacity: isDragging ? 0.6 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-lg text-xs font-medium text-slate-700 cursor-move hover:border-blue-300 flex items-center justify-between mb-2 group active:scale-[0.98] transition-all touch-none select-none"
        >
            <div className="flex items-center gap-2 truncate pr-2">
                {name}
            </div>
            <span className="material-symbols-outlined text-sm text-slate-300 group-hover:text-blue-400 shrink-0">{icon || 'drag_indicator'}</span>
        </div>
    );
};

export const DragPreview = ({ name, icon }: DragPreviewProps) => (
    <div className="p-2.5 bg-white border border-blue-200 shadow-lg rounded-lg text-xs font-medium text-slate-700 flex items-center justify-between group active:scale-[1.02] transition-all touch-none select-none w-full">
        <div className="flex items-center gap-2 truncate pr-2 font-bold text-blue-600">
            {name}
        </div>
        <span className="material-symbols-outlined text-sm text-blue-400 shrink-0">{icon || 'drag_indicator'}</span>
    </div>
);

export const DroppableContainer = ({ id, children, emptyLabel, icon }: DroppableContainerProps) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`bg-slate-50/50 border rounded-xl p-3 h-[130px] overflow-y-auto overflow-x-hidden transition-colors duration-200 ${isOver ? 'bg-blue-50/50 border-blue-200' : 'border-slate-100'}`}
        >
            {children}
            {React.Children.count(children) === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-[10px] text-slate-400 italic border-2 border-dashed border-slate-200 rounded-lg p-3 text-center gap-1">
                    {icon && <span className="material-symbols-outlined text-lg">{icon}</span>}
                    {emptyLabel}
                </div>
            )}
        </div>
    );
};

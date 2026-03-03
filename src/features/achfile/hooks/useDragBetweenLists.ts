import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Dispatch, SetStateAction } from 'react';

export const useDragBetweenLists = <T extends { id: string }>(
    availableItems: T[],
    setAvailableItems: Dispatch<SetStateAction<T[]>>,
    mappedItems: T[],
    setMappedItems: Dispatch<SetStateAction<T[]>>,
    availableDroppableId: string,
    mappedDroppableId: string,
    setActiveId: (id: string | null) => void
) => {
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        // Determine source and destination
        const fromAvailable = availableItems.find(item => item.id === activeId);
        const fromMapped = mappedItems.find(item => item.id === activeId);

        const toAvailable = overId === availableDroppableId || availableItems.some(item => item.id === overId);
        const toMapped = overId === mappedDroppableId || mappedItems.some(item => item.id === overId);

        if (fromAvailable && toMapped) {
            setAvailableItems(prev => prev.filter(item => item.id !== activeId));
            setMappedItems(prev => [...prev, fromAvailable]);
        } else if (fromMapped && toAvailable) {
            setMappedItems(prev => prev.filter(item => item.id !== activeId));
            setAvailableItems(prev => [...prev, fromMapped]);
        } else if (fromAvailable && toAvailable) {
            const oldIndex = availableItems.findIndex(item => item.id === activeId);
            const newIndex = availableItems.findIndex(item => item.id === overId);
            if (newIndex !== -1) setAvailableItems(items => arrayMove(items, oldIndex, newIndex));
        } else if (fromMapped && toMapped) {
            const oldIndex = mappedItems.findIndex(item => item.id === activeId);
            const newIndex = mappedItems.findIndex(item => item.id === overId);
            if (newIndex !== -1) setMappedItems(items => arrayMove(items, oldIndex, newIndex));
        }
    };

    return handleDragEnd;
};

import { useState } from "react";
import {
    PointerSensor,
    useSensor,
    useSensors,
    closestCenter,
} from "@dnd-kit/core";
import type {
    DragEndEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
} from "@dnd-kit/sortable";
import { IoCheckmarkCircle, IoCash, IoCloudDownload, IoCloudUpload } from "react-icons/io5";
import type { Shortcut } from "../types";

const MAX_LIMIT = 5;

export const useQuickLinks = () => {
    const [activeShortcuts, setActiveShortcuts] = useState<Shortcut[]>([
        {
            id: "approve",
            path: "/dashboard/transaction/approve",
            name: "Approve Loans",
            category: "Transaction",
            icon: IoCheckmarkCircle,
        },
        {
            id: "credits",
            path: "/dashboard/transaction/credits",
            name: "Pending Credits",
            category: "Transaction",
            icon: IoCash,
        },
        {
            id: "debits",
            path: "/dashboard/transaction/debits",
            name: "Pending Debits",
            category: "Transaction",
            icon: IoCash,
        },
        {
            id: "create-ach",
            path: "/dashboard/transaction/create-ach",
            name: "Create ACH File",
            category: "Transaction",
            icon: IoCloudDownload,
        },
        {
            id: "return-file",
            path: "/dashboard/transaction/return-file",
            name: "Return File Processing",
            category: "Transaction",
            icon: IoCloudUpload,
        },
    ]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [draggedShortcut, setDraggedShortcut] = useState<Shortcut | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleAddShortcut = (shortcut: Shortcut) => {
        if (activeShortcuts.length >= MAX_LIMIT) return;
        if (!activeShortcuts.find((s) => s.id === shortcut.id)) {
            setActiveShortcuts([...activeShortcuts, shortcut]);
        }
    };

    const handleRemoveShortcut = (id: string) => {
        setActiveShortcuts(activeShortcuts.filter((s) => s.id !== id));
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);

        if (active.data.current?.type === "available") {
            setDraggedShortcut(active.data.current.shortcut);
        } else {
            const shortcut = activeShortcuts.find((s) => s.id === active.id);
            if (shortcut) setDraggedShortcut(shortcut);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            setDraggedShortcut(null);
            return;
        }

        // Dropping from Available to Active
        if (active.data.current?.type === "available") {
            // Logic for adding a new item from Available Paths
            if (activeShortcuts.length >= MAX_LIMIT) {
                setActiveId(null);
                setDraggedShortcut(null);
                return;
            }
            const shortcut = active.data.current.shortcut as Shortcut;
            if (!activeShortcuts.find((s) => s.id === shortcut.id)) {
                setActiveShortcuts([...activeShortcuts, shortcut]);
            }
        } else if (active.id !== over.id) {
            // Reordering within Active
            const oldIndex = activeShortcuts.findIndex((s) => s.id === active.id);
            const newIndex = activeShortcuts.findIndex((s) => s.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                setActiveShortcuts(arrayMove(activeShortcuts, oldIndex, newIndex));
            }
        }

        setActiveId(null);
        setDraggedShortcut(null);
    };

    const handleSubmit = () => {
        // Persistence removed as per request
    };

    return {
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
    };
};

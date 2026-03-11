import { useState } from 'react';
import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { DragStartEvent } from '@dnd-kit/core';
import { useDragBetweenLists } from '@/features/achfile/hooks/useDragBetweenLists';
import type { BureauGroupFormData, BureauGroupRow } from '../config/bureauConfig';
import { bureauGroupData as initialGroupData } from '../config/bureauConfig';
import { validateBureauGroupTop, validateBureauGroupBottom } from '../utils/bureauGroupUtils';

export interface DropItem {
    id: string;
    name: string;
}

const initialFiles: DropItem[] = [
    { id: '1', name: 'DataX_MLA' },
    { id: '2', name: 'DataX_CRA' },
    { id: '3', name: 'DataX_IDCA' },
];

const initialMapped: DropItem[] = [
    { id: '4', name: 'DX_BAV_MVS' },
    { id: '5', name: 'UpStreamCustom' },
];

const initialGroupForm: BureauGroupFormData = {
    bureauGroupNameTop: "",
    isActiveTop: false,
    bureauGroupNameBottom: "",
    isActiveBottom: false,
};

export const useBureauGroupForm = () => {
    const [bureauGroupData, setBureauGroupData] = useState<BureauGroupRow[]>(initialGroupData);

    // Form Visibility
    const [showGroupForm, setShowGroupForm] = useState(false);
    const [groupFormMode, setGroupFormMode] = useState<"add" | "edit">("add");
    const [groupForm, setGroupForm] = useState<BureauGroupFormData>(initialGroupForm);
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [groupErrors, setGroupErrors] = useState<Record<string, string>>({});

    // Draggable Lists
    const [availableFiles, setAvailableFiles] = useState<DropItem[]>(initialFiles);
    const [mappedFiles, setMappedFiles] = useState<DropItem[]>(initialMapped);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveFileId(event.active.id as string);
    };

    const handleDragEnd = useDragBetweenLists(
        availableFiles,
        setAvailableFiles,
        mappedFiles,
        setMappedFiles,
        'available-files-droppable',
        'mapped-files-droppable',
        setActiveFileId
    );

    const handleAddGroup = () => {
        setGroupFormMode("add");
        setGroupForm(initialGroupForm);
        setGroupErrors({});
        setAvailableFiles(initialFiles);
        setMappedFiles(initialMapped);
        setShowGroupForm(true);
    };

    const handleEditGroup = (row: BureauGroupRow) => {
        setGroupFormMode("edit");
        setEditingGroupId(row.id);
        setGroupErrors({});
        setGroupForm({
            bureauGroupNameTop: row.bureauGroupName,
            isActiveTop: row.isActive,
            bureauGroupNameBottom: row.bureauGroupName,
            isActiveBottom: row.isActive,
        });
        // Dummy mapping restoration based on string could go here
        setShowGroupForm(true);
    };

    const handleGroupInputChange = (key: keyof BureauGroupFormData, value: any) => {
        setGroupForm(prev => ({ ...prev, [key]: value }));
        if (groupErrors[key]) {
            setGroupErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleSaveGroup = (source?: 'top' | 'bottom') => {
        if (source === 'top') {
            const errors = validateBureauGroupTop(groupForm);

            if (Object.keys(errors).length > 0) {
                setGroupErrors(errors);
                return;
            }

            if (groupFormMode === "add") {
                const newGroup: BureauGroupRow = {
                    id: Math.random().toString(),
                    bureauGroupName: groupForm.bureauGroupNameTop,
                    mappedFiles: "", // Initially no mapping
                    status: groupForm.isActiveTop ? "Yes" : "No",
                    isActive: groupForm.isActiveTop,
                };
                setBureauGroupData(prev => [...prev, newGroup]);
            } else if (editingGroupId) {
                setBureauGroupData(prev => prev.map(item =>
                    item.id === editingGroupId ? {
                        ...item,
                        bureauGroupName: groupForm.bureauGroupNameTop,
                        status: groupForm.isActiveTop ? "Yes" : "No",
                        isActive: groupForm.isActiveTop,
                    } : item
                ));
            }
            // Clear Card 1 fields after submission
            setGroupForm(prev => ({
                ...prev,
                bureauGroupNameTop: "",
                isActiveTop: false
            }));
            setGroupErrors({});
        } else {
            // Source is bottom (mapping)
            const errors = validateBureauGroupBottom(groupForm, mappedFiles.length);

            if (Object.keys(errors).length > 0) {
                setGroupErrors(errors);
                return;
            }

            const mappedNames = mappedFiles.map(f => f.name).join(", ");
            setBureauGroupData(prev => prev.map(item =>
                item.bureauGroupName === groupForm.bureauGroupNameBottom ? {
                    ...item,
                    mappedFiles: mappedNames,
                    status: groupForm.isActiveBottom ? "Yes" : "No",
                    isActive: groupForm.isActiveBottom,
                } : item
            ));
            setGroupErrors({});
        }
    };

    const handleCancelGroup = () => {
        setShowGroupForm(false);
        setGroupErrors({});
    };

    return {
        bureauGroupData,
        showGroupForm,
        groupFormMode,
        groupForm,
        groupErrors,
        handleAddGroup,
        handleEditGroup,
        handleSaveGroup,
        handleCancelGroup,
        handleGroupInputChange,
        availableFiles, setAvailableFiles,
        mappedFiles, setMappedFiles,
        activeFileId,
        sensors,
        handleDragStart,
        handleDragEnd,
        closestCenter
    };
};

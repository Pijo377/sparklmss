import { useState } from 'react';
import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    closestCenter,
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import type { DragStartEvent } from '@dnd-kit/core';
import { useDragBetweenLists } from './useDragBetweenLists';

export const useDragAndDrop = (
    initialProducts: any[],
    initialFields: any[],
    initialAddendaFields: any[]
) => {
    const [availableProducts, setAvailableProducts] = useState(initialProducts);
    const [mappedProducts, setMappedProducts] = useState<any[]>([]);

    const [availableFields, setAvailableFields] = useState(initialFields);
    const [sequenceFields, setSequenceFields] = useState<any[]>([]);

    const [availableAddendaFields, setAvailableAddendaFields] = useState(initialAddendaFields);
    const [sequenceAddendaFields, setSequenceAddendaFields] = useState<any[]>([]);

    const [activeProductId, setActiveProductId] = useState<string | null>(null);
    const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
    const [activeAddendaFieldId, setActiveAddendaFieldId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStartProduct = (event: DragStartEvent) => {
        setActiveProductId(event.active.id as string);
    };

    const handleDragEndProduct = useDragBetweenLists(
        availableProducts,
        setAvailableProducts,
        mappedProducts,
        setMappedProducts,
        'available-products-droppable',
        'mapped-products-droppable',
        setActiveProductId
    );

    const handleDragStartField = (event: DragStartEvent) => {
        setActiveFieldId(event.active.id as string);
    };

    const handleDragEndField = useDragBetweenLists(
        availableFields,
        setAvailableFields,
        sequenceFields,
        setSequenceFields,
        'available-fields-droppable',
        'sequence-fields-droppable',
        setActiveFieldId
    );

    const handleDragStartAddendaField = (event: DragStartEvent) => {
        setActiveAddendaFieldId(event.active.id as string);
    };

    const handleDragEndAddendaField = useDragBetweenLists(
        availableAddendaFields,
        setAvailableAddendaFields,
        sequenceAddendaFields,
        setSequenceAddendaFields,
        'available-addenda-fields-droppable',
        'sequence-addenda-fields-droppable',
        setActiveAddendaFieldId
    );

    const resetDragAndDrop = () => {
        setAvailableProducts(initialProducts);
        setMappedProducts([]);
        setAvailableFields(initialFields);
        setSequenceFields([]);
        setAvailableAddendaFields(initialAddendaFields);
        setSequenceAddendaFields([]);
    };

    return {
        availableProducts, setAvailableProducts,
        mappedProducts, setMappedProducts,
        availableFields, setAvailableFields,
        sequenceFields, setSequenceFields,
        availableAddendaFields, setAvailableAddendaFields,
        sequenceAddendaFields, setSequenceAddendaFields,
        activeProductId, activeFieldId, activeAddendaFieldId,
        sensors,
        handleDragStartProduct, handleDragEndProduct,
        handleDragStartField, handleDragEndField,
        handleDragStartAddendaField, handleDragEndAddendaField,
        closestCenter,
        resetDragAndDrop,
    };
};


import React from 'react';
import { GitBranch, Box, ListFilter } from 'lucide-react';
import {
    DndContext,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Card from '@/features/achfile/ui/card';
import { Input } from "@/features/achfile/ui/input";
import { SortableItem, DragPreview, DroppableContainer } from '@/features/achfile/ui/DragAndDrop';

interface UnifiedMappingCardProps {
    selectedFileType: string;
    sensors: any;
    closestCenter: any;
    availableProducts: any[];
    mappedProducts: any[];
    activeProductId: string | null;
    handleDragStartProduct: (event: any) => void;
    handleDragEndProduct: (event: any) => void;
    availableFields: any[];
    sequenceFields: any[];
    activeFieldId: string | null;
    handleDragStartField: (event: any) => void;
    handleDragEndField: (event: any) => void;
    isAddendaRecordIndicatorChecked: boolean;
    separator: string;
    setSeparator: (val: string) => void;
    availableAddendaFields: any[];
    sequenceAddendaFields: any[];
    activeAddendaFieldId: string | null;
    handleDragStartAddendaField: (event: any) => void;
    handleDragEndAddendaField: (event: any) => void;
    ErrorMsg: React.FC<{ field: string, value?: string }>;
}

const UnifiedMappingCard: React.FC<UnifiedMappingCardProps> = ({
    selectedFileType,
    sensors,
    closestCenter,
    availableProducts,
    mappedProducts,
    activeProductId,
    handleDragStartProduct,
    handleDragEndProduct,
    availableFields,
    sequenceFields,
    activeFieldId,
    handleDragStartField,
    handleDragEndField,
    isAddendaRecordIndicatorChecked,
    separator,
    setSeparator,
    availableAddendaFields,
    sequenceAddendaFields,
    activeAddendaFieldId,
    handleDragStartAddendaField,
    handleDragEndAddendaField,
    ErrorMsg
}) => {
    return (
        <Card className="p-4 h-full border-emerald-200 border-2 shadow-sm">
            <div className="flex items-center gap-3 mb-3 border-b border-emerald-50 pb-2">
                <GitBranch size={16} className="text-emerald-600" />
                <h3 className="text-sm font-semibold text-emerald-600 ">Unified Mapping</h3>
            </div>
            <div className="space-y-5">
                {/* Product Mapping */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStartProduct}
                    onDragEnd={handleDragEndProduct}
                >
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Box size={14} className="text-indigo-400" />
                            <h4 className="text-[12px] font-semibold text-indigo-400 uppercase tracking-widest">Product Mapping(Drag and Drop)</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-400 mb-2">Product(Drag and Drop)</span>
                                <DroppableContainer id="available-products-droppable" emptyLabel="No available products">
                                    <SortableContext items={availableProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                        {availableProducts.map((p) => (
                                            <SortableItem key={p.id} id={p.id} name={p.name} />
                                        ))}
                                    </SortableContext>
                                </DroppableContainer>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-400 mb-2">Mapped</span>
                                <DroppableContainer id="mapped-products-droppable" emptyLabel="Drop products here">
                                    <SortableContext items={mappedProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                        {mappedProducts.map((p) => (
                                            <SortableItem key={p.id} id={p.id} name={p.name} />
                                        ))}
                                    </SortableContext>
                                </DroppableContainer>
                            </div>
                        </div>
                    </div>
                    <DragOverlay adjustScale={false}>
                        {activeProductId ? (
                            <DragPreview
                                name={[...availableProducts, ...mappedProducts].find(p => p.id === activeProductId)?.name || ''}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {selectedFileType === 'CSV File' && (
                    <>
                        <div className="border-t border-slate-100"></div>

                        {/* CSV Fields Mapping */}
                        <div>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStartField}
                                onDragEnd={handleDragEndField}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <ListFilter size={14} className="text-emerald-400" />
                                        <h4 className="text-[12px] font-semibold text-emerald-400 uppercase tracking-widest">CSV Fields (Drag and Drop)</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-400 mb-2">CSV Fields (Drag and Drop)</span>
                                            <DroppableContainer id="available-fields-droppable" emptyLabel="No fields left">
                                                <SortableContext items={availableFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                                    {availableFields.map((f) => (
                                                        <SortableItem key={f.id} id={f.id} name={f.name} />
                                                    ))}
                                                </SortableContext>
                                            </DroppableContainer>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-400 mb-2">Mapped CSV Fields</span>
                                            <DroppableContainer id="sequence-fields-droppable" emptyLabel="Drag fields here to define order">
                                                <SortableContext items={sequenceFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                                    {sequenceFields.map((f) => (
                                                        <SortableItem key={f.id} id={f.id} name={f.name} />
                                                    ))}
                                                </SortableContext>
                                            </DroppableContainer>
                                        </div>
                                    </div>
                                </div>
                                <DragOverlay adjustScale={false}>
                                    {activeFieldId ? (
                                        <DragPreview
                                            name={[...availableFields, ...sequenceFields].find(f => f.id === activeFieldId)?.name || ''}
                                        />
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </div>
                    </>
                )}

                {(selectedFileType === 'NACHA File' || selectedFileType === 'PDS File') && (
                    <>
                        <div className="border-t border-slate-100 mt-4 mb-4"></div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Separator</label>
                            <Input
                                className={`h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${!isAddendaRecordIndicatorChecked ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
                                type="text"
                                disabled={!isAddendaRecordIndicatorChecked}
                                value={separator}
                                onChange={(e) => setSeparator(e.target.value)}
                                maxLength={1}
                            />
                            <ErrorMsg field="separator" value={separator} />
                        </div>

                        {/* Addenda Fields Mapping */}
                        <div className={`transition-all duration-200 ${!isAddendaRecordIndicatorChecked ? 'opacity-50 pointer-events-none' : ''}`}>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStartAddendaField}
                                onDragEnd={handleDragEndAddendaField}
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <ListFilter size={14} className="text-emerald-400" />
                                        <h4 className="text-[10px] font-semibold text-slate-900 uppercase tracking-widest">Addenda Fields (Drag and Drop)</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-400 mb-2">Addenda Fields (Drag and Drop)</span>
                                            <DroppableContainer id="available-addenda-fields-droppable" emptyLabel="No fields left">
                                                <SortableContext items={availableAddendaFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                                    {availableAddendaFields.map((f) => (
                                                        <SortableItem key={f.id} id={f.id} name={f.name} />
                                                    ))}
                                                </SortableContext>
                                            </DroppableContainer>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-400 mb-2">Mapped Addenda Fields</span>
                                            <DroppableContainer id="sequence-addenda-fields-droppable" emptyLabel="Drag fields here to define order">
                                                <SortableContext items={sequenceAddendaFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                                                    {sequenceAddendaFields.map((f) => (
                                                        <SortableItem key={f.id} id={f.id} name={f.name} />
                                                    ))}
                                                </SortableContext>
                                            </DroppableContainer>
                                        </div>
                                    </div>
                                </div>
                                <DragOverlay adjustScale={false}>
                                    {activeAddendaFieldId ? (
                                        <DragPreview
                                            name={[...availableAddendaFields, ...sequenceAddendaFields].find(f => f.id === activeAddendaFieldId)?.name || ''}
                                        />
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
};

export default UnifiedMappingCard;

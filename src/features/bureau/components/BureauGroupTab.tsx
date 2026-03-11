import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DroppableContainer, SortableItem, DragPreview } from '@/features/bureau/ui/DragAndDrop';
import Card from "@/features/bureau/ui/card";
import { Input } from "@/features/bureau/ui/input";
import { Label } from "@/features/bureau/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/bureau/ui/select";
import { Check, FileText, LayoutGrid, Save, Settings, X } from "lucide-react";
import { createPortal } from 'react-dom';

import { type BureauGroupRow } from '../config/bureauConfig';

interface BureauGroupTabProps {
    groupForm: any;
    groupErrors: Record<string, string>;
    handleGroupInputChange: (field: any, value: any) => void;
    handleSaveGroup: (source?: 'top' | 'bottom') => void;
    handleCancelGroup: () => void;
    availableFiles: any[];
    mappedFiles: any[];
    activeFileId: string | null;
    sensors: any;
    handleDragStart: (event: any) => void;
    handleDragEnd: (event: any) => void;
    closestCenter: typeof closestCenter;
    bureauGroupData: BureauGroupRow[];
}


export const BureauGroupTab = ({
    groupForm,
    groupErrors,
    handleGroupInputChange,
    handleSaveGroup,
    handleCancelGroup,
    availableFiles,
    mappedFiles,
    activeFileId,
    sensors,
    handleDragStart,
    handleDragEnd,
    closestCenter: collisionDetection,
    bureauGroupData
}: BureauGroupTabProps) => {
    // Filter active groups for the mapping selection
    const activeGroups = bureauGroupData.filter(group => group.isActive);
    return (
        <div className="flex flex-col gap-4">
            <Card className="p-5 border-blue-200 border-2 shadow-sm rounded-2xl bg-white flex flex-col gap-4">
                <div className="flex items-center gap-3 border-b border-blue-100 pb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-blue-600">
                        Group Details
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
                    <div className="space-y-1.5">
                        <Label className="text-sm font-medium text-slate-900">Bureau Group Name</Label>
                        <Input
                            value={groupForm.bureauGroupNameTop}
                            onChange={(e) => handleGroupInputChange("bureauGroupNameTop", e.target.value)}
                            placeholder="Enter group name"
                            className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full"
                        />
                        {groupErrors.bureauGroupNameTop && <span className="text-red-500 text-[10px] mt-1 block">{groupErrors.bureauGroupNameTop}</span>}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                        <Label className="text-sm font-medium text-slate-900 invisible">Status</Label>
                        <div
                            onClick={() => handleGroupInputChange("isActiveTop", !groupForm.isActiveTop)}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11 select-none"
                        >
                            <div className={`
                                w-5 h-5 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                ${groupForm.isActiveTop
                                    ? 'bg-[#84cc16] border-[#84cc16] shadow-sm'
                                    : 'bg-white border-slate-300'}
                            `}>
                                {groupForm.isActiveTop && <Check size={14} className="text-white stroke-[3.5]" />}
                            </div>
                            <span className="text-sm font-medium text-slate-900 truncate tracking-tight">Is this Configuration active?</span>
                        </div>
                    </div>
                    <div className="space-y-1.5 flex flex-col items-end">
                        <Label className="text-sm font-medium text-slate-900 invisible">Submit</Label>
                        <button
                            className="w-40 h-11 px-6 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
                            onClick={() => handleSaveGroup('top')}
                        >
                            <Save size={16} /> Submit
                        </button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 border-amber-200 border-2 shadow-sm rounded-2xl bg-white flex flex-col">
                    <div className="flex items-center gap-3 mb-4 border-b border-amber-100 pb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Settings size={16} className="text-amber-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-amber-600">
                            Configuration Options
                        </h3>
                    </div>
                    <div className="space-y-1.5 pt-2">
                        <Label className="text-sm font-medium text-slate-900">Bureau Group Name</Label>
                        <Select
                            value={groupForm.bureauGroupNameBottom}
                            onValueChange={(val) => handleGroupInputChange("bureauGroupNameBottom", val)}
                        >
                            <SelectTrigger className="h-11 px-4 text-sm bg-white border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                                <SelectValue placeholder="--Select--" />
                            </SelectTrigger>
                            <SelectContent>
                                {activeGroups.map(group => (
                                    <SelectItem key={group.id} value={group.bureauGroupName}>
                                        {group.bureauGroupName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {groupErrors.bureauGroupNameBottom && <span className="text-red-500 text-[10px] mt-1 block">{groupErrors.bureauGroupNameBottom}</span>}
                    </div>
                    <div className="space-y-1.5 mt-6 flex flex-col">
                        <div
                            onClick={() => handleGroupInputChange("isActiveBottom", !groupForm.isActiveBottom)}
                            className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors h-11 select-none"
                        >
                            <div className={`
                                    w-5 h-5 rounded-[4px] border transition-all flex items-center justify-center shrink-0
                                    ${groupForm.isActiveBottom
                                    ? 'bg-[#84cc16] border-[#84cc16] shadow-sm'
                                    : 'bg-white border-slate-300'}
                                `}>
                                {groupForm.isActiveBottom && <Check size={14} className="text-white stroke-[3.5]" />}
                            </div>
                            <span className="text-sm font-medium text-slate-900 truncate tracking-tight">Is this Configuration active?</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 border-purple-200 border-2 shadow-sm rounded-2xl bg-white">
                    <div className="flex items-center gap-3 mb-4 border-b border-purple-100 pb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <LayoutGrid size={16} className="text-purple-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-purple-600">
                            Control File Mapping (drag and drop)
                        </h3>
                    </div>
                    <div className="space-y-2 h-full min-h-[150px]">
                        {groupErrors.mapping && <span className="text-red-500 text-[10px] mb-2 block">{groupErrors.mapping}</span>}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={collisionDetection}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900 mb-2">Select Control File</span>
                                    <DroppableContainer
                                        id="available-files-droppable"
                                        emptyLabel={groupForm.bureauGroupNameBottom ? "No available files" : ""}
                                    >
                                        <SortableContext
                                            items={groupForm.bureauGroupNameBottom ? availableFiles.map(f => f.id) : []}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {groupForm.bureauGroupNameBottom && availableFiles.map((f) => (
                                                <SortableItem key={f.id} id={f.id} name={f.name} />
                                            ))}
                                        </SortableContext>
                                    </DroppableContainer>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-900 mb-2">Mapped Control File</span>
                                    <DroppableContainer
                                        id="mapped-files-droppable"
                                        emptyLabel={groupForm.bureauGroupNameBottom ? "Drop files here" : ""}
                                    >
                                        <SortableContext
                                            items={groupForm.bureauGroupNameBottom ? mappedFiles.map(f => f.id) : []}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {groupForm.bureauGroupNameBottom && mappedFiles.map((f) => (
                                                <SortableItem key={f.id} id={f.id} name={f.name} />
                                            ))}
                                        </SortableContext>
                                    </DroppableContainer>
                                </div>
                            </div>
                            {createPortal(
                                <DragOverlay adjustScale={false} dropAnimation={null}>
                                    {activeFileId ? (
                                        <DragPreview
                                            name={[...availableFiles, ...mappedFiles].find(f => f.id === activeFileId)?.name || ''}
                                        />
                                    ) : null}
                                </DragOverlay>,
                                document.body
                            )}
                        </DndContext>
                    </div>
                </Card>
            </div>

            <div className="flex justify-center gap-4 mt-2">
                <button
                    onClick={() => handleSaveGroup('bottom')}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                >
                    <Save size={18} />
                    Submit
                </button>
                <button
                    onClick={handleCancelGroup}
                    className="px-8 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                >
                    <X size={18} />
                    Cancel
                </button>
            </div>
        </div >
    );
};

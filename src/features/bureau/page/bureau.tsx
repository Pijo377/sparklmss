import { useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/features/bureau/ui/tabs";
import { Server, FileText, Settings, Users, ShieldCheck } from "lucide-react";
import { closestCenter } from '@dnd-kit/core';

import { useBureau } from "../hooks/useBureau";
import { useBureauGroupForm } from "../hooks/useBureauGroupForm";
import { useBureauVerificationForm } from "../hooks/useBureauVerificationForm";

import { BureauTab } from "../components/BureauTab";
import { BureauFieldsTab } from "../components/BureauFieldsTab";
import { BureauControlTab } from "../components/BureauControlTab";
import { BureauGroupTab } from "../components/BureauGroupTab";
import { BureauVerificationTab } from "../components/BureauVerificationTab";

const BureauPage = () => {
    const {
        bureauData,
        bureauFieldData,
        bureauControlData,
        toggleBureauStatus,
        showFieldForm,
        fieldFormMode,
        fieldForm,
        fieldErrors,
        handleAddField,
        handleEditField,
        handleSaveField,
        handleCancelField,
        handleFieldInputChange,
        showControlForm,
        controlFormMode,
        controlForm,
        controlErrors,
        handleAddControl,
        handleSaveControl,
        handleCancelControl,
        handleControlInputChange,
        handleDisplayControl,
        handleResetControl,
    } = useBureau();

    const {
        bureauGroupData,
        groupForm,
        groupErrors,
        handleSaveGroup,
        handleCancelGroup,
        handleGroupInputChange,
        availableFiles,
        mappedFiles,
        activeFileId,
        sensors,
        handleDragStart,
        handleDragEnd,
    } = useBureauGroupForm();

    const {
        verificationData,
        verificationFormMode,
        verificationForm,
        verificationErrors,
        handleSaveVerification,
        handleCancelVerification,
        handleVerificationInputChange,
        handleDeleteVerification,
    } = useBureauVerificationForm();

    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (verificationForm.bureauGroupName && tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [verificationForm.bureauGroupName]);

    return (
        <div className="flex flex-col gap-4 p-4 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900">Bureau</h1>
            </div>

            <Tabs defaultValue="bureau" className="w-full">
                <TabsList className="bg-muted p-1 rounded-lg inline-flex flex-wrap justify-start gap-1 h-auto w-auto">
                    <TabsTrigger
                        value="bureau"
                        className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <Server size={16} />
                        Bureau
                    </TabsTrigger>
                    <TabsTrigger
                        value="bureau-fields"
                        className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <FileText size={16} />
                        Bureau Fields
                    </TabsTrigger>
                    <TabsTrigger
                        value="bureau-control"
                        className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <Settings size={16} />
                        Bureau Control
                    </TabsTrigger>
                    <TabsTrigger
                        value="bureau-group"
                        className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <Users size={16} />
                        Bureau Group
                    </TabsTrigger>
                    <TabsTrigger
                        value="bureau-verification"
                        className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                        <ShieldCheck size={16} />
                        Bureau Verification
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="bureau" className="mt-4">
                    <BureauTab
                        bureauData={bureauData}
                        toggleBureauStatus={toggleBureauStatus}
                    />
                </TabsContent>

                <TabsContent value="bureau-fields" className="mt-4 space-y-4">
                    <BureauFieldsTab
                        showFieldForm={showFieldForm}
                        fieldFormMode={fieldFormMode}
                        fieldForm={fieldForm}
                        fieldErrors={fieldErrors}
                        handleFieldInputChange={handleFieldInputChange}
                        handleSaveField={handleSaveField}
                        handleCancelField={handleCancelField}
                        handleAddField={handleAddField}
                        handleEditField={handleEditField}
                        bureauFieldData={bureauFieldData}
                    />
                </TabsContent>

                <TabsContent value="bureau-control" className="mt-4 space-y-4">
                    <BureauControlTab
                        showControlForm={showControlForm}
                        controlFormMode={controlFormMode}
                        controlForm={controlForm}
                        controlErrors={controlErrors}
                        handleControlInputChange={handleControlInputChange}
                        handleSaveControl={handleSaveControl}
                        handleCancelControl={handleCancelControl}
                        handleAddControl={handleAddControl}
                        handleDisplayControl={handleDisplayControl}
                        handleResetControl={handleResetControl}
                        bureauControlData={bureauControlData}
                        bureauFieldData={bureauFieldData}
                    />
                </TabsContent>

                <TabsContent value="bureau-group" className="mt-4 space-y-4">
                    <BureauGroupTab
                        groupForm={groupForm}
                        groupErrors={groupErrors}
                        handleGroupInputChange={handleGroupInputChange}
                        handleSaveGroup={handleSaveGroup}
                        handleCancelGroup={handleCancelGroup}
                        availableFiles={availableFiles}
                        mappedFiles={mappedFiles}
                        activeFileId={activeFileId}
                        sensors={sensors}
                        handleDragStart={handleDragStart}
                        handleDragEnd={handleDragEnd}
                        closestCenter={closestCenter}
                        bureauGroupData={bureauGroupData}
                    />
                </TabsContent>

                <TabsContent value="bureau-verification" className="mt-4 space-y-4">
                    <BureauVerificationTab
                        verificationForm={verificationForm}
                        verificationErrors={verificationErrors}
                        handleVerificationInputChange={handleVerificationInputChange}
                        handleSaveVerification={handleSaveVerification}
                        handleCancelVerification={handleCancelVerification}
                        verificationFormMode={verificationFormMode}
                        verificationData={verificationData}
                        handleDeleteVerification={handleDeleteVerification}
                        tableRef={tableRef}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BureauPage;

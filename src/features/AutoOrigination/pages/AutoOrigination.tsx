import { LayoutGrid, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";

import { useAutoOriginateGroup } from "../hooks/useAutoOriginateGroup";
import { useAutoOriginateRule } from "../hooks/useAutoOriginateRule";
import { GroupTab } from "../components/GroupTab";
import { RuleTab } from "../components/RuleTab";

const AutoOrigination = () => {
    const {
        groupData,
        isGroupActive,
        setIsGroupActive,
        groupEditSheet,
        setGroupEditSheet,
        handleEditGroup,
        handleAddGroup,
        handleSaveGroup,
    } = useAutoOriginateGroup();

    const {
        filteredRuleData,
        selectedRuleGroupId,
        ruleEditMode,
        ruleForm,
        ruleErrors,
        isRuleSubmitted,
        operatorOptions,
        bureauControlOptions,
        tableRef,
        ruleFormRef,
        handleRuleInputChange,
        handleSaveRule,
        handleEditRule,
        handleDeleteRule,
        resetRuleForm,
    } = useAutoOriginateRule();

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Auto Origination</h1>
            </div>

            <Tabs defaultValue="group" className="w-full">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <TabsList className="bg-muted p-1 rounded-lg inline-flex flex-wrap justify-start gap-1 h-auto w-auto">
                        <TabsTrigger
                            value="group"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <LayoutGrid size={16} />
                            Auto Originate Group
                        </TabsTrigger>
                        <TabsTrigger
                            value="rule"
                            className="flex items-center gap-2 px-3 py-2.5 text-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <FileText size={16} />
                            Auto Originate Rule
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="group" className="mt-0 outline-none">
                    <GroupTab
                        groupData={groupData}
                        isGroupActive={isGroupActive}
                        setIsGroupActive={setIsGroupActive}
                        groupEditSheet={groupEditSheet}
                        setGroupEditSheet={setGroupEditSheet}
                        handleEditGroup={handleEditGroup}
                        handleAddGroup={handleAddGroup}
                        handleSaveGroup={handleSaveGroup}
                    />
                </TabsContent>

                <TabsContent value="rule" className="mt-0 outline-none space-y-4">
                    <RuleTab
                        filteredRuleData={filteredRuleData}
                        selectedRuleGroupId={selectedRuleGroupId}
                        ruleEditMode={ruleEditMode}
                        ruleForm={ruleForm}
                        ruleErrors={ruleErrors}
                        isRuleSubmitted={isRuleSubmitted}
                        operatorOptions={operatorOptions}
                        bureauControlOptions={bureauControlOptions}
                        tableRef={tableRef}
                        ruleFormRef={ruleFormRef}
                        handleRuleInputChange={handleRuleInputChange}
                        handleSaveRule={handleSaveRule}
                        handleEditRule={handleEditRule}
                        handleDeleteRule={handleDeleteRule}
                        resetRuleForm={resetRuleForm}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AutoOrigination;

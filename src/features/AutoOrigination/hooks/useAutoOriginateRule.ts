import { useState, useCallback, useRef, useEffect } from "react";
import {
    ruleInitialData,
    ruleEditFields,
    groupInitialData,
    type AutoOriginateRule
} from "../config/autooriginationconfig";

export const useAutoOriginateRule = () => {
    const [ruleData, setRuleData] = useState<AutoOriginateRule[]>(ruleInitialData);
    const [selectedRuleGroupId, setSelectedRuleGroupId] = useState<string | null>(null);
    const [ruleEditMode, setRuleEditMode] = useState<"add" | "edit">("add");
    const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
    const [ruleForm, setRuleForm] = useState<Partial<AutoOriginateRule>>({
        groupName: "",
        bureauGroup: "",
        bureauControl: "",
        bureau: "",
        parameterField: "",
        operatorType: "",
        operator1: "",
        check: "",
        condition: "",
        isActive: true,
    });

    const [ruleErrors, setRuleErrors] = useState<Record<string, string>>({});
    const [isRuleSubmitted, setIsRuleSubmitted] = useState(false);
    const [operatorOptions, setOperatorOptions] = useState<{ value: string, label: string }[]>([]);
    const [bureauControlOptions, setBureauControlOptions] = useState(ruleEditFields.find(f => f.key === "bureauControl")?.options || []);

    const tableRef = useRef<HTMLDivElement>(null);
    const ruleFormRef = useRef<HTMLDivElement>(null);

    // Scroll to table when group is selected
    useEffect(() => {
        if (selectedRuleGroupId && tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [selectedRuleGroupId]);

    const handleRuleInputChange = (key: string, value: any) => {
        const updatedForm = { ...ruleForm, [key]: value };

        if (key === "groupName") {
            setSelectedRuleGroupId(value || null);
            const groupInfo = groupInitialData.find(g => g.groupName === value);
            if (groupInfo) {
                updatedForm.bureauGroup = groupInfo.bureauGroup;
                const baseOptions = ruleEditFields.find(f => f.key === "bureauControl")?.options || [];
                if (value === "AODataXLowGroup") {
                    setBureauControlOptions([{ value: "DataX_Low_Control", label: "DataX_Low_Control" }]);
                } else if (value === "AOtestGrpup") {
                    setBureauControlOptions([{ value: "Test_Control_1", label: "Test_Control_1" }, { value: "Test_Control_2", label: "Test_Control_2" }]);
                } else {
                    setBureauControlOptions(baseOptions);
                }
            } else {
                updatedForm.bureauGroup = "";
                setBureauControlOptions(ruleEditFields.find(f => f.key === "bureauControl")?.options || []);
            }
        }

        if (key === "bureauControl") {
            if (value.toLowerCase().includes("datax") || value.toLowerCase().includes("low_control")) {
                updatedForm.bureau = "DataX";
            } else if (value.toLowerCase().includes("test")) {
                updatedForm.bureau = "TestBureau";
            }
        }

        if (key === "operatorType") {
            let newOptions: { value: string, label: string }[] = [];
            if (value === "Alphabets" || value === "Alpha-Numeric") {
                newOptions = [
                    { value: "EQ", label: "=" },
                    { value: "NE", label: "!=" },
                    { value: "Contains", label: "CT" }
                ];
            } else if (value === "Numeric") {
                newOptions = [
                    { value: "GT", label: ">" },
                    { value: "GE", label: ">=" },
                    { value: "LT", label: "<" },
                    { value: "LE", label: "<=" },
                    { value: "EQ", label: "=" },
                    { value: "NE", label: "!=" }
                ];
            }
            setOperatorOptions(newOptions);
            updatedForm.operator1 = "";
        }

        setRuleForm(updatedForm);

        if (ruleErrors[key]) {
            setRuleErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[key];
                return newErrs;
            });
        }
    };

    const validateRuleForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!ruleForm.groupName) errors.groupName = "Please select the Auto Originate Group Name.";
        if (!ruleForm.bureauControl) errors.bureauControl = "Please select the Bureau Control Name.";
        if (!ruleForm.parameterField) errors.parameterField = "Please enter Parameter Field.";
        if (!ruleForm.operatorType) errors.operatorType = "Please select the Operator Type.";
        if (!ruleForm.operator1) errors.operator1 = "Please select the Operator.";
        if (!ruleForm.check) errors.check = "Please enter Decision Value.";
        if (ruleForm.condition === undefined || ruleForm.condition === "") errors.condition = "Please select the Condition.";

        setRuleErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const resetRuleForm = () => {
        setRuleForm({
            groupName: "",
            bureauGroup: "",
            bureauControl: "",
            bureau: "",
            parameterField: "",
            operatorType: "",
            operator1: "",
            check: "",
            condition: "",
            isActive: true,
        });
        setRuleEditMode("add");
        setEditingRuleId(null);
        setRuleErrors({});
        setIsRuleSubmitted(false);
        setOperatorOptions([]);
    };

    const handleSaveRule = () => {
        setIsRuleSubmitted(true);
        if (!validateRuleForm()) return;

        if (ruleEditMode === "edit" && editingRuleId) {
            setRuleData(prev => prev.map(r => r.id === editingRuleId ? { ...r, ...ruleForm } as AutoOriginateRule : r));
            setRuleEditMode("add");
            setEditingRuleId(null);
        } else {
            const newRule: AutoOriginateRule = {
                ...(ruleForm as AutoOriginateRule),
                id: crypto.randomUUID(),
                status: ruleForm.isActive ? "Active" : "Inactive",
                isActive: ruleForm.isActive ?? true,
            };
            setRuleData(prev => [...prev, newRule]);
        }
        resetRuleForm();
    };

    const handleEditRule = useCallback((rule: AutoOriginateRule) => {
        // Sync operator options when editing
        let newOptions: { value: string, label: string }[] = [];
        if (rule.operatorType === "Alphabets" || rule.operatorType === "Alpha-Numeric") {
            newOptions = [
                { value: "EQ", label: "=" },
                { value: "NE", label: "!=" },
                { value: "Contains", label: "CT" }
            ];
        } else if (rule.operatorType === "Numeric") {
            newOptions = [
                { value: "GT", label: ">" },
                { value: "GE", label: ">=" },
                { value: "LT", label: "<" },
                { value: "LE", label: "<=" },
                { value: "EQ", label: "=" },
                { value: "NE", label: "!=" }
            ];
        }
        setOperatorOptions(newOptions);

        setRuleForm(rule);
        setRuleEditMode("edit");
        setEditingRuleId(rule.id);
        ruleFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    const handleDeleteRule = useCallback((rule: AutoOriginateRule) => {
        setRuleData(prev => prev.filter(r => r.id !== rule.id));
    }, []);

    const filteredRuleData = ruleData.filter(r => r.groupName === selectedRuleGroupId);

    return {
        ruleData,
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
    };
};

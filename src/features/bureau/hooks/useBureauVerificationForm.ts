import { useState } from "react";
import { bureauVerificationData as initialData } from "../config/bureauConfig";
import type { BureauVerificationRow, BureauVerificationFormData } from "../config/bureauConfig";
import { validateBureauVerification } from "../utils/bureauVerificationUtils";

const initialFormState: BureauVerificationFormData = {
    bureauGroupName: "",
    controlFile: "",
    bureauName: "",
    parameterTag: "",
    decisionDataType: "",
    decisionOperator: "",
    decisionValue: "",
    condition: "",
    isActive: false,
};

export const useBureauVerificationForm = () => {
    const [verificationData, setVerificationData] = useState<BureauVerificationRow[]>(initialData);
    const [showVerificationForm, setShowVerificationForm] = useState(false);
    const [verificationFormMode, setVerificationFormMode] = useState<"add" | "edit">("add");
    const [verificationForm, setVerificationForm] = useState<BureauVerificationFormData>(initialFormState);
    const [editingVerificationId, setEditingVerificationId] = useState<string | null>(null);
    const [verificationErrors, setVerificationErrors] = useState<Record<string, string>>({});

    const handleAddVerification = () => {
        setVerificationFormMode("add");
        setVerificationForm(initialFormState);
        setVerificationErrors({});
        setShowVerificationForm(true);
    };

    const handleEditVerification = (row: BureauVerificationRow) => {
        setVerificationFormMode("edit");
        setEditingVerificationId(row.id);
        setVerificationErrors({});
        setVerificationForm({
            bureauGroupName: row.bureauGroupName,
            controlFile: row.bureauControlName, // Mapping Control Name to Control File
            bureauName: row.bureauName,
            parameterTag: row.parameter,
            decisionDataType: row.operatorType,
            decisionOperator: row.operator,
            decisionValue: row.value,
            condition: row.condition,
            isActive: row.status === "Yes",
        });
        setShowVerificationForm(true);
    };

    const handleVerificationInputChange = (key: keyof BureauVerificationFormData, value: any) => {
        setVerificationForm((prev) => {
            const newState = { ...prev, [key]: value };

            // Clear error for this field
            if (verificationErrors[key]) {
                setVerificationErrors(prevErrors => {
                    const newErrors = { ...prevErrors };
                    delete newErrors[key];
                    return newErrors;
                });
            }

            // If Bureau Group Name changes, clear dependent fields
            if (key === "bureauGroupName") {
                newState.controlFile = "";
                newState.bureauName = "";
                newState.parameterTag = "";
            }

            // If Control File changes, auto-fill Bureau Name
            if (key === "controlFile") {
                if (value === "DX_BAV_MVS" || value === "UpStreamCustom") {
                    newState.bureauName = "DataX";
                } else if (value === "MicroBilt_Control") {
                    newState.bureauName = "MicroBilt";
                } else {
                    newState.bureauName = "";
                }
                // Clear parameter tag when control file changes
                newState.parameterTag = "";
            }

            // If Decision Data Type changes, clear Decision Operator
            if (key === "decisionDataType") {
                newState.decisionOperator = "";
            }

            return newState;
        });
    };

    const handleDeleteVerification = (id: string) => {
        setVerificationData((prev) => prev.filter((item) => item.id !== id));
    };

    const handleSaveVerification = () => {
        const errors = validateBureauVerification(verificationForm);

        if (Object.keys(errors).length > 0) {
            setVerificationErrors(errors);
            return;
        }

        if (verificationFormMode === "add") {
            const newVerification: BureauVerificationRow = {
                id: (Math.max(0, ...verificationData.map(d => parseInt(d.id))) + 1).toString(),
                bureauGroupName: verificationForm.bureauGroupName,
                bureauControlName: verificationForm.controlFile,
                bureauName: verificationForm.bureauName,
                parameter: verificationForm.parameterTag,
                operatorType: verificationForm.decisionDataType,
                operator: verificationForm.decisionOperator,
                value: verificationForm.decisionValue,
                condition: verificationForm.condition,
                status: verificationForm.isActive ? "Yes" : "No",
            };
            setVerificationData((prev) => [...prev, newVerification]);
        } else if (editingVerificationId) {
            setVerificationData((prev) =>
                prev.map((item) =>
                    item.id === editingVerificationId
                        ? {
                            ...item,
                            bureauGroupName: verificationForm.bureauGroupName,
                            bureauControlName: verificationForm.controlFile,
                            bureauName: verificationForm.bureauName,
                            parameter: verificationForm.parameterTag,
                            operatorType: verificationForm.decisionDataType,
                            operator: verificationForm.decisionOperator,
                            value: verificationForm.decisionValue,
                            condition: verificationForm.condition,
                            status: verificationForm.isActive ? "Yes" : "No",
                        }
                        : item
                )
            );
        }
        setShowVerificationForm(false);
        setVerificationForm(initialFormState);
        setVerificationErrors({});
    };

    const handleCancelVerification = () => {
        setShowVerificationForm(false);
        setVerificationForm(initialFormState);
        setVerificationErrors({});
    };

    return {
        verificationData,
        showVerificationForm,
        verificationFormMode,
        verificationForm,
        verificationErrors,
        handleAddVerification,
        handleEditVerification,
        handleSaveVerification,
        handleCancelVerification,
        handleVerificationInputChange,
        handleDeleteVerification,
    };
};

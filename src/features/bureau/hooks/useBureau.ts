import { useState } from "react";
import {
    bureauData as initialBureauData,
    bureauControlData as initialBureauControlData,
    bureauFieldData as initialBureauFieldData,
    type BureauRow,
    type BureauControlRow,
    type BureauFieldRow,
    type BureauFieldFormData,
    type BureauControlFormData
} from "../config/bureauConfig";
import { validateBureauFields } from "../utils/bureauFieldsUtils";
import { validateBureauControl, validateControlSearch } from "../utils/bureauControlUtils";

const initialFormField: BureauFieldFormData = {
    bureauName: "",
    bureauFieldName: "",
    bureauParameter: "",
    isActive: false,
};

const initialControlForm: BureauControlFormData = {
    searchControlName: "",
    bureauName: "",
    bureauControlName: "",
    bureauFieldName: "",
    bureauFieldValue: "",
    isActive: false,
};

export const useBureau = () => {
    const [bureauData, setBureauData] = useState<BureauRow[]>(initialBureauData);
    const [bureauFieldData, setBureauFieldData] = useState<BureauFieldRow[]>(initialBureauFieldData);
    const [bureauControlData, setBureauControlData] = useState<BureauControlRow[]>(initialBureauControlData);

    // Tab 2 (Bureau Fields) Form State
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [fieldFormMode, setFieldFormMode] = useState<"add" | "edit">("add");
    const [fieldForm, setFieldForm] = useState<BureauFieldFormData>(initialFormField);
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Tab 3 (Bureau Control) Form State
    const [showControlForm, setShowControlForm] = useState(false);
    const [controlFormMode, setControlFormMode] = useState<"add" | "edit">("add");
    const [controlForm, setControlForm] = useState<BureauControlFormData>(initialControlForm);
    const [editingControlId, setEditingControlId] = useState<string | null>(null);
    const [controlErrors, setControlErrors] = useState<Record<string, string>>({});

    const toggleBureauStatus = (id: string) => {
        setBureauData(prev => prev.map(item =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
    };

    const toggleBureauControlStatus = (id: string) => {
        setBureauControlData(prev => prev.map(item =>
            item.id === id ? { ...item, isActive: !item.isActive } : item
        ));
    };

    const handleAddField = () => {
        setFieldFormMode("add");
        setFieldForm(initialFormField);
        setFieldErrors({});
        setShowFieldForm(true);
    };

    const handleEditField = (row: BureauFieldRow) => {
        setFieldFormMode("edit");
        setEditingFieldId(row.id);
        setFieldErrors({});
        setFieldForm({
            bureauName: row.bureauName,
            bureauFieldName: row.bureauFieldName,
            bureauParameter: row.bureauParameter,
            isActive: row.status === "Yes",
        });
        setShowFieldForm(true);
    };

    const handleFieldInputChange = (key: keyof BureauFieldFormData, value: any) => {
        setFieldForm(prev => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleSaveField = () => {
        const errors = validateBureauFields(fieldForm);

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        if (fieldFormMode === "add") {
            const newField: BureauFieldRow = {
                id: (bureauFieldData.length + 1).toString(),
                bureauName: fieldForm.bureauName,
                bureauFieldName: fieldForm.bureauFieldName,
                bureauParameter: fieldForm.bureauParameter,
                status: fieldForm.isActive ? "Yes" : "No",
            };
            setBureauFieldData(prev => [...prev, newField]);
        } else if (editingFieldId) {
            setBureauFieldData(prev => prev.map(item =>
                item.id === editingFieldId ? {
                    ...item,
                    bureauName: fieldForm.bureauName,
                    bureauFieldName: fieldForm.bureauFieldName,
                    bureauParameter: fieldForm.bureauParameter,
                    status: fieldForm.isActive ? "Yes" : "No",
                } : item
            ));
        }
        setShowFieldForm(false);
        setFieldForm(initialFormField);
        setFieldErrors({});
    };

    const handleCancelField = () => {
        setShowFieldForm(false);
        setFieldForm(initialFormField);
        setFieldErrors({});
    };

    // --- Tab 3 (Bureau Control) Handlers ---
    const handleAddControl = () => {
        setControlFormMode("add");
        setControlForm(initialControlForm);
        setControlErrors({});
        setShowControlForm(true);
    };

    const handleEditControl = (row: BureauControlRow) => {
        setControlFormMode("edit");
        setEditingControlId(row.id);
        setControlErrors({});
        setControlForm({
            searchControlName: "",
            bureauName: row.bureauName,
            bureauControlName: row.bureauControlName,
            bureauFieldName: row.bureauFieldName,
            bureauFieldValue: row.bureauFieldValue,
            isActive: row.isActive,
        });
        setShowControlForm(true);
    };

    const handleControlInputChange = (key: keyof BureauControlFormData, value: any) => {
        setControlForm(prev => {
            const newState = { ...prev, [key]: value };
            if (key === "bureauFieldName") {
                newState.bureauFieldValue = "";
            }
            return newState;
        });
        if (controlErrors[key]) {
            setControlErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleSaveControl = () => {
        const errors = validateBureauControl(controlForm);

        if (Object.keys(errors).length > 0) {
            setControlErrors(errors);
            return;
        }

        if (controlFormMode === "add") {
            const newControl: BureauControlRow = {
                id: (bureauControlData.length + 1).toString(),
                bureauName: controlForm.bureauName,
                bureauControlName: controlForm.bureauControlName,
                bureauFieldName: controlForm.bureauFieldName,
                bureauFieldValue: controlForm.bureauFieldValue,
                status: controlForm.isActive ? "Yes" : "No",
                isActive: controlForm.isActive,
            };
            setBureauControlData(prev => [...prev, newControl]);
        } else if (editingControlId) {
            setBureauControlData(prev => prev.map(item =>
                item.id === editingControlId ? {
                    ...item,
                    bureauName: controlForm.bureauName,
                    bureauControlName: controlForm.bureauControlName,
                    bureauFieldName: controlForm.bureauFieldName,
                    bureauFieldValue: controlForm.bureauFieldValue,
                    status: controlForm.isActive ? "Yes" : "No",
                    isActive: controlForm.isActive,
                } : item
            ));
        }
        setShowControlForm(false);
        setControlForm(initialControlForm);
        setControlErrors({});
    };

    const handleCancelControl = () => {
        setShowControlForm(false);
        setControlForm(initialControlForm);
        setControlErrors({});
    };

    const handleDisplayControl = () => {
        const errors = validateControlSearch(controlForm.searchControlName);
        if (Object.keys(errors).length > 0) {
            setControlErrors(prev => ({ ...prev, ...errors }));
            return;
        }

        const control = bureauControlData.find(c => c.bureauControlName === controlForm.searchControlName);
        if (control) {
            setControlForm(prev => ({
                ...prev,
                bureauName: control.bureauName,
                bureauControlName: control.bureauControlName,
                bureauFieldName: "",
                bureauFieldValue: "",
                isActive: control.isActive,
            }));
            setControlErrors({});
            setShowControlForm(true);
        }
    };

    const handleResetControl = () => {
        setControlForm(initialControlForm);
        setControlErrors({});
    };

    return {
        bureauData,
        bureauFieldData,
        bureauControlData,
        toggleBureauStatus,
        toggleBureauControlStatus,
        // Tab 2 extension
        showFieldForm,
        fieldFormMode,
        fieldForm,
        fieldErrors,
        handleAddField,
        handleEditField,
        handleSaveField,
        handleCancelField,
        handleFieldInputChange,
        // Tab 3 extension
        showControlForm,
        controlFormMode,
        controlForm,
        controlErrors,
        handleAddControl,
        handleEditControl,
        handleSaveControl,
        handleCancelControl,
        handleControlInputChange,
        handleDisplayControl,
        handleResetControl,
    };
};

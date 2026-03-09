import { useState, useCallback } from "react";
import { groupInitialData, type AutoOriginateGroup } from "../config/autooriginationconfig";

const groupNumericFields = ["executeTime"];
const toNonExponential = (num: any) => {
    if (typeof num !== 'number') return String(num ?? "");
    return num.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 20 });
};

export const useAutoOriginateGroup = () => {
    const [groupData, setGroupData] = useState<AutoOriginateGroup[]>(groupInitialData);
    const [isGroupActive, setIsGroupActive] = useState(true);
    const [groupEditSheet, setGroupEditSheet] = useState<{
        open: boolean;
        data?: AutoOriginateGroup | null;
        mode: "add" | "edit";
    }>({
        open: false,
        data: null,
        mode: "edit",
    });

    const handleEditGroup = useCallback((group: AutoOriginateGroup) => {
        const formattedData = { ...group } as any;
        groupNumericFields.forEach(field => {
            if (typeof formattedData[field] === 'number') {
                formattedData[field] = toNonExponential(formattedData[field]);
            }
        });

        setGroupEditSheet({
            open: true,
            data: formattedData as AutoOriginateGroup,
            mode: "edit",
        });
    }, []);

    const handleAddGroup = () => {
        setGroupEditSheet({
            open: true,
            data: null,
            mode: "add",
        });
    };

    const handleSaveGroup = useCallback((formData: AutoOriginateGroup) => {
        const dataToSave = { ...formData } as any;
        groupNumericFields.forEach(field => {
            if (dataToSave[field] !== undefined && dataToSave[field] !== null && dataToSave[field] !== "") {
                const val = String(dataToSave[field]).replace(/,/g, '');
                let numVal = isNaN(Number(val)) ? 0 : Number(val);
                if (numVal < 0) numVal = 0;
                dataToSave[field] = numVal;
            }
        });

        if (groupEditSheet.mode === "add") {
            const newGroup = {
                ...dataToSave,
                id: crypto.randomUUID(),
                status: "Active" as const,
                isActive: dataToSave.isActive ?? true
            };
            setGroupData((prev) => [...prev, newGroup]);
        } else {
            setGroupData((prev) =>
                prev.map((item) => (item.id === groupEditSheet.data?.id ? { ...dataToSave, id: item.id } : item))
            );
        }
        setGroupEditSheet({ open: false, data: null, mode: "edit" });
    }, [groupEditSheet.data, groupEditSheet.mode]);

    return {
        groupData,
        isGroupActive,
        setIsGroupActive,
        groupEditSheet,
        setGroupEditSheet,
        handleEditGroup,
        handleAddGroup,
        handleSaveGroup,
    };
};

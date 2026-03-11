import { useState } from "react";
import {
    initialConfigurableData,
    productRulesMapping,
    type ConfigurableRule
} from "../config/underwritingConfig";

export const useUnderwriting = () => {
    // Current active data in the table
    const [configurableData, setConfigurableData] = useState<ConfigurableRule[]>(initialConfigurableData);
    // Persistence layer: stores saved configurations per product
    const [savedConfigs, setSavedConfigs] = useState<Record<string, ConfigurableRule[]>>({});
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleToggle = (id: string) => {
        setConfigurableData(prev => prev.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleProductChange = (value: string) => {
        setSelectedProduct(value);
        setError("");

        // 1. check if we have saved data for this product
        if (savedConfigs[value]) {
            setConfigurableData(savedConfigs[value]);
            return;
        }

        // 2. otherwise, fall back to default mapping
        const defaultCheckedStates = productRulesMapping[value];
        if (defaultCheckedStates) {
            setConfigurableData(prev => prev.map((item, index) => ({
                ...item,
                checked: defaultCheckedStates[index] ?? item.checked
            })));
        } else {
            // If no mapping, reset to initial default
            setConfigurableData(initialConfigurableData);
        }
    };

    const handleSubmit = () => {
        if (!selectedProduct) {
            setError("* Please select Campaign..");
            return;
        }

        // Save current table state for this product
        setSavedConfigs(prev => ({
            ...prev,
            [selectedProduct]: configurableData
        }));

        console.log("Saving configurations for", selectedProduct, configurableData);

        // Reset UI selection and table data
        setSelectedProduct("");
        setError("");
        setConfigurableData(initialConfigurableData);
    };

    const handleCancel = () => {
        console.log("Cancel clicked");
        setSelectedProduct("");
        setError("");
        setConfigurableData(initialConfigurableData);
    };

    return {
        configurableData,
        selectedProduct,
        error,
        handleToggle,
        handleProductChange,
        handleSubmit,
        handleCancel
    };
};

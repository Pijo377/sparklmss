import { useState, useCallback } from "react";
import {
    type AchProviderMappingRow,
    initialAchProviderData,
    productOptions
} from "../config/config";
import { validateAchProviderMapping, type AchProviderErrors } from "../utils/utils";

export const useAchProvider = () => {
    // --- State ---
    const [selections, setSelections] = useState({
        provider: "",
        products: [] as string[],
    });

    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState<AchProviderErrors>({});
    const [data, setData] = useState<AchProviderMappingRow[]>(initialAchProviderData);

    // --- Handlers ---
    const handleSelectionChange = useCallback((field: "provider" | "products", value: string | string[]) => {
        setSelections((prev) => ({ ...prev, [field]: value }));
        // Clear error when user selects a value
        setErrors((prev) => ({ ...prev, [field === "products" ? "product" : field]: undefined }));
    }, []);

    const toggleProduct = useCallback((product: string) => {
        setSelections((prev) => {
            const currentProducts = prev.products;
            const newProducts = currentProducts.includes(product)
                ? currentProducts.filter(p => p !== product)
                : [...currentProducts, product];

            return { ...prev, products: newProducts };
        });

        // Clear error if products are selected
        setErrors((prev) => ({ ...prev, product: undefined }));
    }, []);

    const selectAllProducts = useCallback(() => {
        setSelections((prev) => {
            const isAllSelected = prev.products.length === productOptions.length;
            return {
                ...prev,
                products: isAllSelected ? [] : [...productOptions]
            };
        });

        setErrors((prev) => ({ ...prev, product: undefined }));
    }, []);

    const handleMap = useCallback(() => {
        const validationErrors = validateAchProviderMapping({
            provider: selections.provider,
            product: selections.products.length > 0 ? selections.products[0] : "", // Shim for validation
        });

        if (selections.provider === "") {
            validationErrors.provider = "* Please select the ACH Provider";
        }
        if (selections.products.length === 0) {
            validationErrors.product = "* Please select the Product(s).";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const newEntries: AchProviderMappingRow[] = selections.products.map(product => ({
            id: Math.random().toString(36).substr(2, 9),
            providerName: selections.provider,
            productName: product,
        }));

        setData((prev) => [...newEntries, ...prev]);
        // Reset selections
        setSelections({ provider: "", products: [] });
        setErrors({});
    }, [selections.provider, selections.products]);

    const handleCancel = useCallback(() => {
        setSelections({ provider: "", products: [] });
        setErrors({});
    }, []);

    const handleUnmap = useCallback((row: AchProviderMappingRow) => {
        setData((prev) => prev.filter((item) => item.id !== row.id));
    }, []);

    return {
        selections,
        isOpen,
        setIsOpen,
        errors,
        data,
        handleSelectionChange,
        toggleProduct,
        selectAllProducts,
        handleMap,
        handleCancel,
        handleUnmap
    };
};

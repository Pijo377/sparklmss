import { useState } from 'react';

export const useCsvFields = () => {
    const [csvFields, setCsvFields] = useState<Array<{ id: string; field1: string; field2: string }>>([]);

    const addCsvField = () => {
        setCsvFields([...csvFields, { id: Date.now().toString(), field1: '', field2: '' }]);
    };

    const removeCsvField = (id: string) => {
        setCsvFields(csvFields.filter(f => f.id !== id));
    };

    const updateCsvField = (id: string, key: string, value: string) => {
        setCsvFields(csvFields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const resetCsvFields = () => {
        setCsvFields([]);
    };

    return {
        csvFields,
        setCsvFields,
        addCsvField,
        removeCsvField,
        updateCsvField,
        resetCsvFields,
    };
};

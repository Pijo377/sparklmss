import { useState } from 'react';
import { validateForm } from '../utils/utils';

interface UseACHFormProps {
    resetCredentials: () => void;
    resetCsvFields: () => void;
    resetDragAndDrop: () => void;
}

export const useACHForm = ({ resetCredentials, resetCsvFields, resetDragAndDrop }: UseACHFormProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAddendaRecordIndicatorChecked, setIsAddendaRecordIndicatorChecked] = useState(false);
    const [isFileIdModifierChecked, setIsFileIdModifierChecked] = useState(false);
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
    const [selectedFileType, setSelectedFileType] = useState<string>('CSV File');
    const [includeFileHeader, setIncludeFileHeader] = useState(false);
    const [encloseData, setEncloseData] = useState(false);

    // Form field states
    const [groupName, setGroupName] = useState('');
    const [destination, setDestination] = useState('');
    const [origin, setOrigin] = useState('');
    const [destinationName, setDestinationName] = useState('');
    const [originName, setOriginName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [achExtension, setAchExtension] = useState('NACHA');
    const [returnFileExtension, setReturnFileExtension] = useState('');
    const [provider, setProvider] = useState('');
    const [achTaskName, setAchTaskName] = useState('');
    const [returnsTaskName, setReturnsTaskName] = useState('');
    const [returnFileType, setReturnFileType] = useState('');
    const [separator, setSeparator] = useState('');

    // Validation
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFileTypeChange = (value: string) => {
        setSelectedFileType(value);
        setIsFormOpen(false);
        setIsSubmitted(false);
        setErrors({});

        // Reset all form fields
        setGroupName('');
        setDestination('');
        setOrigin('');
        setDestinationName('');
        setOriginName('');
        setCompanyId('');
        setReturnFileExtension('');
        setProvider('');
        setAchTaskName('');
        setReturnsTaskName('');
        setReturnFileType('');
        setSeparator('');
        setIsAddendaRecordIndicatorChecked(false);
        setIsFileIdModifierChecked(false);
        setIncludeFileHeader(false);
        setEncloseData(false);

        if (value === 'NACHA File') {
            setAchExtension('NACHA');
        } else if (value === 'PDS File') {
            setAchExtension('PDS');
        } else {
            setAchExtension('');
        }

        // Reset sub-states
        resetCredentials();
        resetCsvFields();
        resetDragAndDrop();
    };

    const handleReturnFileTypeChange = (value: string) => {
        setReturnFileType(value);
        setReturnFileExtension(value);
    };

    const runValidation = (credentialStates: any) => {
        return validateForm({
            selectedFileType,
            groupName,
            provider,
            returnFileType,
            returnFileExtension,
            destination,
            origin,
            destinationName,
            originName,
            companyId,
            achExtension,
            ...credentialStates
        });
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setIsSubmitted(false);
        setErrors({});
        setGroupName('');
        setDestination('');
        setOrigin('');
        setDestinationName('');
        setOriginName('');
        setCompanyId('');
        setAchExtension('NACHA');
        setReturnFileExtension('');
        setProvider('');
        setAchTaskName('');
        setReturnsTaskName('');
        setReturnFileType('');
        setSeparator('');
        setIsAddendaRecordIndicatorChecked(false);
        setIsFileIdModifierChecked(false);
        setIncludeFileHeader(false);
        setEncloseData(false);

        // Reset sub-states
        resetCredentials();
        resetCsvFields();
        resetDragAndDrop();
    };

    return {
        isFormOpen, setIsFormOpen,
        isAddendaRecordIndicatorChecked, setIsAddendaRecordIndicatorChecked,
        isFileIdModifierChecked, setIsFileIdModifierChecked,
        status, setStatus,
        selectedFileType, setSelectedFileType,
        includeFileHeader, setIncludeFileHeader,
        encloseData, setEncloseData,
        groupName, setGroupName,
        destination, setDestination,
        origin, setOrigin,
        destinationName, setDestinationName,
        originName, setOriginName,
        companyId, setCompanyId,
        achExtension, setAchExtension,
        returnFileExtension, setReturnFileExtension,
        provider, setProvider,
        achTaskName, setAchTaskName,
        returnsTaskName, setReturnsTaskName,
        returnFileType, setReturnFileType,
        separator, setSeparator,
        isSubmitted, setIsSubmitted,
        errors, setErrors,
        handleFileTypeChange,
        runValidation,
        handleReturnFileTypeChange,
        handleCancel,
    };
};

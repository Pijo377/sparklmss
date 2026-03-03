import React from 'react';
import { DataTable } from "@/features/achfile/ui/data-table/DataTable";
import { type ACHConfig, allColumns, mockData, initialProducts, initialFields, initialAddendaFields, productsByProvider } from '../config/config';
import { ErrorMsg as ErrorMsgBase } from '../utils/utils';
import {
    Plus,
    Edit2,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/achfile/ui/select";
import Card from '@/features/achfile/ui/card';
import { useServerCredentials } from '../hooks/useServerCredentials';
import { useCsvFields } from '../hooks/useCsvFields';
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { useACHForm } from '../hooks/useACHForm';
import ACHConfigurationCard from '../components/achcomponents/ACHConfigurationCard';
import FileDetailsCard from '../components/achcomponents/FileDetailsCard';
import ReturnConfigCard from '../components/achcomponents/ReturnConfigCard';
import ProcessingOptionsCard from '../components/achcomponents/ProcessingOptionsCard';
import UnifiedMappingCard from '../components/achcomponents/UnifiedMappingCard';
import CsvFieldsCard from '../components/achcomponents/CsvFieldsCard';
import ServerCredentialsCard from '../components/achcomponents/ServerCredentialsCard';

const ACHFile: React.FC = () => {
    const {
        uploadProtocol, setUploadProtocol,
        uploadHostName, setUploadHostName,
        uploadUserName, setUploadUserName,
        uploadPassword, setUploadPassword,
        uploadPortNo, setUploadPortNo,
        uploadPath, setUploadPath,
        downloadProtocol, setDownloadProtocol,
        downloadHostName, setDownloadHostName,
        downloadUserName, setDownloadUserName,
        downloadPassword, setDownloadPassword,
        downloadPortNo, setDownloadPortNo,
        downloadPath, setDownloadPath,
        resetCredentials,
    } = useServerCredentials();

    const {
        csvFields,
        addCsvField,
        removeCsvField,
        updateCsvField,
        resetCsvFields,
    } = useCsvFields();

    const {
        availableProducts, setAvailableProducts,
        mappedProducts, setMappedProducts,
        availableFields,
        sequenceFields,
        availableAddendaFields,
        sequenceAddendaFields,
        activeProductId, activeFieldId, activeAddendaFieldId,
        sensors,
        handleDragStartProduct, handleDragEndProduct,
        handleDragStartField, handleDragEndField,
        handleDragStartAddendaField, handleDragEndAddendaField,
        closestCenter,
        resetDragAndDrop,
    } = useDragAndDrop(initialProducts, initialFields, initialAddendaFields);

    const {
        isFormOpen, setIsFormOpen,
        isAddendaRecordIndicatorChecked, setIsAddendaRecordIndicatorChecked,
        isFileIdModifierChecked, setIsFileIdModifierChecked,
        status, setStatus,
        selectedFileType,
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
        returnFileType,
        separator, setSeparator,
        isSubmitted, setIsSubmitted,
        errors, setErrors,
        handleFileTypeChange,
        handleReturnFileTypeChange,
        runValidation,
        handleCancel,
    } = useACHForm({ resetCredentials, resetCsvFields, resetDragAndDrop });

    // Update products based on provider selection
    React.useEffect(() => {
        if (provider && productsByProvider[provider]) {
            setAvailableProducts(productsByProvider[provider]);
            setMappedProducts([]);
        } else {
            setAvailableProducts([]);
            setMappedProducts([]);
        }
    }, [provider, setAvailableProducts, setMappedProducts]);

    // Local ErrorMsg wrapper
    const ErrorMsg = React.useCallback(({ field, value }: { field: string, value?: string }) => (
        <ErrorMsgBase field={field} isSubmitted={isSubmitted} errors={errors} value={value} />
    ), [isSubmitted, errors]);

    const handleSubmit = () => {
        setIsSubmitted(true);
        const validationErrors = runValidation({
            uploadHostName, uploadProtocol, uploadUserName, uploadPassword, uploadPortNo, uploadPath,
            downloadHostName, downloadProtocol, downloadUserName, downloadPassword, downloadPortNo, downloadPath
        });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            console.log('Form is valid, submitting...');
        }
    };


    const columns = React.useMemo(() => {
        if (selectedFileType === 'CSV File') {
            return allColumns.filter(col =>
                ['fileType', 'groupName', 'achTaskName'].includes(col.key)
            );
        }
        return allColumns;
    }, [selectedFileType]);

    // Filter table data based on selected file type (matching Angular behavior)
    const filteredData = React.useMemo(() => {
        if (selectedFileType === 'CSV File') {
            return mockData.filter(d => d.fileType === 'CSV');
        } else if (selectedFileType === 'NACHA File') {
            return mockData.filter(d => d.fileType === 'NACHA');
        } else if (selectedFileType === 'PDS File') {
            return mockData.filter(d => d.fileType === 'PDS');
        }
        return mockData;
    }, [selectedFileType]);
    // Table header label
    const tableHeaderLabel = selectedFileType === 'CSV File' ? 'CSV' : selectedFileType === 'PDS File' ? 'PDS' : 'NACHA';
    const actions = {
        header: "Edit",
        width: "80px",
        items: (row: ACHConfig) => [
            {
                icon: <Edit2 size={16} className="text-blue-600" />,
                label: "Edit",
                onClick: (row: ACHConfig) => {
                    console.log("Edit row:", row);
                    setGroupName(row.groupName);
                    setDestination(row.destinationABA);
                    setOrigin(row.originABA);
                    setDestinationName(row.destinationName);
                    setOriginName(row.originName);
                    setCompanyId(row.companyId);
                    setAchTaskName(row.achTaskName || "");
                    setReturnsTaskName(row.returnsTaskName || "");
                    setProvider(row.provider || "");
                    setReturnFileExtension(row.returnFileExtension || "");
                    setIsFormOpen(true);
                },
            }
        ]
    }
    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-slate-900 shrink-0">ACH File Settings</h1>
            </div>

            <Card className="flex items-center justify-between gap-6 h-auto p-5 border-blue-200 border-2 shadow-sm">
                <div className="flex-1 max-w-sm">
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">ACH File Type</label>
                    <Select value={selectedFileType} onValueChange={handleFileTypeChange}>
                        <SelectTrigger className="h-10 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <SelectValue placeholder="-- Select Type --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NACHA File">NACHA File</SelectItem>
                            <SelectItem value="CSV File">CSV File</SelectItem>
                            <SelectItem value="PDS File">PDS File</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <button
                    className="flex-shrink-0 cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all flex items-center gap-2 font-semibold text-sm h-10"
                    onClick={() => setIsFormOpen(true)}
                >
                    <Plus size={18} />
                    <span>Add</span>
                </button>
            </Card>

            {isFormOpen && (
                <div className="space-y-4 mb-6" id="ach-configuration-form">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-12">
                            <ACHConfigurationCard
                                selectedFileType={selectedFileType}
                                groupName={groupName}
                                setGroupName={setGroupName}
                                destination={destination}
                                setDestination={setDestination}
                                origin={origin}
                                setOrigin={setOrigin}
                                destinationName={destinationName}
                                setDestinationName={setDestinationName}
                                originName={originName}
                                setOriginName={setOriginName}
                                companyId={companyId}
                                setCompanyId={setCompanyId}
                                achExtension={achExtension}
                                setAchExtension={setAchExtension}
                                returnFileType={returnFileType}
                                setReturnFileType={handleReturnFileTypeChange}
                                ErrorMsg={ErrorMsg}
                            />
                        </div>

                        <div className="lg:col-span-7 flex flex-col gap-4">
                            <FileDetailsCard
                                provider={provider}
                                setProvider={setProvider}
                                achTaskName={achTaskName}
                                setAchTaskName={setAchTaskName}
                                returnsTaskName={returnsTaskName}
                                setReturnsTaskName={setReturnsTaskName}
                                ErrorMsg={ErrorMsg}
                            />

                            <ReturnConfigCard
                                returnFileExtension={returnFileExtension}
                                setReturnFileExtension={setReturnFileExtension}
                                isFileIdModifierChecked={isFileIdModifierChecked}
                                setIsFileIdModifierChecked={setIsFileIdModifierChecked}
                                ErrorMsg={ErrorMsg}
                            />

                            <ProcessingOptionsCard
                                selectedFileType={selectedFileType}
                                includeFileHeader={includeFileHeader}
                                setIncludeFileHeader={setIncludeFileHeader}
                                encloseData={encloseData}
                                setEncloseData={setEncloseData}
                                isAddendaRecordIndicatorChecked={isAddendaRecordIndicatorChecked}
                                setIsAddendaRecordIndicatorChecked={setIsAddendaRecordIndicatorChecked}
                                status={status}
                                setStatus={setStatus}
                            />
                        </div>

                        <div className="lg:col-span-5">
                            <UnifiedMappingCard
                                selectedFileType={selectedFileType}
                                sensors={sensors}
                                closestCenter={closestCenter}
                                availableProducts={availableProducts}
                                mappedProducts={mappedProducts}
                                activeProductId={activeProductId}
                                handleDragStartProduct={handleDragStartProduct}
                                handleDragEndProduct={handleDragEndProduct}
                                availableFields={availableFields}
                                sequenceFields={sequenceFields}
                                activeFieldId={activeFieldId}
                                handleDragStartField={handleDragStartField}
                                handleDragEndField={handleDragEndField}
                                isAddendaRecordIndicatorChecked={isAddendaRecordIndicatorChecked}
                                separator={separator}
                                setSeparator={setSeparator}
                                availableAddendaFields={availableAddendaFields}
                                sequenceAddendaFields={sequenceAddendaFields}
                                activeAddendaFieldId={activeAddendaFieldId}
                                handleDragStartAddendaField={handleDragStartAddendaField}
                                handleDragEndAddendaField={handleDragEndAddendaField}
                                ErrorMsg={ErrorMsg}
                            />
                        </div>

                        <div className="lg:col-span-12">
                            <CsvFieldsCard
                                selectedFileType={selectedFileType}
                                provider={provider}
                                csvFields={csvFields}
                                addCsvField={addCsvField}
                                removeCsvField={removeCsvField}
                                updateCsvField={updateCsvField}
                                ErrorMsg={ErrorMsg}
                            />
                        </div>

                        <div className="lg:col-span-12">
                            <ServerCredentialsCard
                                uploadProtocol={uploadProtocol}
                                setUploadProtocol={setUploadProtocol}
                                uploadHostName={uploadHostName}
                                setUploadHostName={setUploadHostName}
                                uploadUserName={uploadUserName}
                                setUploadUserName={setUploadUserName}
                                uploadPassword={uploadPassword}
                                setUploadPassword={setUploadPassword}
                                uploadPortNo={uploadPortNo}
                                setUploadPortNo={setUploadPortNo}
                                uploadPath={uploadPath}
                                setUploadPath={setUploadPath}
                                downloadProtocol={downloadProtocol}
                                setDownloadProtocol={setDownloadProtocol}
                                downloadHostName={downloadHostName}
                                setDownloadHostName={setDownloadHostName}
                                downloadUserName={downloadUserName}
                                setDownloadUserName={setDownloadUserName}
                                downloadPassword={downloadPassword}
                                setDownloadPassword={setDownloadPassword}
                                downloadPortNo={downloadPortNo}
                                setDownloadPortNo={setDownloadPortNo}
                                downloadPath={downloadPath}
                                setDownloadPath={setDownloadPath}
                                ErrorMsg={ErrorMsg}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-12 flex justify-center gap-4 py-8">
                        <button
                            className="px-10 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                            onClick={handleCancel}
                        >
                            <span className="material-symbols-outlined text-lg">close</span> Cancel
                        </button>
                        <button
                            className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all font-semibold text-sm flex items-center gap-2 cursor-pointer"
                            onClick={handleSubmit}
                        >
                            <span className="material-symbols-outlined text-lg">save</span> Submit
                        </button>
                    </div>
                </div>
            )}

            <div id="existing-configs-container">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Existing {tableHeaderLabel} Configurations</h3>
                    <DataTable
                        data={filteredData}
                        columns={columns}
                        actions={actions}
                        enableColumnFilters={false}
                        enableGlobalSearch={false}
                        initialPageSize={5}
                    />
                </div>
            </div>
        </div>
    );
};

export default ACHFile;

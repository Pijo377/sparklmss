import React from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { Input } from "@/features/achfile/ui/input";
import Card from '@/features/achfile/ui/card';

interface CsvFieldsCardProps {
    selectedFileType: string;
    provider: string;
    csvFields: Array<{ id: string; field1: string; field2: string }>;
    addCsvField: () => void;
    removeCsvField: (id: string) => void;
    updateCsvField: (id: string, key: string, value: string) => void;
    ErrorMsg: React.FC<{ field: string, value?: string }>;
}

const CsvFieldsCard: React.FC<CsvFieldsCardProps> = ({
    selectedFileType,
    provider,
    csvFields,
    addCsvField,
    removeCsvField,
    updateCsvField,
    ErrorMsg
}) => {
    if (selectedFileType !== 'CSV File' || !provider) return null;

    return (
        <Card className="p-5 border-slate-200 border-2 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-600 ">ADD CSV Fields</h3>
                    <button
                        onClick={addCsvField}
                        type="button"
                        className="flex-shrink-0 cursor-pointer h-8 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 ml-2 min-w-[80px]"
                    >
                        <Plus size={16} />
                        <span>Add</span>
                    </button>
                </div>
                <button
                    type="button"
                    className="flex-shrink-0 cursor-pointer h-8 px-4 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-all font-semibold text-xs flex items-center justify-center gap-1.5 min-w-[80px]"
                >
                    <span className="material-symbols-outlined text-[16px]">save</span> Save
                </button>
            </div>

            <div className="space-y-4 pt-4">
                {csvFields.map((field) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
                        <div>
                            <Input
                                className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="text"
                                placeholder="Field 1"
                                onChange={(e) => updateCsvField(field.id, 'field1', e.target.value)}
                                maxLength={50}
                            />
                            <ErrorMsg field="field1" value={field.field1} />
                        </div>
                        <div>
                            <Input
                                className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                type="text"
                                placeholder="Field 2"
                                value={field.field2}
                                onChange={(e) => updateCsvField(field.id, 'field2', e.target.value)}
                                maxLength={50}
                            />
                            <ErrorMsg field="field2" value={field.field2} />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeCsvField(field.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Cancel"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default CsvFieldsCard;

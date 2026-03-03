import React from 'react';
import { ToggleRight } from 'lucide-react';
import Card from '@/features/achfile/ui/card';

interface ProcessingOptionsCardProps {
    selectedFileType: string;
    includeFileHeader: boolean;
    setIncludeFileHeader: (val: boolean) => void;
    encloseData: boolean;
    setEncloseData: (val: boolean) => void;
    isAddendaRecordIndicatorChecked: boolean;
    setIsAddendaRecordIndicatorChecked: (val: boolean) => void;
    status: 'Active' | 'Inactive';
    setStatus: (val: 'Active' | 'Inactive') => void;
}

const ProcessingOptionsCard: React.FC<ProcessingOptionsCardProps> = ({
    selectedFileType,
    includeFileHeader,
    setIncludeFileHeader,
    encloseData,
    setEncloseData,
    isAddendaRecordIndicatorChecked,
    setIsAddendaRecordIndicatorChecked,
    status,
    setStatus
}) => {
    return (
        <Card className="p-6 flex-1 flex flex-col border-indigo-400 border-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-indigo-100 pb-2">
                <ToggleRight size={16} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-indigo-600 ">Processing Options</h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex items-center gap-2.5">
                    <input className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-slate-300" id="gen-auto-v2" type="checkbox" />
                    <div>
                        <label className="text-sm font-medium text-slate-900 block" htmlFor="gen-auto-v2">Generate Automatically</label>
                    </div>
                </div>
                {selectedFileType === 'CSV File' && (
                    <>
                        <div className="flex items-center gap-2.5">
                            <input
                                className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-slate-300"
                                id="include-file-header"
                                type="checkbox"
                                checked={includeFileHeader}
                                onChange={(e) => setIncludeFileHeader(e.target.checked)}
                            />
                            <div>
                                <label className="text-sm font-medium text-slate-900 block" htmlFor="include-file-header">Include File Header</label>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <input
                                className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-slate-300"
                                id="enclose-data"
                                type="checkbox"
                                checked={encloseData}
                                onChange={(e) => setEncloseData(e.target.checked)}
                            />
                            <div>
                                <label className="text-sm font-medium text-slate-900 block" htmlFor="enclose-data">Enclose Data with</label>
                            </div>
                        </div>
                    </>
                )}
                {(selectedFileType === 'NACHA File' || selectedFileType === 'PDS File') && (
                    <div className="flex items-center gap-2.5">
                        <input
                            className="w-4 h-4 rounded text-primary focus:ring-primary/20 border-slate-300"
                            id="addenda-record-indicator"
                            type="checkbox"
                            checked={isAddendaRecordIndicatorChecked}
                            onChange={(e) => setIsAddendaRecordIndicatorChecked(e.target.checked)}
                        />
                        <div>
                            <label className="text-sm font-medium text-slate-900 block" htmlFor="addenda-record-indicator">Addenda Record Indicator</label>
                        </div>
                    </div>
                )}
            </div>
            {/* Configuration Status */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-4">
                <span className="text-sm font-medium text-slate-900">Is Active</span>
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-0.5">
                    <button
                        onClick={() => setStatus('Active')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${status === 'Active' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setStatus('Inactive')}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${status === 'Inactive' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white'}`}
                    >
                        Inactive
                    </button>
                </div>
            </div>
        </Card>
    );
};

export default ProcessingOptionsCard;

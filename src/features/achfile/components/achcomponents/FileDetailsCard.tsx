import React from 'react';
import { FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/achfile/ui/select";
import Card from '@/features/achfile/ui/card';

interface FileDetailsCardProps {
    provider: string;
    setProvider: (val: string) => void;
    achTaskName: string;
    setAchTaskName: (val: string) => void;
    returnsTaskName: string;
    setReturnsTaskName: (val: string) => void;
    ErrorMsg: React.FC<{ field: string, value?: string }>;
}

const FileDetailsCard: React.FC<FileDetailsCardProps> = ({
    provider,
    setProvider,
    achTaskName,
    setAchTaskName,
    returnsTaskName,
    setReturnsTaskName,
    ErrorMsg
}) => {
    return (
        <Card className="p-6 flex-1 flex flex-col border-blue-400 border-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-blue-100 pb-2">
                <FileText size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-600 ">File Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">ACH Provider</label>
                    <Select value={provider} onValueChange={setProvider}>
                        <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="provider1">Provider 1</SelectItem>
                            <SelectItem value="provider2">Provider 2</SelectItem>
                            <SelectItem value="provider3">Provider 3</SelectItem>
                        </SelectContent>
                    </Select>
                    <ErrorMsg field="provider" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">ACH Task Name</label>
                    <Select value={achTaskName} onValueChange={setAchTaskName}>
                        <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <SelectValue placeholder="Select Task" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="task1">Task 1</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">Returns Task Name</label>
                    <Select value={returnsTaskName} onValueChange={setReturnsTaskName}>
                        <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <SelectValue placeholder="Select Return Task" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="return1">Return Task 1</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    );
};

export default FileDetailsCard;

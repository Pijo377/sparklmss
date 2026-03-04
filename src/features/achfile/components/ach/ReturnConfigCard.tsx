import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/achfile/ui/select";
import { Input } from "@/features/achfile/ui/input";
import Card from '@/features/achfile/ui/card';

interface ReturnConfigCardProps {
    returnFileExtension: string;
    setReturnFileExtension: (val: string) => void;
    isFileIdModifierChecked: boolean;
    setIsFileIdModifierChecked: (val: boolean) => void;
    ErrorMsg: React.FC<{ field: string, value?: string }>;
}

const ReturnConfigCard: React.FC<ReturnConfigCardProps> = ({
    returnFileExtension,
    setReturnFileExtension,
    isFileIdModifierChecked,
    setIsFileIdModifierChecked,
    ErrorMsg
}) => {
    return (
        <Card className="p-6 flex-1 flex flex-col border-orange-200 border-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-orange-100 pb-2">
                <RotateCcw size={16} className="text-orange-600" />
                <h3 className="text-sm font-semibold text-orange-600 ">Return Configuration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">Return File Extension</label>
                    <Input
                        className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        type="text"
                        maxLength={20}
                        value={returnFileExtension}
                        onChange={(e) => setReturnFileExtension(e.target.value)}
                    />
                    <ErrorMsg field="returnFileExtension" value={returnFileExtension} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <label className="block text-sm font-medium text-slate-900">File ID Modifier</label>
                        <input
                            type="checkbox"
                            className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 border-slate-300"
                            checked={isFileIdModifierChecked}
                            onChange={(e) => setIsFileIdModifierChecked(e.target.checked)}
                        />
                    </div>
                    <Select disabled={!isFileIdModifierChecked}>
                        <SelectTrigger className={`h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${!isFileIdModifierChecked ? 'opacity-50' : ''}`}>
                            <SelectValue placeholder="-- Select --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="modifier1">Modifier 1</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </Card>
    );
};

export default ReturnConfigCard;

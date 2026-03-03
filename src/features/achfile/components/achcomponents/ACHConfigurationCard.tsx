import React from 'react';
import { Settings2 } from 'lucide-react';
import { Input } from "@/features/achfile/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/achfile/ui/select";
import Card from '@/features/achfile/ui/card';

interface ACHConfigurationCardProps {
    selectedFileType: string;
    groupName: string;
    setGroupName: (val: string) => void;
    destination: string;
    setDestination: (val: string) => void;
    origin: string;
    setOrigin: (val: string) => void;
    destinationName: string;
    setDestinationName: (val: string) => void;
    originName: string;
    setOriginName: (val: string) => void;
    companyId: string;
    setCompanyId: (val: string) => void;
    achExtension: string;
    setAchExtension: (val: string) => void;
    returnFileType: string;
    setReturnFileType: (val: string) => void;
    ErrorMsg: React.FC<{ field: string, value?: string }>;
}

const ACHConfigurationCard: React.FC<ACHConfigurationCardProps> = ({
    selectedFileType,
    groupName,
    setGroupName,
    destination,
    setDestination,
    origin,
    setOrigin,
    destinationName,
    setDestinationName,
    originName,
    setOriginName,
    companyId,
    setCompanyId,
    achExtension,
    setAchExtension,
    returnFileType,
    setReturnFileType,
    ErrorMsg
}) => {
    return (
        <Card className="p-5 border-purple-200 border-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-purple-50 pb-2">
                <Settings2 size={16} className="text-purple-600" />
                <h3 className="text-sm font-semibold text-purple-600 ">ACH Configuration</h3>
            </div>
            <div className={`grid grid-cols-1 ${selectedFileType === 'CSV File' ? 'md:grid-cols-2' : 'md:grid-cols-3 lg:grid-cols-4'} gap-x-6 gap-y-4`}>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">{selectedFileType === 'CSV File' ? 'CSV Group Name' : 'ACH Group Name'}</label>
                    <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="text" maxLength={50} value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                    <ErrorMsg field="groupName" value={groupName} />
                </div>
                {selectedFileType !== 'CSV File' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Immediate Destination</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="tel" maxLength={9} value={destination} onChange={(e) => setDestination(e.target.value)} />
                            <ErrorMsg field="destination" value={destination} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Immediate Origin</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="tel" maxLength={9} value={origin} onChange={(e) => setOrigin(e.target.value)} />
                            <ErrorMsg field="origin" value={origin} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Immediate Destination Name</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="text" maxLength={23} value={destinationName} onChange={(e) => setDestinationName(e.target.value)} />
                            <ErrorMsg field="destinationName" value={destinationName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Immediate Origin Name</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="text" maxLength={23} value={originName} onChange={(e) => setOriginName(e.target.value)} />
                            <ErrorMsg field="originName" value={originName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Company ID</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="text" maxLength={10} value={companyId} onChange={(e) => setCompanyId(e.target.value)} />
                            <ErrorMsg field="companyId" value={companyId} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">ACH File Extension</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" type="text" maxLength={10} value={achExtension} onChange={(e) => setAchExtension(e.target.value)} readOnly />
                            <ErrorMsg field="achExtension" value={achExtension} />
                        </div>
                    </>
                )}
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Return File Type</label>
                    <Select value={returnFileType} onValueChange={setReturnFileType}>
                        <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                            <SelectValue placeholder="-- Select --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NACHA">NACHA</SelectItem>
                            <SelectItem value="CSV">CSV</SelectItem>
                            <SelectItem value="PDS">PDS</SelectItem>
                        </SelectContent>
                    </Select>
                    <ErrorMsg field="returnFileType" />
                </div>
            </div>
        </Card>
    );
};

export default ACHConfigurationCard;

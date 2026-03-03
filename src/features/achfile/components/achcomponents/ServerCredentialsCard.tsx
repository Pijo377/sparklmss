import React from 'react';
import { Server } from 'lucide-react';
import { Input } from "@/features/achfile/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/achfile/ui/select";
import Card from '@/features/achfile/ui/card';

interface ServerCredentialsCardProps {
    uploadProtocol: string;
    setUploadProtocol: (val: string) => void;
    uploadHostName: string;
    setUploadHostName: (val: string) => void;
    uploadUserName: string;
    setUploadUserName: (val: string) => void;
    uploadPassword: string;
    setUploadPassword: (val: string) => void;
    uploadPortNo: string;
    setUploadPortNo: (val: string) => void;
    uploadPath: string;
    setUploadPath: (val: string) => void;
    downloadProtocol: string;
    setDownloadProtocol: (val: string) => void;
    downloadHostName: string;
    setDownloadHostName: (val: string) => void;
    downloadUserName: string;
    setDownloadUserName: (val: string) => void;
    downloadPassword: string;
    setDownloadPassword: (val: string) => void;
    downloadPortNo: string;
    setDownloadPortNo: (val: string) => void;
    downloadPath: string;
    setDownloadPath: (val: string) => void;
    ErrorMsg: React.FC<{ field: string, value?: string }>;
}

const ServerCredentialsCard: React.FC<ServerCredentialsCardProps> = ({
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
    ErrorMsg
}) => {
    return (
        <Card className="p-5 border-slate-200 border-2 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-50 pb-2">
                <Server size={16} className="text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-600 ">Server Credentials</h3>
            </div>

            <div className="space-y-6">
                {/* Upload Section */}
                <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        Upload Credentials
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Upload Trans Protocol</label>
                            <Select value={uploadProtocol} onValueChange={setUploadProtocol}>
                                <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl">
                                    <SelectValue placeholder="-- Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sftp">SFTP</SelectItem>
                                    <SelectItem value="ftp">FTP</SelectItem>
                                </SelectContent>
                            </Select>
                            <ErrorMsg field="uploadProtocol" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Host Name</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={255} value={uploadHostName} onChange={(e) => setUploadHostName(e.target.value)} />
                            <ErrorMsg field="uploadHostName" value={uploadHostName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">User Name</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={36} value={uploadUserName} onChange={(e) => setUploadUserName(e.target.value)} />
                            <ErrorMsg field="uploadUserName" value={uploadUserName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" type="password" maxLength={70} value={uploadPassword} onChange={(e) => setUploadPassword(e.target.value)} />
                            <ErrorMsg field="uploadPassword" value={uploadPassword} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Port No</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={5} value={uploadPortNo} onChange={(e) => setUploadPortNo(e.target.value)} />
                            <ErrorMsg field="uploadPortNo" value={uploadPortNo} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Path to Upload</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={200} value={uploadPath} onChange={(e) => setUploadPath(e.target.value)} />
                            <ErrorMsg field="uploadPath" value={uploadPath} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100"></div>

                {/* Download Section */}
                <div>
                    <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        Download Credentials
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Download Trans Protocol</label>
                            <Select value={downloadProtocol} onValueChange={setDownloadProtocol}>
                                <SelectTrigger className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl">
                                    <SelectValue placeholder="-- Select --" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sftp">SFTP</SelectItem>
                                    <SelectItem value="ftp">FTP</SelectItem>
                                </SelectContent>
                            </Select>
                            <ErrorMsg field="downloadProtocol" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Host Name</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={255} value={downloadHostName} onChange={(e) => setDownloadHostName(e.target.value)} />
                            <ErrorMsg field="downloadHostName" value={downloadHostName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">User Name</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={36} value={downloadUserName} onChange={(e) => setDownloadUserName(e.target.value)} />
                            <ErrorMsg field="downloadUserName" value={downloadUserName} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" type="password" maxLength={70} value={downloadPassword} onChange={(e) => setDownloadPassword(e.target.value)} />
                            <ErrorMsg field="downloadPassword" value={downloadPassword} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Port No</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={5} value={downloadPortNo} onChange={(e) => setDownloadPortNo(e.target.value)} />
                            <ErrorMsg field="downloadPortNo" value={downloadPortNo} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Path to Download</label>
                            <Input className="h-11 px-4 text-sm bg-white border border-gray-200 rounded-xl" maxLength={200} value={downloadPath} onChange={(e) => setDownloadPath(e.target.value)} />
                            <ErrorMsg field="downloadPath" value={downloadPath} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServerCredentialsCard;

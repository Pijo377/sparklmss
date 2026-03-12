import { Settings2 } from "lucide-react";
import type { Shortcut } from "../types";

interface PreviewCardProps {
    activeShortcuts: Shortcut[];
}

export const Preview = ({ activeShortcuts }: PreviewCardProps) => {
    return (
        <div className="flex-1 flex flex-col gap-4 h-full">
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-lg relative overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-center bg-white relative">
                    <div className="flex gap-2 absolute left-4">
                        <div className="size-3 rounded-full bg-[#ff5f57]"></div>
                        <div className="size-3 rounded-full bg-[#febc2e]"></div>
                        <div className="size-3 rounded-full bg-[#28c840]"></div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                        Preview
                    </span>
                </div>
                <div className="flex-1 flex items-center justify-center bg-[#f8fafc] p-12">
                    <div className="w-full max-w-[360px] bg-[#f9fafb] rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-4">
                                QUICK LINKS
                            </h2>
                            <div className="space-y-1">
                                {activeShortcuts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 opacity-40">
                                        <Settings2 size={48} className="mb-3 text-primary/30" />
                                        <p className="text-slate-400 text-sm font-medium italic">
                                            Sidebar empty
                                        </p>
                                    </div>
                                ) : (
                                    activeShortcuts.map((shortcut) => (
                                        <div
                                            key={shortcut.id}
                                            className="flex items-center gap-4 py-2 px-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                                        >
                                            <div className="text-slate-400 flex items-center justify-center transition-colors">
                                                {(() => {
                                                    const Icon = shortcut.icon;
                                                    return <Icon size={20} />;
                                                })()}
                                            </div>
                                            <span className="text-[16px] font-semibold text-gray-600 group-hover:text-slate-900 transition-colors">
                                                {shortcut.name}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

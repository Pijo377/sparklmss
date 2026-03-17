import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Mail,
    CreditCard,
    RotateCcw,
    Save,
} from 'lucide-react';

const GeneralConfiguration: React.FC = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>('sms-email');

    // Form States
    const [config, setConfig] = useState({
        customSms: true,
        customEmail: false,
        paymentAuthReturn: true,
        consecutiveReturnCount: 2
    });
    const [paymentAuthError, setPaymentAuthError] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setExpandedSection(prev => prev === id ? null : id);
    };

    const handleConfigChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
        if (key === 'consecutiveReturnCount') {
            setPaymentAuthError(null);
        }
    };

    const handleUpdatePaymentAuth = () => {
        if (!config.consecutiveReturnCount && config.consecutiveReturnCount !== 0) {
            setPaymentAuthError("* Please enter Consecutive Return Count.");
            return;
        }
        // Proceed with update
        console.log("Updating Payment Auth Config:", config);
        setPaymentAuthError(null);
    };

    const SectionHeader = ({ id, icon: Icon, title, subtitle }: { id: string, icon: any, title: string, subtitle: string }) => {
        const isOpen = expandedSection === id;
        return (
            <div
                onClick={() => toggleSection(id)}
                className={`group relative flex items-center justify-between p-3.5 transition-all duration-300 cursor-pointer outline-none rounded-2xl border ${isOpen
                    ? "bg-gradient-to-br from-white to-blue-50/20 border-blue-200 shadow-lg"
                    : "bg-white border-slate-200 shadow-sm hover:border-blue-300"
                    }`}
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`size-10 rounded-xl flex items-center justify-center border shrink-0 transition-all duration-300 ${isOpen
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-lg shadow-blue-200/50"
                        : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}>
                        <Icon size={18} />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="text-slate-900 font-semibold text-base truncate">{title}</h3>
                        <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <motion.div
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="p-2 text-slate-400 group-hover:text-slate-700 rounded-lg"
                    >
                        <ChevronRight size={18} />
                    </motion.div>
                </div>
            </div>
        );
    };

    const CheckboxField = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) => (
        <label className="flex items-center gap-3 p-2 cursor-pointer transition-colors">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
            />
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </label>
    );

    return (
        <div className="flex flex-col gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm h-full overflow-hidden">
            <div className="flex items-center justify-between shrink-0 mb-1">
                <h2 className="text-xl font-semibold text-slate-900 px-1">General Configuration</h2>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 pb-6 px-1">
                {/* SMS & Email Configuration */}
                <div className="space-y-3">
                    <SectionHeader
                        id="sms-email"
                        icon={Mail}
                        title="SMS & Email Configuration"
                        subtitle="Communication settings"
                    />
                    <AnimatePresence initial={false} mode="wait">
                        {expandedSection === 'sms-email' && (
                            <motion.div
                                key="sms-email-content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                style={{ overflow: 'hidden' }}
                                className="relative"
                            >
                                <div className="relative pl-14 pb-4 pt-1">
                                    {/* Vertical Trunk */}
                                    <div className="absolute left-[34px] top-[-12px] h-[52px] w-px bg-slate-200" />

                                    {/* Intersection Dot */}
                                    <div className="absolute left-[31px] top-[37px] size-1.5 rounded-full bg-slate-400 z-20 shadow-sm" />

                                    {/* Horizontal Branch */}
                                    <div className="absolute left-[34px] top-10 w-[22px] h-px bg-slate-200" />

                                    {/* Content Card */}
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <CheckboxField
                                                label="Is the Custom SMS active?"
                                                checked={config.customSms}
                                                onChange={(val) => handleConfigChange('customSms', val)}
                                            />
                                            <CheckboxField
                                                label="Is the Custom Email active?"
                                                checked={config.customEmail}
                                                onChange={(val) => handleConfigChange('customEmail', val)}
                                            />
                                            <div className="md:col-span-2 flex justify-center gap-4  border-t border-slate-50 pt-3">
                                                <button className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all text-sm font-semibold shadow-md text-nowrap">
                                                    <Save size={16} />
                                                    Submit
                                                </button>
                                                <button className="flex items-center gap-2 px-5 py-1.5 bg-white border border-slate-200 text-red-600 rounded-lg hover:bg-slate-50 transition-all text-sm font-semibold shadow-sm text-nowrap">
                                                    <RotateCcw size={16} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Payment Authorization */}
                <div className="space-y-3">
                    <SectionHeader
                        id="payment-auth"
                        icon={CreditCard}
                        title="Payment Authorization"
                        subtitle="Financial authorization rules"
                    />
                    <AnimatePresence initial={false} mode="wait">
                        {expandedSection === 'payment-auth' && (
                            <motion.div
                                key="payment-auth-content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                                style={{ overflow: 'hidden' }}
                                className="relative"
                            >
                                <div className="relative pl-14 pb-4 pt-1">
                                    {/* Vertical Trunk */}
                                    <div className="absolute left-[34px] top-[-12px] h-[52px] w-px bg-slate-200" />

                                    {/* Intersection Dot */}
                                    <div className="absolute left-[31px] top-[37px] size-1.5 rounded-full bg-slate-400 z-20 shadow-sm" />

                                    {/* Horizontal Branch */}
                                    <div className="absolute left-[34px] top-10 w-[22px] h-px bg-slate-200" />

                                    {/* Content Card */}
                                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                                            <div className="flex flex-col gap-2">
                                                <CheckboxField
                                                    label="Initiate Payment Auth on Consecutive Return"
                                                    checked={config.paymentAuthReturn}
                                                    onChange={(val) => handleConfigChange('paymentAuthReturn', val)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 relative">
                                                <label className="text-sm font-medium text-slate-700 ml-1">Enter the Consecutive Return Count</label>
                                                <input
                                                    type="number"
                                                    value={config.consecutiveReturnCount === 0 ? 0 : (config.consecutiveReturnCount || "")}
                                                    onChange={(e) => {
                                                        const val = e.target.value === "" ? "" : parseInt(e.target.value);
                                                        handleConfigChange('consecutiveReturnCount', val);
                                                    }}
                                                    className={`h-11 px-4 text-sm bg-white border ${paymentAuthError ? "border-red-400 focus:ring-red-500" : "border-slate-200 focus:ring-blue-500"} rounded-xl focus:ring-2 focus:border-transparent transition-all outline-none w-full shadow-sm`}
                                                />
                                                {paymentAuthError && (
                                                    <span className="text-[10px] text-red-500 absolute -bottom-5 left-1 font-medium select-none">
                                                        {paymentAuthError}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="md:col-span-2 flex justify-center gap-4 border-t border-slate-50 pt-3">
                                                <button
                                                    onClick={handleUpdatePaymentAuth}
                                                    className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 text-white border border-blue-600 rounded-lg hover:bg-blue-700 hover:border-blue-700 transition-all text-sm font-semibold shadow-md active:scale-95 text-nowrap"
                                                >
                                                    <Save size={16} />
                                                    Update
                                                </button>
                                                <button className="flex items-center gap-2 px-5 py-1.5 bg-white border border-slate-200 text-red-600 rounded-lg hover:bg-slate-50 transition-all text-sm font-semibold shadow-sm text-nowrap">
                                                    <RotateCcw size={16} />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default GeneralConfiguration;

import React, { useState } from 'react';
import Card from '@/shared/components/ui/card';
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,

  SelectItem,

  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  ShieldCheck,
  Wallet,
  Map,
  GripVertical,
  Check,
} from 'lucide-react';

// --- SHADCN STYLE COMPACT CHECKBOX ---
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  className?: string;
}

const CompactCheckbox: React.FC<CheckboxProps> = ({ label, checked, onChange, className = '' }) => {
  return (
    <div
      onClick={onChange}
      className={`flex items-center gap-2 cursor-pointer group select-none ${className}`}
    >
      <div className={`
        w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center shrink-0
        ${checked
          ? 'bg-indigo-600 border-indigo-600 shadow-sm'
          : 'bg-white border-slate-300 group-hover:border-slate-400'}
      `}>
        {checked && <Check size={12} className="text-white stroke-[3.5]" />}
      </div>
      <span className={` block text-[10px] font-bold text-slate-400 uppercase tracking-widest  ${checked ? 'text-slate-900' : 'text-slate-600'}`}>
        {label}
      </span>
    </div>
  );
};

const InputLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest">
    {children}
  </label>
);

const ALL_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const App: React.FC = () => {
  const [toggles, setToggles] = useState({
    denyMilitary: false, mustBeEmployed: true, notInBankruptcy: true, checkBadEmployer: true,
    mustHaveDirectDeposit: true, mustHaveChecking: true, checkBadABA: true, validABAScreening: true,
    denyMonthlyPaid: false, denyWeeklyPaid: false, checkDLNumber: true, checkDLState: true,
    checkState: true, checkBadSubAffiliateID: true, existingCustomerBypass: false,
    rejectExisting: false, denyUnprocessedLoan: true, allowActiveCustomers: true,
    badLoanStatus: true, configActive: true,
  });

  const [inputs, setInputs] = useState<Record<string, string | number>>({
    minMonthlySalary: 2000, maxMonthlySalary: 10000, minAge: 18,
    acLengthMax: 365, paymentCount: 12, rejectedLoanDays: 30,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [allowedStates, setAllowedStates] = useState(['California', 'Texas', 'New York', 'Florida', 'Illinois']);
  const [deniedStates, setDeniedStates] = useState(ALL_STATES.filter(s => !['California', 'Texas', 'New York', 'Florida', 'Illinois'].includes(s)));

  const handleToggle = (key: keyof typeof toggles) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const handleInput = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const validateFinancials = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    const minSal = inputs.minMonthlySalary === "" ? NaN : Number(inputs.minMonthlySalary);
    const maxSal = inputs.maxMonthlySalary === "" ? NaN : Number(inputs.maxMonthlySalary);

    // Minimum Monthly Salary
    if (inputs.minMonthlySalary === "") {
      newErrors.minMonthlySalary = "* Please enter Minimum Monthly Salary.";
      isValid = false;
    } else if (isNaN(minSal) || minSal < 300 || minSal > 30000) {
      newErrors.minMonthlySalary = "*Enter Minimum Monthly salary between $300.00 and $30,000.00.";
      isValid = false;
    }

    // Maximum Monthly Salary
    if (inputs.maxMonthlySalary === "") {
      newErrors.maxMonthlySalary = "* Please enter Maximum Monthly Salary.";
      isValid = false;
    } else if (isNaN(maxSal) || maxSal < 300 || maxSal > 30000) {
      newErrors.maxMonthlySalary = "* Enter Maximum Monthly salary between $300.00 and $30,000.00.";
      isValid = false;
    } else if (!isNaN(minSal) && !isNaN(maxSal) && maxSal <= minSal) {
      newErrors.maxMonthlySalary = "* Maximum salary must be greater than Minimum salary";
      isValid = false;
    }

    // Minimum Age Limit
    if (inputs.minAge === "") {
      newErrors.minAge = "* Please enter the min age limit";
      isValid = false;
    }

    // Checking Account Length
    if (inputs.acLengthMax === "") {
      newErrors.acLengthMax = "* Please enter checking cccount length.";
      isValid = false;
    }

    // Payment Count
    if (inputs.paymentCount === "") {
      newErrors.paymentCount = "* Please enter Payment Count.";
      isValid = false;
    }

    // Rejected Loan Days
    if (inputs.rejectedLoanDays === "") {
      newErrors.rejectedLoanDays = "* Please enter the No of Days.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (validateFinancials()) {
      console.log("Form is valid, submitting...", inputs, toggles);
    }
  };

  const moveState = (state: string, toAllowed: boolean) => {
    if (toAllowed) {
      setDeniedStates(prev => prev.filter(s => s !== state));
      setAllowedStates(prev => [...prev, state].sort());
    } else {
      setAllowedStates(prev => prev.filter(s => s !== state));
      setDeniedStates(prev => [...prev, state].sort());
    }
  };

  const subHeaderStyle = "text-xs font-bold uppercase mb-3 tracking-wider";

  return (
    <div className="min-h-[calc(100vh-6rem)] w-full bg-slate-50 flex font-sans text-slate-800 lg:h-[calc(100vh-6rem)] lg:overflow-auto h-auto overflow-auto">
      <main className="flex-1 flex flex-col px-3 py-2 w-full lg:h-full lg:overflow-auto max-w-[1920px] mx-auto">

        {/* TOP BAR */}
        <div className="shrink-0 mb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <h1 className="text-2xl font-semibold text-slate-900 shrink-0">Campaign Configuration</h1>

            <div className="w-full sm:w-64">
              <div className="w-full sm:w-64">
                <Select>
                  <SelectTrigger
                    className="
    w-full 
    h-9 
    bg-white 
    border-1
    shadow-none 
    hover:bg-white 
    focus:ring-0 
    focus:outline-none
  "
                  >
                    <SelectValue placeholder="Select a Campaign" />
                  </SelectTrigger>


                  <SelectContent className="max-h-60 overflow-y-auto">
                    <SelectItem value="CMPSC_WK_8_75">CMPSC_WK_8_75</SelectItem>
                    <SelectItem value="CMPSC_BWSM_8_75">CMPSC_BWSM_8_75</SelectItem>
                    <SelectItem value="CMPSC_MN_8_75">CMPSC_MN_8_75</SelectItem>

                    <SelectItem value="CMPMN_WK_50">CMPMN_WK_50</SelectItem>
                    <SelectItem value="CMPMN_BWSM_50">CMPMN_BWSM_50</SelectItem>
                    <SelectItem value="CMPMN_MN_50">CMPMN_MN_50</SelectItem>

                    <SelectItem value="CMPMI_WK_25">CMPMI_WK_25</SelectItem>
                    <SelectItem value="CMPMI_BWSM_25">CMPMI_BWSM_25</SelectItem>
                    <SelectItem value="CMPMI_MN_25">CMPMI_MN_25</SelectItem>

                    <SelectItem value="CMPIN_WK_21">CMPIN_WK_21</SelectItem>
                    <SelectItem value="CMPIN_BWSM_21">CMPIN_BWSM_21</SelectItem>
                    <SelectItem value="CMPIN_MN_21">CMPIN_MN_21</SelectItem>

                    <SelectItem value="CMPIA_WK_21">CMPIA_WK_21</SelectItem>
                    <SelectItem value="CMPIA_BWSM_21">CMPIA_BWSM_21</SelectItem>
                    <SelectItem value="CMPIA_MN_21">CMPIA_MN_21</SelectItem>

                    <SelectItem value="CMPAR_WK_17">CMPAR_WK_17</SelectItem>
                    <SelectItem value="CMPAR_BWSM_17">CMPAR_BWSM_17</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="flex items-center gap-2 px-3 h-9 bg-indigo-50 border border-indigo-100 rounded-lg shadow-sm w-fit">
              <CompactCheckbox label="Config Active" checked={toggles.configActive} onChange={() => handleToggle('configActive')} />
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <Button
              className="
      h-9 
      px-5 
      bg-green-600 
      hover:bg-green-700 
      text-white 
      text-sm 
      font-medium 
      rounded-md
    "
              onClick={handleSubmit}
            >
              Copy/Update
            </Button>

            <Button
              className="
      h-9 
      px-5 
      bg-white 
      text-red-500 
      hover:bg-red-50 
      border border-red-200 
      hover:border-red-300 
      text-sm 
      font-medium 
      rounded-md
    "
            >
              Cancel
            </Button>
          </div>

        </div>

        {/* MAIN CONTENT GRID */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 grid-rows-auto lg:grid-rows-[auto_1fr] gap-4 min-h-0">

          {/* CARD 1: LOAN VALIDATION RULES - Strengthened Indigo Border */}
          <Card className="col-span-1 md:col-span-2 lg:col-span-5 flex flex-col p-4 shadow-sm border-indigo-200 border-2 shrink-0">
            <div className="flex items-center gap-2 mb-4 shrink-0 border-b border-indigo-50 pb-2">
              <ShieldCheck size={16} className="text-blue-700" />
              <h3 className="font-bold text-blue-700 text-sm uppercase">Applicant Verfication </h3>
            </div>

            {/* Reduced padding (pr-4, px-4) to reduce space between divider and content */}
            <div className="flex flex-col lg:grid lg:auto-cols-(--my-auto-cols) lg:grid-flow-col lg:divide-x divide-slate-100 pb-1 gap-4 lg:gap-0">
              <div className="flex flex-col">
                <div className='flex flex-row'>

                  <h4 className={`${subHeaderStyle} text-blue-600`}> Screening</h4>
                </div>
                <div className="flex flex-col gap-3">
                  <CompactCheckbox label="Deny Military Applicants" checked={toggles.denyMilitary} onChange={() => handleToggle('denyMilitary')} />
                  <CompactCheckbox label="Customer must be employed" checked={toggles.mustBeEmployed} onChange={() => handleToggle('mustBeEmployed')} />
                  <CompactCheckbox label="Must not be in Bankruptcy" checked={toggles.notInBankruptcy} onChange={() => handleToggle('notInBankruptcy')} />
                  <CompactCheckbox label="Check Bad Employer" checked={toggles.checkBadEmployer} onChange={() => handleToggle('checkBadEmployer')} />
                </div>
              </div>

              <div className=" flex flex-col lg:pl-6">
                <h4 className={`${subHeaderStyle} text-purple-600`}> Identity</h4>
                <div className="flex flex-col gap-3">
                  <CompactCheckbox label="Check DL Number" checked={toggles.checkDLNumber} onChange={() => handleToggle('checkDLNumber')} />
                  <CompactCheckbox label="Check DL State" checked={toggles.checkDLState} onChange={() => handleToggle('checkDLState')} />
                  <CompactCheckbox label="Check State" checked={toggles.checkState} onChange={() => handleToggle('checkState')} />
                  <CompactCheckbox label="Check Bad SubAffiliateID" checked={toggles.checkBadSubAffiliateID} onChange={() => handleToggle('checkBadSubAffiliateID')} />
                </div>
              </div>


              <div className=" flex flex-col lg:pl-6">
                <h4 className={`${subHeaderStyle} text-indigo-600`}>Customer Status</h4>
                <div className="flex flex-col gap-3">
                  <CompactCheckbox label="Existing Customer Bypass" checked={toggles.existingCustomerBypass} onChange={() => handleToggle('existingCustomerBypass')} />
                  <CompactCheckbox label="Reject Existing Customer" checked={toggles.rejectExisting} onChange={() => handleToggle('rejectExisting')} />
                  <CompactCheckbox label="Unprocessed Loan Check" checked={toggles.denyUnprocessedLoan} onChange={() => handleToggle('denyUnprocessedLoan')} />
                  <CompactCheckbox label="Bad Loan Status" checked={toggles.badLoanStatus} onChange={() => handleToggle('badLoanStatus')} />
                </div>
              </div>
              <div className="flex flex-col lg:pl-6">
                <h4 className={`${subHeaderStyle} text-emerald-600`}> Banking</h4>
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  <div className="flex flex-col gap-3">
                    <CompactCheckbox label="Must have Direct Deposit" checked={toggles.mustHaveDirectDeposit} onChange={() => handleToggle('mustHaveDirectDeposit')} />
                    <CompactCheckbox label="Must have Checking Account" checked={toggles.mustHaveChecking} onChange={() => handleToggle('mustHaveChecking')} />
                    <CompactCheckbox label="Check Bad ABA" checked={toggles.checkBadABA} onChange={() => handleToggle('checkBadABA')} />
                  </div>
                  <div className="flex flex-col gap-3">
                    <CompactCheckbox label="Valid ABA Screening" checked={toggles.validABAScreening} onChange={() => handleToggle('validABAScreening')} />
                    <CompactCheckbox label="Deny Monthly Paid" checked={toggles.denyMonthlyPaid} onChange={() => handleToggle('denyMonthlyPaid')} />
                    <CompactCheckbox label="Deny Weekly Paid" checked={toggles.denyWeeklyPaid} onChange={() => handleToggle('denyWeeklyPaid')} />
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* ROW 2: Bottom Cards */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 min-h-0 pb-1">

            {/* FINANCIAL CONFIGURATION - Strengthened Orange Border */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-2 flex flex-col p-4 shadow-sm border-orange-200 border-2">
              <div className="flex items-center gap-2 mb-3 shrink-0 border-b border-orange-50 pb-2">
                <Wallet size={16} className="text-orange-600" />
                <h3 className="font-bold text-orange-600 text-sm uppercase">Financial Configuration</h3>
              </div>
              <div className="pr-2">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-3">
                    <div>
                      <InputLabel>Minimum Monthly Salary</InputLabel>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">$</span>
                        <Input
                          className={`h-8 text-xs pl-5 ${isSubmitted && errors.minMonthlySalary ? 'border-red-500' : ''}`}
                          type="number"
                          value={inputs.minMonthlySalary}
                          onChange={(e) => handleInput('minMonthlySalary', e.target.value)}
                        />
                      </div>
                      {isSubmitted && errors.minMonthlySalary && <div className="text-red-500 text-xs mt-1">{errors.minMonthlySalary}</div>}
                    </div>
                    <div>
                      <InputLabel>Maximum Monthly Salary</InputLabel>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">$</span>
                        <Input
                          className={`h-8 text-xs pl-5 ${isSubmitted && errors.maxMonthlySalary ? 'border-red-500' : ''}`}
                          type="number"
                          value={inputs.maxMonthlySalary}
                          onChange={(e) => handleInput('maxMonthlySalary', e.target.value)}
                        />
                      </div>
                      {isSubmitted && errors.maxMonthlySalary && <div className="text-red-500 text-xs mt-1">{errors.maxMonthlySalary}</div>}
                    </div>
                    <div>
                      <InputLabel>Age must be greater than</InputLabel>
                      <Input
                        className={`h-8 text-xs ${isSubmitted && errors.minAge ? 'border-red-500' : ''}`}
                        type="number"
                        value={inputs.minAge}
                        onChange={(e) => handleInput('minAge', e.target.value)}
                      />
                      {isSubmitted && errors.minAge && <div className="text-red-500 text-xs mt-1">{errors.minAge}</div>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <InputLabel>A/c length cannot Exceed</InputLabel>
                      <Input
                        className={`h-8 text-xs ${isSubmitted && errors.acLengthMax ? 'border-red-500' : ''}`}
                        type="number"
                        value={inputs.acLengthMax}
                        onChange={(e) => handleInput('acLengthMax', e.target.value)}
                      />
                      {isSubmitted && errors.acLengthMax && <div className="text-red-500 text-xs mt-1">{errors.acLengthMax}</div>}
                    </div>
                    <div>
                      <InputLabel>Payment Count</InputLabel>
                      <Input
                        className={`h-8 text-xs ${isSubmitted && errors.paymentCount ? 'border-red-500' : ''}`}
                        type="number"
                        value={inputs.paymentCount}
                        onChange={(e) => handleInput('paymentCount', e.target.value)}
                      />
                      {isSubmitted && errors.paymentCount && <div className="text-red-500 text-xs mt-1">{errors.paymentCount}</div>}
                    </div>
                    <div>
                      <InputLabel>Rejected loan in the last (Days)</InputLabel>
                      <Input
                        className={`h-8 text-xs ${isSubmitted && errors.rejectedLoanDays ? 'border-red-500' : ''}`}
                        type="number"
                        value={inputs.rejectedLoanDays}
                        onChange={(e) => handleInput('rejectedLoanDays', e.target.value)}
                      />
                      {isSubmitted && errors.rejectedLoanDays && <div className="text-red-500 text-xs mt-1">{errors.rejectedLoanDays}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 shrink-0">
                <CompactCheckbox label="Allow Active Customers" checked={toggles.allowActiveCustomers} onChange={() => handleToggle('allowActiveCustomers')} />
              </div>
            </Card>

            {/* GEOGRAPHIC RULES - Strengthened Teal Border */}
            <Card className="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col p-4 shadow-sm border-teal-200 border-2 min-h-0">
              <div className="flex items-center gap-2 mb-3 shrink-0 border-b border-teal-50 pb-2">
                <Map size={16} className="text-teal-700" />
                <h3 className="font-bold text-teal-700 text-sm uppercase">States</h3>
              </div>
              <div className="flex-1 flex gap-4 min-h-0">
                <div className="flex-1 flex flex-col rounded-xl border border-teal-100 bg-teal-50/20 overflow-hidden">
                  <div className="bg-white/80 px-3 py-1.5 border-b border-teal-100 flex items-center justify-between shrink-0">
                    <span className="block text-[10px] font-bold text-teal-500 uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Allowed</span>
                    <span className="text-[9px] font-bold bg-white border border-teal-100 text-teal-700 px-1.5 rounded-md">{allowedStates.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {allowedStates.map(state => (
                      <button key={state} onClick={() => moveState(state, false)} className="w-full bg-white border border-teal-50/50 rounded-lg px-2.5 py-1.5 shadow-sm text-left flex items-center gap-2.5 hover:border-rose-300 group transition-all">
                        <GripVertical size={11} className="text-teal-200 group-hover:text-rose-300" />
                        <span className="text-[11px] font-medium text-slate-700">{state}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
                  <div className="bg-white/80 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between shrink-0">
                    <span className="block text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Restricted</span>
                    <span className="text-[9px] font-bold bg-white border border-slate-200 text-slate-600 px-1.5 rounded-md">{deniedStates.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {deniedStates.map(state => (
                      <button key={state} onClick={() => moveState(state, true)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm text-left flex items-center gap-2.5 hover:border-teal-300 group transition-all">
                        <GripVertical size={11} className="text-slate-300 group-hover:text-teal-300" />
                        <span className="text-[11px] font-medium text-slate-600">{state}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }

        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default App;
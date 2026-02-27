import { useState, useEffect } from 'react';
import { Button } from "@/features/AddLeads/Components/ui/button";
import { Card, CardContent } from "@/features/AddLeads/Components/ui/card";
import { Separator } from "@/features/AddLeads/Components/ui/separator";
import { Label } from "@/features/AddLeads/Components/ui/label";
import { Input as ShadcnInput } from "@/features/AddLeads/Components/ui/input";
import { SelectField, CheckboxField } from '../Components/FormField';
import { addLeadsService } from '../Services/addleadsService';
import { FREQUENCY_MAP, formatPhone, formatSSN, runRandomGenerator } from '../Components/PayrollUtils';
import { CustomerInformation } from '../Components/CustomerInformation';
import { EmployerInformation } from '../Components/EmployerInformation';
import { BankInformation } from '../Components/BankInformation';
import { VehicleInformation } from '../Components/VehicleInformation';
import { ReferenceInformation } from '../Components/ReferenceInformation';
//import { useNavigate } from 'react-router-dom';
import { useAddLeadsLogic } from '../Components/useAddLeadsLogic';

export default function AddLeadsPage() {
  const {
    form, errors, states, cities, zipcodes, languages, paydayMode, setEmpCities, setEmpZips, empCities, empZips, howPaidOptions, isCheckingSSN, isAuthenticating, employerCount, setPaydayMode, setHowPaidOptions, setEmployerCount, setCities, setZipcodes, setLanguages, updateField, handleCheckSSN, handleSubmit, setForm, setErrors, setStates, handleGetCampaign, isVinModalOpen, handleGetVinInfo, isFetchingVin, applyVinInfo, setIsVinModalOpen, vinInfo, eighteenYearsAgo
  } = useAddLeadsLogic();
  // const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  // --- RANDOM DATA GENERATOR ---
  const generateRandomData = () => {
    runRandomGenerator(
      form, employerCount, states, languages, addLeadsService.getLoanAmountOptions(), setForm, setPaydayMode, setHowPaidOptions, setErrors, setCities, setZipcodes, setEmpCities,
      setEmpZips
    );

  };

  useEffect(() => {
    const init = async () => {
      try {
        const [s, l, ip] = await Promise.all([
          addLeadsService.getStates(),
          addLeadsService.getLanguages(),
          addLeadsService.getIp()
        ]);
        // 1. Handle States
        const stateData = s.res?.NewDataSet?.Table || [];
        setStates(Array.isArray(stateData) ? stateData : [stateData]);
        // 2. Handle Languages (Matching Angular data path)
        const langData = l.res?.NewDataSet?.Table || [];
        const langArray = Array.isArray(langData) ? langData : [langData];
        setLanguages(langArray);
        setForm((prev: any) => ({ ...prev, IPaddress: ip }));
        console.log("System IP assigned to form:", ip);
      } catch (e) {
        console.error("API Error during initialization", e);
      }
    };
    init();
  }, []);
  // --- 3. CORE LOGIC HANDLERS ---
  const handleFrequencyChange = (val: string, index: number) => {
    const sfx = index === 0 ? '' : index;
    updateField('Frequency' + sfx, val);
    setHowPaidOptions(prev => ({
      ...prev,
      [index]: FREQUENCY_MAP[val] || []
    }));
    setPaydayMode(prev => ({
      ...prev,
      [index]: ''
    }));
    [
      'HowPaid', 'LastPayDate', 'NextPayDate', 'SecondPayDate', 'FirstPaymentDate', 'DayOfWeek', 'DayOfWeek1', 'DayOfWeek2', 'PayWeek1', 'PayWeek2', 'SemiMonthlyPayDay01', 'SemiMonthlyPayDay02', 'MonthlyPayDay'
    ].forEach(f => updateField(f + sfx, ''));
  };
  const handleHowPaidSelect = (label: string, index: number) => {
    const sfx = index === 0 ? '' : index;
    const selected = howPaidOptions[index]?.find(o => o.label === label);
    updateField('HowPaid' + sfx, label);
    if (selected) {
      setPaydayMode(prev => ({
        ...prev,
        [index]: selected.mode
      }));
    }
    ['LastPayDate', 'NextPayDate', 'SecondPayDate', 'FirstPaymentDate']
      .forEach(f => updateField(f + sfx, ''));
  };

  // Handler for Employment State change
  const handleEmpStateChange = async (stateName: string, index: number) => {
    const sfx = index === 0 ? "" : index.toString();
    const selected = states.find(s => s.StateName === stateName);
    if (selected) {
      // 1. Update form with Short Code
      updateField('EmployerState' + sfx, selected.StateShortCode);
      // 2. Reset City and Zip for this employer
      updateField('EmployerCity' + sfx, '');
      updateField('EmployerZip' + sfx, '');
      // 3. Fetch Cities
      try {
        const data = await addLeadsService.getCities(stateName);
        setEmpCities(prev => ({ ...prev, [index]: Array.isArray(data) ? data : [data] }));
        setEmpZips(prev => ({ ...prev, [index]: [] })); // Clear zips
      } catch (e) {
        console.error("Emp City API Error", e);
      }
    }
  };
  // Handler for Employment City change
  const handleEmpCityChange = async (cityName: string, index: number) => {
    const sfx = index === 0 ? "" : index.toString();
    updateField('EmployerCity' + sfx, cityName);
    updateField('EmployerZip' + sfx, '');
    // Find the full state name used for this specific employer
    const stateShortCode = form['EmployerState' + sfx];
    const stateName = states.find(s => s.StateShortCode === stateShortCode)?.StateName;
    if (cityName && stateName) {
      const query = `${stateName},${cityName}`;
      try {
        const data = await addLeadsService.getZips(query);
        setEmpZips(prev => ({ ...prev, [index]: Array.isArray(data) ? data : [data] }));
      } catch (e) {
        console.error("Emp Zip API Error", e);
      }
    }
  };
  const [selectedStateName, setSelectedStateName] = useState("");
  const handleStateChange = async (stateName: string) => {
    // 1. Find the state object by full name
    const selected = states.find(s => s.StateName === stateName);
    if (selected) {
      // 2. Update form with Short Code for DB/API
      updateField('State', selected.StateShortCode);
      // 3. Keep full name for City/Zip query context
      setSelectedStateName(stateName);
      // 4. Reset downstream fields
      updateField('City', '');
      updateField('Zip', '');
      setCities([]);
      setZipcodes([]);
      // 5. Fetch Cities
      try {
        const cityData = await addLeadsService.getCities(stateName);
        const cityArray = Array.isArray(cityData) ? cityData : [cityData];
        setCities(cityArray);
      } catch (e) {
        console.error("Failed to load cities", e);
      }
    }
  };
  const handleCityChange = async (cityName: string) => {
    // 1. Update the form state immediately
    updateField('City', cityName);
    // 2. Clear current Zip selection and list
    updateField('Zip', '');
    setZipcodes([]);
    if (cityName && selectedStateName) {
      // 3. Build query: "Florida,Miami"
      const query = `${selectedStateName},${cityName}`;
      try {
        const zipData = await addLeadsService.getZips(query);
        setZipcodes(zipData);
      } catch (e) {
        console.error("Failed to load zip codes", e);
      }
    }
  };
  return (
    <div className="min-h-screen py-4 px-2 md:py-8 md:px-4 bg-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto">
        <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
          <CardContent className="pt-4 px-3 pb-6 md:p-12">
            {/* PAGE HEADER */}
            {/* 1. Changed items-center to items-start to align with the main heading */}
            <div className="mb-8 border-b border-slate-100 pb-6 flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Add Leads</h1>
                <p className="text-slate-400 mt-1 font-medium text-xs md:text-base">Repave LMS Internal Portal</p>
              </div>

              {/* 2. Responsive width and font size logic for the button */}
              <Button
                onClick={generateRandomData}
                className="mt-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all font-bold shadow-none
                   px-2 md:px-6             /* Tiny padding on mobile, wide on desktop */
                   h-8 md:h-10              /* Shorter height on mobile */
                   text-[10px] md:text-sm   /* Small font on mobile */
                   flex items-center"
              >
                <span className="material-symbols-outlined text-sm md:text-base mr-1 md:mr-2">bolt</span>

                {/* 3. Text logic: Show short text on mobile, full text on desktop */}
                <span className="inline sm:hidden">Auto-Generate</span>
                <span className="hidden sm:inline">Auto-Generate Data</span>
              </Button>
            </div>
            {/* TOP CONTROLS: LOAN TYPE & SSN SEARCH */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-end">
              <div className="md:col-span-3">
                <SelectField
                  label="Select Loan Type"
                  value={form.LoanType}
                  id="LoanType"
                  error={errors.LoanType}
                  options={["CAB/CSO", "Auto Title", "Line of Credit", "Installment", "Pay Day"]}
                  onValueChange={(v) => updateField('LoanType', v)}
                />
              </div>
              <div className="md:col-span-3 pb-2">
                {form.LoanType === 'CAB/CSO' && (
                  <div className="animate-in slide-in-from-top-1 duration-300">
                    <Label className="block text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Is Autotitle</Label>
                    <div className="flex space-x-6">
                      <CheckboxField label="Yes" id="aty" checked={form.isAutoTitle === 'Y'} onCheckedChange={() => updateField('isAutoTitle', 'Y')} />
                      <CheckboxField label="No" id="atn" checked={form.isAutoTitle === 'N'} onCheckedChange={() => updateField('isAutoTitle', 'N')} />
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-6">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">SSN / ITIN Search</Label>
                <div className="flex gap-3">
                  <ShadcnInput
                    value={formatSSN(form.SSN)}
                    onChange={(e) => updateField('SSN', e.target.value)}
                    maxLength={11}
                    className={`custom-input border-none rounded-r-none !h-11 ${errors.SSN ? 'ring-1 ring-red-500' : 'bg-slate-50 ring-1 ring-slate-200'}`}
                    placeholder="000-00-0000"
                  />
                  <Button
                    onClick={handleCheckSSN}
                    variant="outline"
                    className="h-[44px] px-6 bg-slate-50 shadow-sm border-b-2 rounded-l-md rounded-r-md  "  >
                    {isCheckingSSN ? (
                      <>
                        <span className="animate-spin ">⏳</span>
                        Checking...
                      </>) : (
                      <>
                        <i className="fa fa-search "></i>
                        Find
                      </>
                    )}
                  </Button>
                </div>
                {errors.SSN && <p className="text-[10px] text-red-500 font-medium mt-1">*{errors.SSN}</p>}
              </div>
            </div>
            <Separator className="my-12 bg-slate-100" />
            {/* MODULAR FORM SECTIONS */}
            <CustomerInformation
              form={form}
              errors={errors}
              updateField={updateField}
              states={states}
              cities={cities}
              zipcodes={zipcodes}
              languages={languages}
              eighteenYearsAgo={eighteenYearsAgo}
              handleStateChange={handleStateChange}
              handleCityChange={handleCityChange}
              formatPhone={formatPhone}
            />
            <EmployerInformation
              form={form}
              errors={errors}
              updateField={updateField}
              paydayMode={paydayMode}
              howPaidOptions={howPaidOptions}
              handleFrequencyChange={handleFrequencyChange}
              handleHowPaidSelect={handleHowPaidSelect}
              formatPhone={formatPhone}
              states={states}
              employerCount={employerCount}
              setEmployerCount={setEmployerCount}
              empCities={empCities}
              empZips={empZips}
              handleEmpStateChange={handleEmpStateChange}
              handleEmpCityChange={handleEmpCityChange}
            />
            <BankInformation
              form={form}
              errors={errors}
              updateField={updateField}
              handleGetCampaign={handleGetCampaign}
            />
            <VehicleInformation
              form={form}
              errors={errors}
              updateField={updateField}
              handleGetVinInfo={handleGetVinInfo}
              vinInfo={vinInfo}
              isVinModalOpen={isVinModalOpen}
              setIsVinModalOpen={setIsVinModalOpen}
              isFetchingVin={isFetchingVin}
              applyVinInfo={applyVinInfo}
            />
            <ReferenceInformation
              form={form} errors={errors} updateField={updateField} formatPhone={formatPhone}
            />
            {/* ADDITIONAL INFORMATION: MILITARY STATUS */}
            <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-blue-500 mr-3">military_tech</span>
                <Label className="text-sm font-medium text-slate-700">Claimed as a dependent by active military?</Label>
              </div>
              <div className="bg-white px-6 py-2 rounded-lg border border-slate-200 flex space-x-8 mt-4 md:mt-0">
                <CheckboxField label="Yes" id="mil-y" checked={form.militarymem === '1'} onCheckedChange={() => updateField('militarymem', '1')} />
                <CheckboxField label="No" id="mil-n" checked={form.militarymem === '0'} onCheckedChange={() => updateField('militarymem', '0')} />
              </div>
            </div>
            {/* FOOTER ACTIONS */}
            <div className="flex flex-col md:flex-row justify-end pt-8 gap-3 border-t border-slate-100">
              <Button
                onClick={handleSubmit}
                disabled={isAuthenticating} // Add this line
                className="bg-white text-emerald-600 border border-slate-200 border-b-2 border-b-slate-300 hover:bg-emerald-50 px-10 h-11 font-bold rounded-lg shadow-none">
                {isAuthenticating ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span> Processing...
                  </>) : (
                  <>
                    <span className="material-symbols-outlined mr-2">save</span> Submit Lead
                  </>
                )}
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="text-red-500 border-slate-200 border-b-2 border-b-slate-300 px-10 h-11 font-bold rounded-lg shadow-none"  >
                <span className="material-symbols-outlined mr-2">undo</span> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
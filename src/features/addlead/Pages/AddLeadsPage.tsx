import { useState, useEffect } from 'react';
import { Zap, Award, Save, RotateCcw, Loader2 } from 'lucide-react';

import { SelectField, CheckboxField, Input as FormInput } from '../Components/FormField';
import { addLeadsService, getCampaignType } from '../Services/addleadsService';
import { FREQUENCY_MAP, calculateNextPayday, formatPhone, formatSSN, scrollToError, isAllowedDay } from '../Components/PayrollUtils';
import { CustomerInformation, validateCustomer } from '../Components/CustomerInformation';
import { EmployerInformation, validateEmployer } from '../Components/EmployerInformation';
import { BankInformation, validateBank } from '../Components/BankInformation';
import { VehicleInformation, validateVehicle } from '../Components/VehicleInformation';
import { ReferenceInformation, validateReference } from '../Components/ReferenceInformation';
import {  addDays } from 'date-fns'; // Added addDays here
import Card from '@/shared/components/ui/card';
import { Button } from '../Components/ui/button';
import { Label } from '../Components/ui/label';

import { generateXML } from '../helper/xmlformat';
import { toast } from 'sonner';
import { useCampaignDetailsForInternalLeads } from '../hooks/useGetCampaign';
import { useFindCustomerDetails } from '../hooks/useCheckSSN';
import CustomModal from '../Components/customModal';
import { parseAPIDate } from '../helper/dateFromat';

export default function AddLeadsPage() {
  // --- 1. GLOBAL STATE ---
  const defaultLanguage = "English"; // default selected

  const [form, setForm] = useState<any>({
    LoanType: '', isAutoTitle: 'N', SSN: '', FirstName: '', LastName: '',
    Email: '', DOB: '', homestatus: '1', militarymem: '0',
    ReceivePaycheck: 'D', AccountType: 'C', IsOptInForSMS: '1', Language: defaultLanguage,
    PromotionalDNDCheck: '0', DLState: '', License: '', LoanAmount: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [states, setStates] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [paydayMode, setPaydayMode] = useState<Record<number, string>>({});
  const [howPaidOptions, setHowPaidOptions] = useState<Record<number, any[]>>({});
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [employerCount, setEmployerCount] = useState(1);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  // --- RANDOM DATA GENERATOR ---
  const campaignType = getCampaignType(form.LoanType);
  const [existingCustomer, setExistingCustomer] = useState<{
    ssn: string;
    name: string;
  } | null>(null);

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const {
    refetch: fetchCampaignDetails,
  } = useCampaignDetailsForInternalLeads(
    "ADD",        // LeadFrom
    0,            // LoanID
    campaignType  // Type (A/L/I/P/C)
  );
  const {
    refetch: fetchCustomerDetails,
    isFetching: isCustomerLoading,
  } = useFindCustomerDetails(
    form.SSN?.replace(/\D/g, "") // pass clean SSN
  );

  const generateRandomData = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstNames = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
    const otherIncomeExamples = ["VA Benefits", "Rental Income", "Alimony", "Trust Fund", "Investment"];
    const companies = ["Tech Solutions", "Global Logistics", "Peak Retail", "Standard Industries", "Apex Corp"];

    // 1. Pick Loan Type and Auto Title Flag
    const loanTypes = ["CAB/CSO", "Auto Title", "Line of Credit", "Installment", "Pay Day"];
    const selectedLoan = loanTypes[Math.floor(Math.random() * loanTypes.length)];
    let autoTitleFlag = 'N';
    if (selectedLoan === "Auto Title") {
      autoTitleFlag = 'Y';
    } else if (selectedLoan === "CAB/CSO") {
      autoTitleFlag = Math.random() > 0.5 ? 'Y' : 'N';
    }


    const findFirstValidDate = (rulesForm: any, mode: string) => {
      let temp = addDays(today, 1);
      for (let i = 0; i < 60; i++) {
        if (isAllowedDay(temp, rulesForm, mode)) {
          const day = temp.getDay();
          if (day === 6) return addDays(temp, 2);
          if (day === 0) return addDays(temp, 1);
          return temp;
        }
        temp = addDays(temp, 1);
      }
      return today;
    };

    const actualLoanOptions = addLeadsService.getLoanAmountOptions();
    const randomLoanLabel = actualLoanOptions[Math.floor(Math.random() * actualLoanOptions.length)].label;

    // Initial Form with Customer and Bank Data
    let newForm: any = {
      ...form,
      LoanType: selectedLoan,
      isAutoTitle: autoTitleFlag,
      SSN: Math.floor(100000000 + Math.random() * 900000000).toString(),
      FirstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      LastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      Email: `user${Math.floor(Math.random() * 999)}@example.com`,
      DOB: new Date(today.getFullYear() - 25, 5, 15).toISOString(),
      HomePhone: "444" + Math.floor(1000000 + Math.random() * 8999999).toString(),
      MobilePhone: "555" + Math.floor(1000000 + Math.random() * 8999999).toString(),
      CustomerStatus: Math.random() > 0.5 ? "N" : "R",
      Address: Math.floor(Math.random() * 999) + " Maple Street",
      State: states[0]?.StateShortCode || "TX",
      City: "Dallas",
      Zip: "75201",
      AtAddressSince: addDays(today, -1000).toISOString(),
      DLState: "TX",
      License: "DL" + Math.floor(1000000 + Math.random() * 9000000),
      LoanAmount: randomLoanLabel,
      Language: languages[0]?.LanguageName || "English",
      homestatus: "1",
      militarymem: "0",
      AbaNumber: Math.floor(100000000 + Math.random() * 9000000).toString(),
      AccountNumber: Math.floor(1000000000 + Math.random() * 899999999).toString(),
      AccountDate: addDays(today, -800).toISOString(),
      AccountType: "C",
      RefFirstName1: firstNames[0],
      RefLastName1: lastNames[0],
      RefRelation1: "Friend",
      RefPhone1: "5551112222",
      RefEmail1: "ref1@test.com",
      RefFirstName2: firstNames[1],
      RefLastName2: lastNames[1],
      RefRelation2: "Sibling",
      RefPhone2: "5553334444",
      RefEmail2: "ref2@test.com",
    };

    let newModes: Record<number, string> = {};
    let newOptions: Record<number, any[]> = {};

    // 2. Loop through ALL open Employer forms (1, 2, or 3)
    for (let i = 0; i < employerCount; i++) {
      const sfx = i === 0 ? "" : i.toString();

      // Randomize Employment Type & Income
      const empType = ["Full-Time", "Part-Time", "Other"][Math.floor(Math.random() * 3)];
      const incomePool = ["Employed", "Self-employed", "Retirement", "Disability", "Social Security", "Other"];
      const filteredIncomePool = empType === "Other" ? incomePool.filter(opt => opt !== "Employed") : incomePool;
      const randIncome = filteredIncomePool[Math.floor(Math.random() * filteredIncomePool.length)];

      newForm['EmploymentType' + sfx] = empType;
      newForm['SourceIncome' + sfx] = randIncome;
      if (randIncome === "Other") {
        // This maps the random string to 'OtherIncomeType' or 'OtherIncomeType1', etc.
        newForm['OtherIncomeType' + sfx] = otherIncomeExamples[Math.floor(Math.random() * otherIncomeExamples.length)];
      } else {
        // Clear it if the random selection is NOT 'Other'
        newForm['OtherIncomeType' + sfx] = '';
      }
      if (randIncome === "Employed") {
        newForm['EmployerName' + sfx] = companies[Math.floor(Math.random() * companies.length)];
        newForm['JobTitle' + sfx] = "Specialist";
        newForm['WorkPhone' + sfx] = "333" + Math.floor(1000000 + Math.random() * 8999999);
        newForm['EmployerState' + sfx] = "TX";
        newForm['EmployerCity' + sfx] = "Austin";
        newForm['EmployerZip' + sfx] = "73301";
        newForm['EmpStartDate' + sfx] = addDays(today, -1500).toISOString();
      }

      if (randIncome === "Other") {
        newForm['OtherIncomeType' + sfx] = otherIncomeExamples[Math.floor(Math.random() * otherIncomeExamples.length)];
      }

      // Payroll Logic Randomization
      const freqs = Object.keys(FREQUENCY_MAP);
      const randFreq = freqs[Math.floor(Math.random() * freqs.length)];
      const paidOptions = FREQUENCY_MAP[randFreq];
      const randPaidObj = paidOptions[Math.floor(Math.random() * paidOptions.length)];

      newOptions[i] = paidOptions;
      newModes[i] = randPaidObj.mode;

      newForm['Frequency' + sfx] = randFreq;
      newForm['HowPaid' + sfx] = randPaidObj.label;
      newForm['GrossPay' + sfx] = (Math.floor(Math.random() * 3000) + 1000).toString();
      newForm['ReceivePaycheck' + sfx] = "D";

      // Sub-field rules
      if (randPaidObj.mode === 'day_of_week') newForm['DayOfWeek' + sfx] = "MONDAY";
      if (randPaidObj.mode === 'semi_dates') {
        newForm['SemiMonthlyPayDay01' + sfx] = "1";
        newForm['SemiMonthlyPayDay02' + sfx] = "15";
      }
      if (randPaidObj.mode === 'semi_weeks') {
        newForm['PayWeek1' + sfx] = "First";
        newForm['DayOfWeek1' + sfx] = "MONDAY";
        newForm['PayWeek2' + sfx] = "Third";
        newForm['DayOfWeek2' + sfx] = "FRIDAY";
      }
      if (randPaidObj.mode === 'monthly_date') newForm['MonthlyPayDay' + sfx] = "1";
      if (randPaidObj.mode === 'monthly_week') {
        newForm['PayWeek1' + sfx] = "First";
        newForm['DayOfWeek' + sfx] = "MONDAY";
      }

      // Date math for this specific employer
      // Create a temporary context so the scanner can see Frequency/HowPaid for this suffix
      const tempContext = { ...newForm, Frequency: randFreq, HowPaid: randPaidObj.label };
      const logicalNPD = findFirstValidDate(tempContext, randPaidObj.mode);
      const logicalSPD = calculateNextPayday(logicalNPD, tempContext, randPaidObj.mode);

      // Apply the weekend check to LastPayDate
      let lastPay = addDays(today, -3);
      if (lastPay.getDay() === 6) lastPay = addDays(lastPay, -1);
      if (lastPay.getDay() === 0) lastPay = addDays(lastPay, -2);

      newForm['LastPayDate' + sfx] = lastPay.toISOString();
      newForm['NextPayDate' + sfx] = logicalNPD.toISOString();
      if (logicalSPD) newForm['SecondPayDate' + sfx] = logicalSPD.toISOString();
      newForm['FirstPaymentDate' + sfx] = logicalNPD.toISOString();
    }

    // 3. Vehicle Info
    if (autoTitleFlag === 'Y') {
      newForm.vehYear = "2022";
      newForm.vehMake = "Toyota";
      newForm.vehModel = "Camry";
      newForm.vehNumber = "VN-" + Math.floor(100000 + Math.random() * 899999);
      newForm.vehOwner = newForm.FirstName + " " + newForm.LastName;
      newForm.vin = "1B7DH52X" + Math.random().toString(36).substring(2, 11).toUpperCase();
      newForm.chaseNumber = "CH-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      newForm.insuranceNumber = "POL-" + Math.floor(10000000 + Math.random() * 89999999);
      newForm.expDate = addDays(today, 500).toISOString();
      newForm.mileage = "45000";
      newForm.paidOff = "Y";
      newForm.certTitle = "T-9988";
      newForm.licensePlate = "ABC-1234";
    } else {
      // Reset vehicle fields
      ["vin", "vehYear", "vehMake", "vehModel", "licensePlate", "expDate", "vehNumber", "vehOwner", "chaseNumber", "insuranceNumber", "mileage", "certTitle"].forEach(k => newForm[k] = '');
      newForm.paidOff = 'N';
    }

    // 4. Update states
    setPaydayMode(newModes);
    setHowPaidOptions(newOptions);
    setForm(newForm);
    setErrors({});
  };
  useEffect(() => {
    const init = async () => {
      try {
        const [s, l] = await Promise.all([
          addLeadsService.getStates(),
          addLeadsService.getLanguages()
        ]);
        setStates(s.NewDataSet?.Table || []);
        setLanguages(l.NewDataSet?.PreferredLanguages || []);
      } catch (e) {
        console.error("API Error during initialization");
      }
    };
    init();
  }, []);
  // --- 3. CORE LOGIC HANDLERS ---
  // --- 3. CORE LOGIC HANDLERS ---
  const updateField = (name: string, value: any) => {
    // Helper to shift calculated weekend dates to Monday
    const adjustToMonday = (date: Date | null) => {
      if (!date) return null;
      const day = date.getDay();
      if (day === 6) return addDays(date, 2); // Saturday -> Monday
      if (day === 0) return addDays(date, 1); // Sunday -> Monday
      return date;
    };

    setForm((prev: any) => {
      let newForm = { ...prev, [name]: value };

      // Handle Automatic Second Pay Date Calculation for ALL employers
      if (name.startsWith('NextPayDate') && value) {
        const sfx = name.replace('NextPayDate', ''); // Gets "", "1", "2"
        const index = sfx === '' ? 0 : parseInt(sfx);
        const npd = new Date(value);

        // Create context so calculateNextPayday sees Frequency instead of Frequency1
        const employerContext = {
          ...newForm,
          Frequency: newForm['Frequency' + sfx],
          HowPaid: newForm['HowPaid' + sfx],
          DayOfWeek: newForm['DayOfWeek' + sfx],
          PayWeek1: newForm['PayWeek1' + sfx],
          PayWeek2: newForm['PayWeek2' + sfx],
          DayOfWeek1: newForm['DayOfWeek1' + sfx],
          DayOfWeek2: newForm['DayOfWeek2' + sfx],
          SemiMonthlyPayDay01: newForm['SemiMonthlyPayDay01' + sfx],
          SemiMonthlyPayDay02: newForm['SemiMonthlyPayDay02' + sfx],
          MonthlyPayDay: newForm['MonthlyPayDay' + sfx],
        };

        const rawSpd = calculateNextPayday(
          npd,
          employerContext,
          paydayMode[index]
        );

        // ADJUST TO MONDAY: Ensure automatic selection respects the weekend rule
        const adjustedSpd = adjustToMonday(rawSpd);

        if (adjustedSpd) {
          newForm['SecondPayDate' + sfx] = adjustedSpd.toISOString();
        }
      }
      return newForm;
    });

    // Clear error using functional update to prevent race conditions
    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      }
      return prevErrors;
    });
  };
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
      'HowPaid',
      'LastPayDate',
      'NextPayDate',
      'SecondPayDate',
      'FirstPaymentDate',
      'DayOfWeek',
      'DayOfWeek1',
      'DayOfWeek2',
      'PayWeek1',
      'PayWeek2',
      'SemiMonthlyPayDay01',
      'SemiMonthlyPayDay02',
      'MonthlyPayDay'
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


  // --- 4. MASTER VALIDATION ENGINE ---
  const validateForm = () => {
    // Collect errors from modular validation functions in child components
    const allErrors = {
      ...validateCustomer(form, eighteenYearsAgo),
      ...validateEmployer(form, paydayMode, employerCount),
      ...validateBank(form),
      ...validateVehicle(form),
      ...validateReference(form)
    };
    // Header logic validation (Loan Type & SSN)
    if (!form.LoanType) allErrors.LoanType = "Loan Type is required";
    if (!form.SSN || form.SSN.replace(/\D/g, '').length < 9) {
      allErrors.SSN = "Valid 9-digit SSN is required";
    }
    setErrors(allErrors);
    // If errors exist, scroll to the first one found
    const firstError = Object.keys(allErrors)[0];
    if (firstError) {
      scrollToError(firstError);
      return false;
    }
    return true;
  };



  const handleSubmit = async () => {
    const isFormValid = validateForm();
    if (!isFormValid) return;

    try {
      // 1️⃣ Fetch campaign
      const campaignRes = await fetchCampaignDetails();
      const campaign = campaignRes?.data?.Table?.[0];

      if (!campaign?.CampaignName) {
        toast.error("Invalid campaign details");
        return;
      }

      // 2️⃣ Fetch customer details using SSN
      const customerRes = await fetchCustomerDetails();
      const customerTable = customerRes?.data?.Table || [];

      if (customerTable.length > 0) {
        const customer = customerTable[0];
        const customerName = `${customer.CUST_FIRSTNAME} ${customer.CUST_LASTNAME}`;
        const ssn = customer.CUST_SSN;

        setExistingCustomer({ ssn, name: customerName });
        setShowCustomerModal(true);
        return; // wait for user to confirm
      }

      // Continue only if campaign is valid
      const xmlData = generateXML(form);
      console.log("Request XML:", xmlData);

      const res = await addLeadsService.postLead(xmlData);

      if (!res) {
        toast.error("No response from server");
        return;
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(res, "text/xml");

      const success =
        xmlDoc.getElementsByTagName("Success")[0]?.textContent === "1";

      const messageDescription =
        xmlDoc.getElementsByTagName("MessageDescription")[0]?.textContent ||
        "Something went wrong. Please try again.";

      success
        ? toast.success("Lead Posted Successfully!")
        : toast.error(messageDescription);

    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };


  const populateFormWithCustomerDetails = (response: any) => {
    const customer = response.Table?.[0];     // main customer info
    const employer = response.Table1?.[0];    // employer info
    const bank = response.Table2?.[0];        // bank info
    const references = response.Table3 || []; // array of references
    const loanTable = response.Table4?.[0];   // loan info
    const vehicle = response.Table6?.[0];     // vehicle info

    if (!customer) return;
    const selectedState = states?.find((s: any) => Number(s.StateID) === Number(customer.CUST_STATEID));
    const selectedDLState = states?.find((s: any) => Number(s.StateID) === Number(customer.CUST_DL_STATEID));

    setForm((prev: any) => ({
      ...prev,

      // --- Customer Info ---
      FirstName: customer.CUST_FIRSTNAME || "",
      LastName: customer.CUST_LASTNAME || "",
      SSN: customer.CUST_SSN || "",
      Email: customer.CUST_EMAIL || "",
      DOB: customer.CUST_DOB ? new Date(customer.CUST_DOB).toISOString() : "",
      HomePhone: customer.CUST_HOMEPHONE || "",
      MobilePhone: customer.CUST_MOBILEPHONE || "",
      Address: customer.CUST_ADDRESS || "",
      State: selectedState ? selectedState.StateName : (customer.CUST_STATE || customer.CUST_STATEID || ""),
      City: customer.CUST_CITY || "",
      Zip: customer.CUST_Zip ? String(customer.CUST_Zip) : "",
      homestatus: customer.CUST_HOMESTATUS?.toString() || "1",
      AtAddressSince: customer.CUST_ATCURADDRESSSINCE || "",
      Language: customer.PreferredLanguage || prev.Language,

      // --- License & Loan Info ---
      DLState: selectedDLState ? selectedDLState.StateName : (customer.CUST_DL_STATE || customer.CUST_DL_STATEID || ""),
      License: customer.CUST_DL_NUMBER || "",
      LoanAmount: loanTable?.LoanAmount !== undefined ? `${Number(loanTable.LoanAmount).toFixed(2)}` : (prev.LoanAmount || ""),

      // --- Employer Info (first employer only) ---
      EmploymentType: employer?.EMP_JOBTYPE || "",
      EmployerName: employer?.EMP_EMP_NAME || "",
      JobTitle: employer?.EMP_JOBTITLE || "",
      WorkPhone: employer?.EMP_WORKPHONE || "",
      EmployerState: employer?.EMP_STATEID || "",
      EmployerCity: employer?.EMP_CITY || "",
      EmployerZip: employer?.EMP_Zip || "",
      Frequency: employer?.EMP_FREQUNCY || "",
      HowPaid: employer?.EMP_PERIODICITY || "",
      GrossPay: employer?.EMP_GROSSINCOME || "",
      ReceivePaycheck: employer?.EMP_PAYCHECK || "",
      LastPayDate: parseAPIDate(employer?.EMP_LASTPAYDAY),
      NextPayDate: parseAPIDate(employer?.EMP_NEXTPAYDATE),
      SecondPayDate: parseAPIDate(employer?.EMP_SECONDPAYDATE),

      // --- Bank Info ---
      AbaNumber: bank?.BANK_ABA || "",
      AccountNumber: bank?.BANK_ACC_NO || "",
      AccountType: bank?.BANK_ACC_TYPE || "",

      // --- Reference Info ---
      RefFirstName1: references[0]?.REF_FIRSTNAME || "",
      RefLastName1: references[0]?.REF_LASTNAME || "",
      RefRelation1: references[0]?.REF_RELATION || "",
      RefPhone1: references[0]?.REF_MOBILENUMBER || references[0]?.REF_HOMEPHONE || "",
      RefEmail1: references[0]?.REF_EMAIL || "",

      RefFirstName2: references[1]?.REF_FIRSTNAME || "",
      RefLastName2: references[1]?.REF_LASTNAME || "",
      RefRelation2: references[1]?.REF_RELATION || "",
      RefPhone2: references[1]?.REF_MOBILENUMBER || references[1]?.REF_HOMEPHONE || "",
      RefEmail2: references[1]?.REF_EMAIL || "",

      // --- Vehicle Info ---
      vehMake: vehicle?.VehicleMake || "",
      vehModel: vehicle?.VehicleModel || "",
      vehYear: vehicle?.VehicleYear || "",
      vehNumber: vehicle?.VehicleNumber || "",
      vehOwner: vehicle?.VehicleOwnerName || "",
      vin: vehicle?.VINNumber || "",
      chaseNumber: vehicle?.ChassisNumber || "",
      insuranceNumber: vehicle?.InsuranceNumber || "",
      expDate: vehicle?.DrivingLicenseExpiryDate || "",
      mileage: vehicle?.Mileage || "",
      licensePlate: vehicle?.LicensePlate || "",
      certTitle: vehicle?.TitleCertificate || "",
      paidOff: vehicle?.isVehiclePaidoff ? "Y" : "N",
    }));
  };
  const handleFindCustomer = async () => {
    const ssn = form.SSN?.replace(/\D/g, "");
    if (!ssn || ssn.length < 9) {
      toast.error("Please enter a valid 9-digit SSN");
      return;
    }

    try {
      const customerRes = await fetchCustomerDetails(); // call hook
      console.log("Customer Details Response:", customerRes);

      // ✅ Type-safe check
      if (customerRes?.data?.Table?.length && customerRes.data.Table.length > 0) {
        populateFormWithCustomerDetails(customerRes.data);
      } else {
        toast.info("No customer record found for this SSN.");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast.error("Something went wrong while fetching customer details.");
    }
  };


  return (
    <div className="min-h-screen p-6 bg-[#f8fafc]">
      <div className="max-w-[1500px] mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-2 pb-2 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Add Leads</h1>
            <p className="text-slate-400 mt-1 font-medium text-sm md:text-base"> SparkLMS Portal</p>
          </div>

          <Button
            onClick={generateRandomData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-9 rounded-md shadow-none transition-all"
          >
            <Zap className="mr-2 h-4 w-4" />
            Auto-Generate Data
          </Button>
        </div>

        {/* TOP CONTROLS: LOAN TYPE & SSN SEARCH */}
        <Card className="p-4 mb-6 border-indigo-300 border">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
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
                    <CheckboxField label="Yes" id="aty" checked={form.isAutoTitle === 'Y'} onCheckedChange={() => updateField('isAutoTitle', 'Y')} color="indigo" />
                    <CheckboxField label="No" id="atn" checked={form.isAutoTitle === 'N'} onCheckedChange={() => updateField('isAutoTitle', 'N')} color="indigo" />
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-6">
              <div className="flex gap-3 items-end">
                <FormInput
                  label="SSN / ITIN Search"
                  id="SSN"
                  value={formatSSN(form.SSN)}
                  error={errors.SSN}
                  onChange={(e: any) => updateField('SSN', e.target.value)}
                  onKeyPress={(e: any) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={11}
                  placeholder="000-00-0000"
                />
                <Button
                  onClick={handleFindCustomer}
                  disabled={isCustomerLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-[44px] px-6 font-bold rounded-md shadow-sm flex items-center gap-2 mb-[1px]"
                >
                  {isCustomerLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Finding...
                    </>
                  ) : (
                    "Find"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* MODULAR FORM SECTIONS */}
        <CustomerInformation
          form={form}
          errors={errors}
          updateField={updateField}
          eighteenYearsAgo={eighteenYearsAgo}
          formatPhone={formatPhone}
          borderColor="blue"
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
          borderColor="purple"
        />
        <BankInformation
          form={form}
          errors={errors}
          updateField={updateField}
          borderColor="amber"
        />
        <VehicleInformation
          form={form}
          errors={errors}
          updateField={updateField}
          borderColor="red"
        />
        <ReferenceInformation
          form={form}
          errors={errors}
          updateField={updateField}
          formatPhone={formatPhone}
          borderColor="indigo"
        />
        {/* COMBINED MILITARY STATUS & ACTIONS CARD */}
        <Card className="p-6 mb-12 border-rose-300 border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* MILITARY STATUS */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl flex-1 w-full md:w-auto">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Award className="text-blue-600 h-5 w-5" />
                </div>
                <div>
                  <Label className="text-sm font-bold text-slate-800 block">Military Dependent</Label>
                  <p className="text-[11px] text-slate-500 font-medium">Claimed as a dependent by active military?</p>
                </div>
              </div>
              <div className="bg-white px-4 py-1.5 rounded-lg border border-slate-200 flex space-x-6">
                <CheckboxField label="Yes" id="mil-y" checked={form.militarymem === '1'} onCheckedChange={() => updateField('militarymem', '1')} color="rose" />
                <CheckboxField label="No" id="mil-n" checked={form.militarymem === '0'} onCheckedChange={() => updateField('militarymem', '0')} color="rose" />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-10 font-bold rounded-md shadow-none"
              >
                <Save className="mr-2 h-4 w-4" /> Submit Lead
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-50 px-8 h-10 font-bold rounded-md shadow-none"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Cancel
              </Button>
            </div>
          </div>
        </Card>

      </div>
      <CustomModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Customer Record is already available in LMS!"
        description="Please click confirm to overwrite this information or cancel."
        data={
          existingCustomer
            ? { "SSN": existingCustomer.ssn, "Customer Name": existingCustomer.name }
            : {}
        }
        confirmButtonText="Submit"
        cancelButtonText="Cancel"
        onConfirm={() => {
          setShowCustomerModal(false);
          // Trigger postLead or continue submission here

        }}
      />


    </div>
  );
}
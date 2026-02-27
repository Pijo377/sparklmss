// src/AddLeads/Hooks/useAddLeadsLogic.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addLeadsService } from '../Services/addleadsService';
import { FREQUENCY_MAP, calculateNextPayday, formatSSN, scrollToError } from '../Components/PayrollUtils';
//import { LOAN_TYPE_MAP, EMP_TYPE_MAP, INCOME_TYPE_MAP, FREQUENCY_MAP_DB, FREQ_CODE_MAP, DAY_CODE_MAP } from '../Utils/AddLeadsConstants';
import { addDays } from 'date-fns';
import { validateCustomer } from '../Components/CustomerInformation';
import { validateReference } from '../Components/ReferenceInformation';
import { validateEmployer } from '../Components/EmployerInformation';
import { validateBank } from '../Components/BankInformation';
import { validateVehicle } from '../Components/VehicleInformation';

// src/AddLeads/Utils/AddLeadsConstants.ts
export const LOAN_TYPE_MAP: any = { "Installment": "I", "Pay Day": "P", "CAB/CSO": "C", "Auto Title": "A", "Line of Credit": "L" };
export const EMP_TYPE_MAP: any = { "Full-Time": "F", "Part-Time": "P", "Other": "O" };
export const INCOME_TYPE_MAP: any = { "Employment": "Employed", "Self-Employed": "Self-employed", "Retirement": "Retirement", "Social Security": "Social Security", "Disability": "Disability" };
export const FREQUENCY_MAP_DB: any = { "W": "Weekly", "B": "Every Other Week", "S": "Semi-Monthly", "M": "Monthly" };
export const FREQ_CODE_MAP: any = { "Weekly": "W", "Every Other Week": "B", "Semi-Monthly": "S", "Monthly": "M" };
export const DAY_CODE_MAP: any = { "MONDAY": "2", "TUESDAY": "3", "WEDNESDAY": "4", "THURSDAY": "5", "FRIDAY": "6" };

export const useAddLeadsLogic = () => {
  const navigate = useNavigate();

  // All your States moved here
  const [empCities, setEmpCities] = useState<Record<number, string[]>>({});
  const [empZips, setEmpZips] = useState<Record<number, string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isCheckingSSN, setIsCheckingSSN] = useState(false);
  const [isFetchingVin, setIsFetchingVin] = useState(false);
  const [form, setForm] = useState<any>({
    // Header
    LoanType: '', isAutoTitle: 'N', SSN: '',

    // Customer Info
    FirstName: '', LastName: '', Email: '', DOB: '',
    HomePhone: '', MobilePhone: '', CustomerStatus: 'N',
    Address: '', State: '', City: '', Zip: '',
    AtAddressSince: '', DLState: '', License: '',
    LoanAmount: '', Language: '',
    homestatus: '1', // Missing field added here
    militarymem: '0', uscitizen: '1', IPaddress: '',

    // Primary Employer
    EmployerName: '', JobTitle: '', WorkPhone: '', EmpAddress1: '', EmpAddress2: '',
    EmployerState: '', EmployerCity: '', EmployerZip: '', EmploymentType: '',
    SourceIncome: '', OtherIncomeType: '', GrossPay: '', ReceivePaycheck: 'D',
    SupervisorName: '', SupervisorPhone: '', EmpStartDate: '',

    // Primary Payroll
    Frequency: '', HowPaid: '', Periodicity: '',
    DayOfWeek: '', DayOfWeek1: '', DayOfWeek2: '', PayWeek1: '', PayWeek2: '',
    SemiMonthlyPayDay01: '', SemiMonthlyPayDay02: '0', MonthlyPayDay: '',
    LastPayDate: '', NextPayDate: '', SecondPayDate: '', FirstPaymentDate: '',

    // Bank
    BankName: '', AbaNumber: '', AccountNumber: '', AccountDate: '', AccountType: 'C',

    // Employer 2 & 3 (Required to prevent server 500 crash)
    IsempPay1: false, JobTitle1: '', EmployerName1: '', EmpAddress11: '', EmpAddress21: '', EmployerCity1: '', EmployerState1: '', EmployerZip1: '', EmploymentType1: '', SourceIncome1: '', OtherIncomeType1: '', ReceivePaycheck1: '', PayecheckOften1: '', HowPaid1: '', GrossPay1: '', LastPayDate1: '', NextPayDate1: '', SecondPayDate1: '', OriginalPayDate1: '', SemiMonthlyPayDay011: '0', SemiMonthlyPayDay021: '0', PayWeek11: '0', PayWeek21: '0',
    IsempPay2: false, JobTitle2: '', EmployerName2: '', EmpAddress12: '', EmpAddress22: '', EmployerCity2: '', EmployerState2: '', EmployerZip2: '', EmploymentType2: '', SourceIncome2: '', OtherIncomeType2: '', ReceivePaycheck2: '', PayecheckOften2: '', HowPaid2: '', GrossPay2: '', LastPayDate2: '', NextPayDate2: '', SecondPayDate2: '', OriginalPayDate2: '', SemiMonthlyPayDay012: '0', SemiMonthlyPayDay022: '0', PayWeek12: '0', PayWeek22: '0',

    // Vehicle & Reference
    veh: '', vehYear: '', vehMake: '', vehOwner: '', vehModel: '', vehNumber: '', vin: '', chaseNumber: '', insuranceNumber: '', expDate: '', mileage: '', paidOff: '', certTitle: '', licensePlate: '',
    RefFirstName: '', RefLastName: '', Relation: '', RefMobile: '',
    RefFirstName2: '', RefLastName2: '', RefRelation2: '', RefMobile2: '',
    // Consent
    IsOptInForSMS: '1', PromotionalDNDCheck: '0'
  });


  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [zipcodes, setZipcodes] = useState<string[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [paydayMode, setPaydayMode] = useState<Record<number, string>>({});
  const [howPaidOptions, setHowPaidOptions] = useState<Record<number, any[]>>({});
  const [campaignDetails, setCampaignDetails] = useState<any>({});
  const [selectedStateName, setSelectedStateName] = useState("");
  const [employerCount, setEmployerCount] = useState(1);
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const [vinInfo, setVinInfo] = useState<any>(null);
  const [isVinModalOpen, setIsVinModalOpen] = useState(false);
  const handleGetVinInfo = async () => {
    const vin = form.vin;
    if (!vin || vin.length < 17) {
      setErrors(prev => ({ ...prev, vin: "Should be a 17 digit alphanumeric value" }));
      return;
    }
    setIsFetchingVin(true);
    try {
      const data = await addLeadsService.getVinInfo(vin);
      setVinInfo(data);
      setIsVinModalOpen(true);
    } catch (e) {
      Swal.fire("Error", "Unable to fetch vehicle information", "error");
    } finally {
      // STOP LOADER
      setIsFetchingVin(false);
    }
  };

  // Logic to copy data from Modal to the Form (matches Angular copyPasteVehicleInfo)
  const applyVinInfo = () => {
    if (vinInfo) {
      setForm((prev: any) => ({
        ...prev,
        vehYear: String(vinInfo.ModelYear || ''),
        vehMake: String(vinInfo.Make || ''),
        vehModel: String(vinInfo.Model || ''),
      }));
      setIsVinModalOpen(false);
    }
  };
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
  };// Inside AddLeadsPage.tsx

  const handleGetCampaign = async () => {
    console.log("%c--- GetCampaign Logic Started ---", "color: orange; font-weight: bold;");

    // 1. Check if we have the minimum data required
    if (!form.SSN || !form.AbaNumber || !form.LoanType) {
      console.warn("GetCampaign Aborted: Missing SSN, ABA, or LoanType", {
        SSN: form.SSN, Aba: form.AbaNumber, LoanType: form.LoanType
      });
      return;
    }

    // 2. Map the UI Label back to the DB Code
    const loanCodeMap: Record<string, string> = {
      "Installment": "I",
      "Pay Day": "P",
      "CAB/CSO": "C",
      "Auto Title": "A",
      "Line of Credit": "L"
    };

    const currentLoanCode = loanCodeMap[form.LoanType] || "";
    const isAuto = form.isAutoTitle === "Y";
    const freq = form.Frequency; // e.g., "Weekly"

    let type = '';
    let camID = '';

    // 3. Replicate Angular logic for ID selection
    if (currentLoanCode === "A") {
      camID = "78";
      type = "A";
    } else if (isAuto) {
      camID = "60";
      type = "C";
    } else if ((freq === "Weekly" || freq === "Every Other Week") &&
      !["I", "L", "P"].includes(currentLoanCode)) {
      camID = "52";
      type = "C";
    } else if (currentLoanCode === 'L') {
      camID = "71";
      type = "L";
    } else if (currentLoanCode === 'I') {
      camID = "65";
      type = "I";
    } else if (currentLoanCode === 'P') {
      camID = "77";
      type = "P";
    } else {
      camID = "53";
      type = "C";
    }

    const payload = {
      SSN: form.SSN.replace(/-/g, ""),
      MerchandiseType: type,
      CampaignID: camID
    };

    console.log("Determined ID:", camID, "Type:", type);
    console.log("Sending Payload to API:", payload);

    try {
      const res = await addLeadsService.getCampaignConfig(payload);
      console.log("%cAPI Response Received:", "color: green; font-weight: bold;", res);

      if (res.success) {
        const details = res.res?.NewDataSet?.Table || {};
        setCampaignDetails(details);
        console.log("Campaign Details set in state:", details);
      } else {
        console.error("API returned success: false", res.msg);
      }
    } catch (error) {
      console.error("Critical error in handleGetCampaign:", error);
    }
  };



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


  const handleCheckSSN = async () => {
    if (!form.SSN || form.SSN.replace(/\D/g, '').length < 9) {
      Swal.fire("Info", "Please enter a valid 9-digit SSN/ITIN", "info");
      return;
    }
    setIsCheckingSSN(true);
    try {
      const ssnClean = form.SSN.replace(/-/g, "");
      const res = await addLeadsService.checkSSN(ssnClean);
      const DAY_NAME_MAP: Record<string, string> = {
        "2": "MONDAY",
        "3": "TUESDAY",
        "4": "WEDNESDAY",
        "5": "THURSDAY",
        "6": "FRIDAY"
      };

      if (res.success && res.res.NewDataSet) {
        const data = res.res.NewDataSet;
        const checkData = data.Table?.RESULT || "0";

        if (checkData !== "0" && checkData !== 0) {
          // Safe extraction of tables
          const cust = Array.isArray(data.Table1) ? data.Table1[0] : data.Table1;
          const emp = Array.isArray(data.Table2) ? data.Table2[0] : data.Table2;
          const bank = Array.isArray(data.Table3) ? data.Table3[0] : data.Table3;
          const loan = Array.isArray(data.Table5) ? data.Table5[0] : data.Table5;
          const merch = Array.isArray(data.Table6) ? data.Table6[0] : data.Table6;
          const veh = Array.isArray(data.Table7) ? data.Table7[0] : data.Table7;
          // --- 1. RESOLVE STATE/DL CODES ---
          const stateObj = states.find((s: any) => s.StateID == cust.CUST_STATEID);
          const dlStateObj = states.find((s: any) => s.StateID == cust.CUST_DL_STATEID);
          const stateName = stateObj?.StateName || "";
          const stateShortCode = stateObj?.StateShortCode || "";
          const dlStateShortCode = dlStateObj?.StateShortCode || "";

          // --- 2. RESOLVE CITIES/ZIPS ---
          if (stateName) {
            setSelectedStateName(stateName);
            const cityRes = await addLeadsService.getCities(stateName);
            setCities(Array.isArray(cityRes) ? cityRes : [cityRes]);
            if (cust.CUST_CITY) {
              const zipRes = await addLeadsService.getZips(`${stateName},${cust.CUST_CITY}`);
              setZipcodes(Array.isArray(zipRes) ? zipRes : [zipRes]);
            }
          }

          // --- 3. RESOLVE PAYROLL (HOW PAID & HIDDEN FIELDS FIX) ---
          const dbFreq = emp.EMP_PERIODICITY?.trim(); // 'W', 'B', 'S', 'M'
          const dbHowPaid = emp.EMP_FREQUNCY?.trim(); // 'W', 'X', 'F', etc.
          const dbLoanCode = merch.Merchandisetype?.trim() || "";

          // Convert code to UI Label (e.g., "I" -> "Installment")
          // We need this so the dropdown box in the UI highlights the right option
          const uiLoanLabel = Object.keys(LOAN_TYPE_MAP).find(key => LOAN_TYPE_MAP[key] === dbLoanCode);
          // Map Frequency Code to UI Label
          const mappedFrequency = FREQUENCY_MAP_DB[dbFreq] || "";
          const dbEmpTypeCode = emp.EMP_JOBTYPE?.trim() || "";
          const uiEmploymentType = Object.keys(EMP_TYPE_MAP).find(key => EMP_TYPE_MAP[key] === dbEmpTypeCode) || "";

          // Resolve exact How Paid label and logic Mode
          let mappedHowPaidLabel = "";
          let mappedPaydayMode = "";

          if (dbHowPaid === 'W') { mappedHowPaidLabel = "Weekly"; mappedPaydayMode = "day_of_week"; }
          else if (dbHowPaid === 'X') { mappedHowPaidLabel = "Treat Weekly as Bi-weekly"; mappedPaydayMode = "day_of_week"; }
          else if (dbHowPaid === 'B') { mappedHowPaidLabel = "Every Other Week"; mappedPaydayMode = "day_of_week"; }
          else if (dbHowPaid === 'F') { mappedHowPaidLabel = "Two Specific Days"; mappedPaydayMode = "semi_dates"; }
          else if (dbHowPaid === 'T') { mappedHowPaidLabel = "Specific Week and Day"; mappedPaydayMode = "semi_weeks"; }
          else if (dbHowPaid === 'E') { mappedHowPaidLabel = "Specific Day"; mappedPaydayMode = "monthly_date"; }
          else if (dbHowPaid === 'O') { mappedHowPaidLabel = "Specific Week and Day"; mappedPaydayMode = "monthly_week"; }

          // Update UI cascading options and visibility modes for index 0
          setHowPaidOptions(prev => ({ ...prev, [0]: FREQUENCY_MAP[mappedFrequency] || [] }));
          setPaydayMode(prev => ({ ...prev, [0]: mappedPaydayMode }));

          // Map Hidden Box Values
          const subFields: any = {
            DayOfWeek: '', DayOfWeek1: '', DayOfWeek2: '',
            PayWeek1: '', PayWeek2: '',
            SemiMonthlyPayDay01: '', SemiMonthlyPayDay02: '', MonthlyPayDay: ''
          };
          const rawDayId = emp.EMP_SEMIPAYDAY01?.trim();
          if (mappedPaydayMode === 'day_of_week') {
            subFields.DayOfWeek = DAY_NAME_MAP[rawDayId] || "";
          } else if (mappedPaydayMode === 'semi_dates') {
            subFields.SemiMonthlyPayDay01 = emp.EMP_SEMIPAYDAY01;
            subFields.SemiMonthlyPayDay02 = emp.EMP_SEMIPAYDAY02;
          } else if (mappedPaydayMode === 'semi_weeks') {
            subFields.PayWeek1 = emp.EMP_PAYWEEK1;
            subFields.DayOfWeek1 = DAY_NAME_MAP[emp.EMP_SEMIPAYDAY01?.trim()] || "";
            subFields.PayWeek2 = emp.EMP_PAYWEEK2;
            subFields.DayOfWeek2 = DAY_NAME_MAP[emp.EMP_SEMIPAYDAY02?.trim()] || "";
          } else if (mappedPaydayMode === 'monthly_date') {
            subFields.MonthlyPayDay = emp.EMP_SEMIPAYDAY01;
          } else if (mappedPaydayMode === 'monthly_week') {
            subFields.PayWeek1 = emp.EMP_PAYWEEK1;
            subFields.DayOfWeek = DAY_NAME_MAP[rawDayId] || "";
          }
          if (bank.BANK_ABA && dbLoanCode) {
            let type = '';
            let camID = '';
            const isAuto = (veh && veh.VehicleInfoID) ? "Y" : "N";

            if (dbLoanCode === "A") { camID = "78"; type = "A"; }
            else if (isAuto === "Y") { camID = "60"; type = "C"; }
            else if ((mappedFrequency === "Weekly" || mappedFrequency === "Every Other Week") && !["I", "L", "P"].includes(dbLoanCode)) {
              camID = "52"; type = "C";
            } else if (dbLoanCode === 'L') { camID = "71"; type = "L"; }
            else if (dbLoanCode === 'I') { camID = "65"; type = "I"; }
            else if (dbLoanCode === 'P') { camID = "77"; type = "P"; }
            else { camID = "53"; type = "C"; }

            try {
              const campRes = await addLeadsService.getCampaignConfig({
                SSN: ssnClean,
                MerchandiseType: type,
                CampaignID: camID
              });
              if (campRes.success) {
                setCampaignDetails(campRes.res?.NewDataSet?.Table || {});
              }
            } catch (campErr) {
              console.error("Auto-fetch campaign failed", campErr);
            }
          }
          // --- 4. MAP INCOME & EMPLOYMENT ---
          const mappedSourceIncome = INCOME_TYPE_MAP[emp.EMP_INCOMETYPE?.trim()] || "Other";

          // --- 5. FINALLY, SET FORM ---
          setForm((prev: any) => ({
            ...prev,
            // Header
            LoanType: uiLoanLabel || "",
            SSN: formatSSN(cust.CUST_SSN),

            // Customer
            FirstName: cust.CUST_FIRSTNAME,
            LastName: cust.CUST_LASTNAME,
            Email: cust.CUST_EMAIL,
            DOB: cust.CUST_DOB?.split('T')[0],
            HomePhone: cust.CUST_HOMEPHONE,
            MobilePhone: cust.CUST_MOBILEPHONE,
            CustomerStatus: "R",
            Address: cust.CUST_ADDRESS,
            State: stateShortCode,
            City: cust.CUST_CITY,
            Zip: cust.CUST_Zip,
            AtAddressSince: cust.CUST_ATCURADDRESSSINCE?.split('T')[0],
            DLState: dlStateShortCode,
            License: cust.CUST_DL_NUMBER,
            LoanAmount: loan.LoanAmount?.split('.')[0],
            Language: cust.PreferredLanguage,
            homestatus: cust.CUST_HOMESTATUS,
            militarymem: cust.Cust_IsClaimedMilitary === 'false' ? '0' : '1',

            // Employer
            EmployerName: emp.EMP_EMP_NAME,
            JobTitle: emp.EMP_JOBTITLE,
            WorkPhone: emp.EMP_WORKPHONE,
            GrossPay: emp.EMP_GROSSINCOME,
            EmploymentType: uiEmploymentType,
            SourceIncome: mappedSourceIncome,
            OtherIncomeType: (mappedSourceIncome === "Other") ? emp.EMP_INCOMETYPE : "",
            ReceivePaycheck: emp.EMP_PAYCHECK,

            // Payroll (UI BINDING)
            Frequency: mappedFrequency,
            HowPaid: mappedHowPaidLabel,
            ...subFields,

            // Dates
            LastPayDate: emp.EMP_LASTPAYDAY?.split('T')[0],
            NextPayDate: emp.EMP_NEXTPAYDATE?.split('T')[0],
            SecondPayDate: emp.EMP_SECONDPAYDATE?.split('T')[0],
            FirstPaymentDate: emp.EMP_ORIGINAL?.split('T')[0],

            // Bank
            AbaNumber: bank.BANK_ABA,
            AccountNumber: bank.BANK_ACC_NO,
            AccountDate: bank.BANK_ACC_OPEN_DATE?.split('T')[0],
            AccountType: bank.BANK_ACC_TYPE,

            isAutoTitle: (veh && veh.VehicleInfoID) ? 'Y' : 'N',
            vehYear: veh?.VehicleYear || "",
            vehMake: veh?.VehicleMake || "",
            vehModel: veh?.VehicleModel || "",
            vehNumber: veh?.VehicleNumber || "",
            vehOwner: veh?.VehicleOwnerName || "",
            vin: veh?.VINNumber || "",
            chaseNumber: veh?.ChassisNumber || "",
            insuranceNumber: veh?.InsuranceNumber || "",
            expDate: veh?.DrivingLicenseExpiryDate?.split('T')[0] || "",
            mileage: veh?.Mileage || "",
            paidOff: veh?.isVehiclePaidoff === 'true' || veh?.isVehiclePaidoff === true ? 'Y' : 'N',
            certTitle: veh?.TitleCertificate || "",
            licensePlate: veh?.LicensePlate || ""
          }));

          Swal.fire("Success", "Returning customer data loaded", "success");
        } else {
          Swal.fire("Info", "No information available for this SSN.", "info");
        }
      }
    } catch (e) {
      console.error(e);
      Swal.fire("Error", "Critical error loading data", "error");
    } finally {
      // STOP LOADER (Put this in finally so it stops even if the API fails)
      setIsCheckingSSN(false);
    }
  };

  const handleFileUploads = async (serverPath: string) => {
    // 1. Angular Path Transformation: replace \ with :
    // Input:  D:\Spark Dev\LendMe\LMS\RepositoryFiles\sparklms\8699\
    // Output: D::Spark Dev:LendMe:LMS:RepositoryFiles:sparklms:8699:
    const transformedPath = serverPath.replace(/\\/g, ":");

    // 2. Collect all files from the form state
    const fileKeys = ['file_dl', 'file_insurance']; // Add any dynamic file keys here

    // Also handle additional files from your "Add More" logic
    const extraFileKeys = Object.keys(form).filter(k => k.startsWith('file_extra_'));
    const allFileKeys = [...fileKeys, ...extraFileKeys];

    console.log("Beginning background upload to transformed path:", transformedPath);

    for (const key of allFileKeys) {
      const file = form[key];
      if (!file || !(file instanceof File)) continue;

      // 3. Determine Prefix (DL_ or IN_)
      let prefix = "";
      if (key === 'file_dl') prefix = "DL_";
      else if (key === 'file_insurance') prefix = "IN_";

      // 4. Create the "Virtual Filename" the server is looking for
      const virtualFileName = transformedPath + prefix + file.name;

      const formData = new FormData();

      /**
       * CRITICAL STEP: 
       * The 3rd parameter 'virtualFileName' replaces the actual filename 
       * during the network request. This satisfies the server's path-split logic.
       */
      formData.append("document", file, virtualFileName);

      try {
        await addLeadsService.uploadLeadDocument(formData);
        console.log("Successfully uploaded:", virtualFileName);
      } catch (e) {
        console.error("Upload error for:", virtualFileName, e);
      }
    }
  };



  const triggerAutoEmailFlow = async (loanId: string) => {
    console.log("%c--- Starting Auto-Email Workflow ---", "color: #87bf17; font-weight: bold;");

    try {
      // 1. Call the status check API
      const statusRes = await addLeadsService.checkAutoEmailStatus('IBVPending');

      if (statusRes.success && statusRes.res?.short) {
        const isActive = statusRes.res.short[0] === '1'; // '1' is Active
        const templateId = statusRes.res.short[1];      // ID like '27' or '34'

        if (isActive) {
          console.log("Auto-Email is ACTIVE. Sending template ID:", templateId);

          // 2. Construct the payload (Mirroring Angular sendEmailToUser)
          const emailPayload = {
            mailTemplateID: templateId,
            transactionID: loanId,
            emailType: 'A', // Fixed value from Angular
            userID: sessionStorage.getItem("UserId") || "0",
            sendMailWithPaymentID: false,
            NOAADenyID: 0
          };

          const mailRes = await addLeadsService.sendLeadEmail(emailPayload);
          console.log("Email Delivery API Result:", mailRes);
        } else {
          console.log("Auto-Email is INACTIVE (Status 0). Skipping.");
        }
      }
    } catch (e) {
      console.error("Auto-Email Automation Failed:", e);
    }
  };


  const handleSubmit = async () => {
    // 1. Validate UI Fields
    if (!validateForm()) {
      Swal.fire("Validation Error", "Please check the red error messages on the form.", "error");
      return;
    }

    // 2. Ensure Campaign data is loaded (triggered by ABA Number focus out)
    if (!campaignDetails?.CampaignName) {
      Swal.fire('Alert!', 'Campaign details not found. Please enter a valid ABA number.', 'error');
      return;
    }

    setIsAuthenticating(true);

    try {
      // 3. Formatting Helpers (Matching Angular's logic)
      const ssnClean = form.SSN.replace(/\D/g, '');

      // --- STEP A: REPLICATE ANGULAR PRE-SUBMIT SSN CHECK ---
      // This checks if the customer exists right before saving
      const checkRes = await addLeadsService.checkSSN(ssnClean);

      if (checkRes.success && checkRes.res.NewDataSet) {
        const result = parseInt(checkRes.res.NewDataSet.Table?.RESULT || "0");

        if (result > 0) {
          // Customer exists - Get the name for the popup
          const custData = Array.isArray(checkRes.res.NewDataSet.Table1)
            ? checkRes.res.NewDataSet.Table1[0]
            : checkRes.res.NewDataSet.Table1;

          const customerName = `${custData.CUST_FIRSTNAME} ${custData.CUST_LASTNAME}`;

          // Stop the "Processing" state so user can see the popup
          setIsAuthenticating(false);

          const confirmation = await Swal.fire({
            title: 'Customer Record is already available in LMS!',
            text: " Please click confirm to overwrite this information or cancel.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Submit',
            html: `
            <div style="text-align: left; padding: 10px; border: 1px solid #eee; border-radius: 5px; margin-top:10px;">
              <b>SSN:</b> ${form.SSN}<br> 
              <b>Customer Name:</b> ${customerName}
            </div>
          `,
          });

          // If user clicks "Cancel", stop the entire submit process here
          if (!confirmation.isConfirmed) {
            return;
          }

          // If user clicked "Submit" on popup, restart the loading state and continue
          setIsAuthenticating(true);
        }
      }

      const cleanDigits = (val: string) => val ? val.replace(/\D/g, '') : "";

      const formatDate = (date: any) => {
        if (!date) return "";
        const d = new Date(date);
        if (isNaN(d.getTime())) return date; // Return if already formatted
        const mm = (d.getMonth() + 1).toString().padStart(2, '0');
        const dd = d.getDate().toString().padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${mm}/${dd}/${yyyy}`; // Backend requires MM/DD/YYYY
      };

      // 4. Resolve Payday Sub-fields (Logic from successful Postman: "SemiMonthlyPayDay01": "2")
      const getPaydayMapping = (idx: string) => {
        const mode = paydayMode[idx === '' ? 0 : parseInt(idx)];
        let s1 = "0", s2 = "0", w1 = "0", w2 = "0";

        if (mode === 'day_of_week') {
          s1 = DAY_CODE_MAP[form['DayOfWeek' + idx]] || "0";
        } else if (mode === 'semi_dates') {
          s1 = form['SemiMonthlyPayDay01' + idx];
          s2 = (form['SemiMonthlyPayDay02' + idx] === "EOM" || form['SemiMonthlyPayDay02' + idx] === "32") ? "32" : form['SemiMonthlyPayDay02' + idx];
        } else if (mode === 'semi_weeks') {
          s1 = form['DayOfWeek1' + idx] ? DAY_CODE_MAP[form['DayOfWeek1' + idx]] : "0";
          s2 = form['DayOfWeek2' + idx] ? DAY_CODE_MAP[form['DayOfWeek2' + idx]] : "0";
          w1 = form['PayWeek1' + idx] || "0";
          w2 = form['PayWeek2' + idx] || "0";
        } else if (mode === 'monthly_date') {
          s1 = (form['MonthlyPayDay' + idx] === "EOM" || form['MonthlyPayDay' + idx] === "32") ? "32" : form['MonthlyPayDay' + idx];
        }
        return { s1, s2, w1, w2 };
      };

      const p0 = getPaydayMapping("");
      const empTypeMap: any = { "Full-Time": "F", "Part-Time": "P", "Other": "O" };
      const incomeMap: any = { "Employed": "P", "Self-employed": "E", "Retirement": "R", "Social Security": "S", "Disability": "D", "Other": "O" };
      // 5. CONSTRUCT THE MASSIVE PAYLOAD (100% Match to successful Postman log)

      const leadsdata: any = {
        // --- Campaign / Store Info ---
        StoreName: campaignDetails.StoreName || "sparklms",
        MerchandiseName: campaignDetails.MerchandiseName || "InstallProduct",
        CampaignName: campaignDetails.CampaignName || "TESTCampUpdate",
        CampaignUser: campaignDetails.CampaignUser || "admin",
        CampaignPassword: campaignDetails.CampaignPassword || "Tql@dmin",
        Subaffiliateid: campaignDetails.Subaffiliateid || "1",
        MerchandiseType: campaignDetails.MerchandiseType || "",
        LoanType: campaignDetails.MerchandiseType || "", // As seen in successful log
        IsOptInForSMS: form.IsOptInForSMS || '1',
        PromotionalDNDCheck: form.PromotionalDNDCheck || '0',

        // --- Customer Information ---
        SSN: cleanDigits(form.SSN),
        FirstName: form.FirstName,
        LastName: form.LastName,
        Email: form.Email,
        DOB: formatDate(form.DOB),
        HomePhone: cleanDigits(form.HomePhone),
        MobilePhone: cleanDigits(form.MobilePhone),
        CustomerStatus: form.CustomerStatus || "N",
        Address: form.Address || "",
        City: form.City || "",
        State: form.State || "",
        Zip: form.Zip || "",
        AtAddressSince: formatDate(form.AtAddressSince), // Converts YYYY-MM-DD to MM/DD/YYYY
        homestatus: form.homestatus || "1",
        HowLongAddYears: "0",
        HowLongAddMnths: "0",
        DLState: form.DLState,
        License: form.License,
        LoanAmount: form.LoanAmount,
        // AtAddressSince: formatDate(form.AtAddressSince),
        Language: form.Language,
        //  homestatus: form.homestatus || "1", // Mapped via Radio/Checkbox
        militarymem: form.militarymem || "0",
        uscitizen: "1",

        // --- Employer #1 ---
        EmployerName: form.EmployerName || "",
        JobTitle: form.JobTitle || "",
        WorkPhone: cleanDigits(form.WorkPhone),
        EmployerState: form.EmployerState || form.State,
        EmployerCity: form.EmployerCity || form.City,
        EmployerZip: form.EmployerZip || form.Zip,
        EmpAddress1: form.EmpAddress1 || "",
        EmpAddress2: form.EmpAddress2 || "",
        EmpStartDate: formatDate(form.EmpStartDate),
        EmploymentType: empTypeMap[form.EmploymentType] || "", // Map "Full-Time" to "F"
        SourceIncome: incomeMap[form.SourceIncome] || "O",
        OtherIncomeType: form.OtherIncomeType || "",
        ReceivePaycheck: form.ReceivePaycheck || "D",
        PayecheckOften: FREQ_CODE_MAP[form.Frequency] || "",
        HowPaid: FREQ_CODE_MAP[form.Frequency] || "",
        GrossPay: form.GrossPay || "0",
        Frequency: FREQ_CODE_MAP[form.Frequency] || "",
        Periodicity: FREQ_CODE_MAP[form.Frequency] || "",

        // Payday Mapping for Employer #1
        SemiMonthlyPayDay01: p0.s1,
        SemiMonthlyPayDay02: p0.s2,
        PayWeek1: p0.w1,
        PayWeek2: p0.w2,

        // Dates
        LastPayDate: formatDate(form.LastPayDate),
        NextPayDate: formatDate(form.NextPayDate),
        SecondPayDate: formatDate(form.SecondPayDate),
        OriginalPayDate: formatDate(form.FirstPaymentDate), // Maps UI FirstPaymentDate to backend OriginalPayDate

        // --- Bank Information ---
        AbaNumber: form.AbaNumber,
        AccountNumber: form.AccountNumber,
        AccountDate: form.AccountDate ? formatDate(form.AccountDate).substring(0, 7) : "01/2024", // MM/YYYY from log
        AccountType: form.AccountType || "C",

        // --- Meta Data ---
        IPaddress: form.IPaddress || "127.0.0.1",
        UserId: sessionStorage.getItem("UserId") || "53",

        // --- Employer #2 & #3 (Placeholders to prevent server crash) ---
        IsempPay1: false,
        JobTitle1: "", EmployerName1: "", EmpAddress11: "", EmpAddress21: "", EmployerCity1: "", EmployerState1: "", EmployerZip1: "", EmploymentType1: "", SourceIncome1: "", OtherIncomeType1: "", ReceivePaycheck1: "", PayecheckOften1: "", HowPaid1: "", GrossPay1: "", LastPayDate1: "", NextPayDate1: "", SecondPayDate1: "", OriginalPayDate1: "", SemiMonthlyPayDay011: "0", SemiMonthlyPayDay021: "0", PayWeek11: "0", PayWeek21: "0",
        IsempPay2: false,
        JobTitle2: "", EmployerName2: "", EmpAddress12: "", EmpAddress22: "", EmployerCity2: "", EmployerState2: "", EmployerZip2: "", EmploymentType2: "", SourceIncome2: "", OtherIncomeType2: "", ReceivePaycheck2: "", PayecheckOften2: "", HowPaid2: "", GrossPay2: "", LastPayDate2: "", NextPayDate2: "", SecondPayDate2: "", OriginalPayDate2: "", SemiMonthlyPayDay012: "0", SemiMonthlyPayDay022: "0", PayWeek12: "0", PayWeek22: "0",

        // --- Reference & Vehicle ---
        RefFirstName: form.RefFirstName || "",
        RefLastName: form.RefLastName || "",
        Relation: form.Relation || "", // Note: Key is just 'Relation'
        RefMobile: cleanDigits(form.RefMobile || ""),
        RefHomePhone: "",
        RefEmail: "",
        RefAddress: "",
        RefCity: "",
        RefState: "",
        RefZip: "",

        // --- REFERENCE #2 MAPPING (MATCHES ANGULAR PAYLOAD) ---
        RefFirstName2: form.RefFirstName2 || "",
        RefLastName2: form.RefLastName2 || "",
        RefRelation2: form.RefRelation2 || "", // Note: Key is 'RefRelation2'
        RefMobile2: cleanDigits(form.RefMobile2 || ""),
        RefHomePhone2: "",
        RefEmail2: "",
        RefAddress2: "",
        RefCity2: "",
        RefState2: "",
        RefZip2: "",
        isAutoTitle: form.isAutoTitle || "N",
        vehModel: form.vehModel || "",
        certTitle: form.certTitle || "",
        licensePlate: form.licensePlate || "",
        chaseNumber: form.chaseNumber || "",
        insuranceNumber: form.insuranceNumber || "",
        expDate: formatDate(form.expDate), // Formatted to MM/DD/YYYY
        mileage: form.mileage || "",
        paidOff: form.paidOff || "false",
        vehYear: form.vehYear || "",
        vehMake: form.vehMake || "",
        vehOwner: form.vehOwner || "",
        vehNumber: form.vehNumber || "",
        veh: "", // Mandatory empty key
        vin: form.vin || "",

      };

      console.log("%cPayload prepared for API:", "color: cyan;", leadsdata);

      // 6. CALL THE API SERVICE
      const response = await addLeadsService.postLead(leadsdata);

      if (response.success) {
        if (response.uploadPath) {
          // We DON'T await this if you want the page to navigate immediately,
          // but it's better to await so the user knows everything is done.
          await handleFileUploads(response.uploadPath);
        }
        await triggerAutoEmailFlow(response.LoanID);
        Swal.fire({
          title: 'Success!',
          text: 'Lead created and automation triggered.',
          icon: 'success',
          confirmButtonColor: '#87bf17'
        }).then(() => {
          // Equivalent to Angular logic: save info and navigate
          sessionStorage.setItem("CustomerInfo", JSON.stringify({ LID: response.LoanID, CID: response.CustomerID }));
          navigate('/search/customer-details');
        });
      } else {
        setIsAuthenticating(false);
        Swal.fire("Database Error", response.msg || "The server rejected the lead.", "error");
      }

    } catch (error) {
      setIsAuthenticating(false);
      console.error("Submission Crash:", error);
      Swal.fire("Connection Error", "Could not reach the server.", "error");
    }
  };


  return {
    form, setForm, errors, setErrors, isAuthenticating, isCheckingSSN,
    isFetchingVin, states, setStates, cities, setCities, zipcodes, setZipcodes,
    languages, setLanguages, paydayMode, setPaydayMode, howPaidOptions, setHowPaidOptions, empCities, empZips, setEmpCities, setEmpZips,
    updateField, handleCheckSSN, handleSubmit, campaignDetails, setCampaignDetails, // Return state
    handleGetCampaign, isVinModalOpen, handleGetVinInfo, applyVinInfo, setIsVinModalOpen, vinInfo,
    selectedStateName, setSelectedStateName, validateForm, handleFileUploads, triggerAutoEmailFlow, employerCount, setEmployerCount, eighteenYearsAgo,
  };

}
import { addDays, isSameDay, lastDayOfMonth, startOfDay, addMonths, startOfMonth, getDay } from 'date-fns';
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const alphaRegex = /^[a-zA-Z\s]*$/;
export const licenseRegex = /^[A-Z0-9-]{5,20}$/i;

// ... (keep all previous formatting and date helpers here)
export const MON_FRI = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];
export const WEEKS_FIRST_THIRD = ["First", "Second", "Third"];
export const WEEKS_LATE = ["Third", "Fourth", "Last"];
export const WEEKS_FULL = ["First", "Second", "Third", "Fourth", "Last"];

export const FREQUENCY_MAP: Record<string, { label: string; mode: string }[]> = {
  "Weekly": [
    { label: "Weekly", mode: "day_of_week" }, 
    { label: "Treat Weekly as Bi-weekly", mode: "day_of_week" }
  ],
  "Every Other Week": [
    { label: "Every Other Week", mode: "day_of_week" }
  ],
  "Semi-Monthly": [
    { label: "Two Specific Days", mode: "semi_dates" }, 
    { label: "Specific Week and Day", mode: "semi_weeks" }
  ],
  "Monthly": [
    { label: "Specific Day", mode: "monthly_date" }, 
    { label: "Specific Week and Day", mode: "monthly_week" }
  ]
};

export const formatPhone = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

export const formatSSN = (value: string) => {
  if (!value) return "";
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
};

export const scrollToError = (id: string) => {
  const element = document.getElementById(`wrap-${id}`);
  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const getDayName = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
};

export const getNthDayOfMonth = (year: number, month: number, nth: string, dayName: string) => {
  const dayIndex = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].indexOf(dayName);
  let date = startOfMonth(new Date(year, month));
  let count = 0;
  if (nth === "Last") {
    date = lastDayOfMonth(date);
    while (getDay(date) !== dayIndex) date = addDays(date, -1);
    return startOfDay(date);
  }
  const targetCount = ["First", "Second", "Third", "Fourth"].indexOf(nth) + 1;
  while (count < targetCount) {
    if (getDay(date) === dayIndex) count++;
    if (count < targetCount) date = addDays(date, 1);
  }
  return startOfDay(date);
};

export const isAllowedDay = (date: Date, form: any, paydayMode: string) => {
  const d = startOfDay(date);
  if (paydayMode === 'day_of_week') return form.DayOfWeek ? getDayName(d) === form.DayOfWeek : true;
  if (paydayMode === 'semi_dates') {
    const dayNum = d.getDate().toString();
    const isLast = isSameDay(d, lastDayOfMonth(d));
    const d2Match = (form.SemiMonthlyPayDay02 === "32" || form.SemiMonthlyPayDay02 === "EOM") ? isLast : form.SemiMonthlyPayDay02 === dayNum;
    return form.SemiMonthlyPayDay01 === dayNum || d2Match;
  }
  if (paydayMode === 'semi_weeks') {
    const date1 = getNthDayOfMonth(d.getFullYear(), d.getMonth(), form.PayWeek1, form.DayOfWeek1);
    const date2 = getNthDayOfMonth(d.getFullYear(), d.getMonth(), form.PayWeek2, form.DayOfWeek2);
    return isSameDay(d, date1) || isSameDay(d, date2);
  }
  if (paydayMode === 'monthly_date') {
    return (form.MonthlyPayDay === "32" || form.MonthlyPayDay === "EOM") ? isSameDay(d, lastDayOfMonth(d)) : form.MonthlyPayDay === d.getDate().toString();
  }
  if (paydayMode === 'monthly_week') {
    return isSameDay(d, getNthDayOfMonth(d.getFullYear(), d.getMonth(), form.PayWeek1, form.DayOfWeek));
  }
  return true;
};
export const calculateNextPayday = (currentDate: Date, form: any, paydayMode: string) => {
  // 1. Handle bi-weekly option correctly
  if (form.HowPaid === "Treat Weekly as Bi-weekly") return addDays(currentDate, 14);
  
  // 2. Standard Frequency Logic
  if (form.Frequency === "Weekly") return addDays(currentDate, 7);
  if (form.Frequency === "Every Other Week") return addDays(currentDate, 14);

  // 3. Monthly Specific Week and Day
  if (paydayMode === 'monthly_week') {
    const nextMonthDate = addMonths(currentDate, 1);
    return getNthDayOfMonth(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), form.PayWeek1, form.DayOfWeek);
  }

  // 4. Monthly Specific Date
  if (paydayMode === 'monthly_date') {
    const nextMonthDate = addMonths(currentDate, 1);
    const day = parseInt(form.MonthlyPayDay, 10);
    if (!isNaN(day)) return new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), day);
    return lastDayOfMonth(nextMonthDate);
  }

  // 5. Semi-Monthly / Semi-Weeks
  let tempDate = addDays(currentDate, 1);
  for (let i = 0; i < 45; i++) {
    if (isAllowedDay(tempDate, form, paydayMode)) return tempDate;
    tempDate = addDays(tempDate, 1);
  }

  return null;
};
// Components/PayrollUtils.ts


// ... (keep your existing exports: MON_FRI, WEEKS_FULL, FREQUENCY_MAP, etc.)

/**
 * Logic to find the first valid date based on rules
 */
export const findFirstValidDate = (today: Date, rulesForm: any, mode: string) => {
  let temp = addDays(today, 1);
  for (let i = 0; i < 60; i++) {
    // Calling the existing isAllowedDay from this same file
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

/**
 * THE FULL GENERATOR FUNCTION
 */
export const runRandomGenerator = (
  currentForm: any,
  employerCount: number,
  states: any[],
  languages: any[],
  loanAmountOptions: any[],
  // Setters passed from the React Component
  setForm: (f: any) => void,
  setPaydayMode: (m: any) => void,
  setHowPaidOptions: (o: any) => void,
  setErrors: (e: any) => void,
  setCities: (c: any) => void,   // Add this
  setZipcodes: (z: any) => void ,
  setEmpCities: (ec: any) => void, // NEW
  setEmpZips: (ez: any) => void 
) => {
  const today = startOfDay(new Date());
  const bankData = [
    { aba: "121000248", name: "Wells Fargo Bank" },
    { aba: "111000012", name: "Bank of America" },
    { aba: "021000089", name: "Citibank" }
  ];
  const selectedBank = bankData[Math.floor(Math.random() * bankData.length)];

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
 const formatDateForState = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  const randomLoanLabel = loanAmountOptions[Math.floor(Math.random() * loanAmountOptions.length)].label;
const empCitiesObj: any = {};
  const empZipsObj: any = {};
  // 1. Pick a Random State from the actual loaded list
  const randomState = states.length > 0 
    ? states[Math.floor(Math.random() * states.length)] 
    : { StateShortCode: "NV", StateName: "Nevada" };
 const nevada = states.find(s => s.StateShortCode === "NV") || states[0];
  // 2. FIX: Pick Loan Amount VALUE (e.g. "500"), not Label ("500.00")
  const randomLoan = loanAmountOptions[Math.floor(Math.random() * loanAmountOptions.length)];
  const loanValue = randomLoan?.value || "500";
   const toDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };
//const toDateString = (date: Date) => date.toISOString().split('T')[0];
  // 3. FIX: Pick Language CODE (e.g. "EN"), not Name ("English")
  const randomLang = languages.length > 0 
    ? languages[Math.floor(Math.random() * languages.length)] 
    : { LanguageCode: "EN", LanguageName: "English" };

  // 4. FIX: Mock the City and Zip lists so the dropdowns aren't empty
  const mockCity = "Las Vegas";
  const mockZip = "89101";
  setCities([mockCity]); // This makes the City dropdown show the value
  setZipcodes([mockZip]); // This makes the Zip dropdown show the value
  // Initial Form with Customer and Bank Data
  let newForm: any = {
    ...currentForm,
    LoanType: selectedLoan,
    isAutoTitle: autoTitleFlag,
    SSN: Math.floor(100000000 + Math.random() * 900000000).toString(),
    FirstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    LastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    Email: `user${Math.floor(Math.random() * 999)}@example.com`,
     DOB: formatDateForState(new Date(today.getFullYear() - 25, 5, 15)),
    HomePhone: "444" + Math.floor(1000000 + Math.random() * 8999999).toString(),
    MobilePhone: "555" + Math.floor(1000000 + Math.random() * 8999999).toString(),
    CustomerStatus: Math.random() > 0.5 ? "N" : "R",
   /// Address: Math.floor(Math.random() * 999) + " Maple Street",
  //  State: states[0]?.StateShortCode || "TX",
  //  City: mockCity,
 //   Zip: mockZip,
    Address: "777 Lucky Lane",
    // --- ADDRESS FIXES (Use the Short Code for State) ---
   State: nevada.StateShortCode,
    City: mockCity,
    Zip: mockZip,
    AtAddressSince: "2020-01-01", // Clean string
    homestatus: "1",    
  //  AtAddressSince: addDays(today, -1000).toISOString(),
    DLState: "TX",
    License: "DL" + Math.floor(1000000 + Math.random() * 9000000),
     LoanAmount: loanValue,           // Uses Code "500"
    Language: randomLang.LanguageCode,
  //  homestatus: "1",
    militarymem: "0",
   AbaNumber: selectedBank.aba,
    AccountNumber: Math.floor(1000000000 + Math.random() * 899999999).toString(),
    AccountDate: addDays(today, -800).toISOString(),
    AccountType: "C",
    RefName1: firstNames[0] + " " + lastNames[0],
    RefRelation1: "Friend",
    RefPhone1: "5551112222",
    RefEmail1: "ref1@test.com",
    RefName2: firstNames[1] + " " + lastNames[1],
    RefRelation2: "Sibling",
    RefPhone2: "5553334444",
    RefEmail2: "ref2@test.com",
  };

  let newModes: Record<number, string> = {};
  let newOptions: Record<number, any[]> = {};

  // 2. Loop through ALL open Employer forms
  for (let i = 0; i < employerCount; i++) {
    const sfx = i === 0 ? "" : i.toString();

    const empType = ["Full-Time", "Part-Time", "Other"][Math.floor(Math.random() * 3)];
    const incomePool = ["Employed", "Self-employed", "Retirement", "Disability", "Social Security", "Other"];
    const filteredIncomePool = empType === "Other" ? incomePool.filter(opt => opt !== "Employed") : incomePool;
    const randIncome = filteredIncomePool[Math.floor(Math.random() * filteredIncomePool.length)];

    newForm['EmploymentType' + sfx] = empType;
    newForm['SourceIncome' + sfx] = randIncome;

    if (randIncome === "Other") {
      newForm['OtherIncomeType' + sfx] = otherIncomeExamples[Math.floor(Math.random() * otherIncomeExamples.length)];
    } else {
      newForm['OtherIncomeType' + sfx] = '';
    }

    if (randIncome === "Employed") {
    newForm['EmployerName' + sfx] = companies[Math.floor(Math.random() * companies.length)];
      newForm['JobTitle' + sfx] = "Specialist";
      newForm['WorkPhone' + sfx] = "3331112222";
      newForm['EmpAddress1' + sfx] = "100 Business Way";
      newForm['EmpAddress2' + sfx] = "Suite " + (i + 1);
      newForm['EmployerState' + sfx] = randomState.StateShortCode;
      newForm['EmployerCity' + sfx] = "Austin";
      newForm['EmployerZip' + sfx] = "73301";
      newForm['SupervisorName' + sfx] = "John Boss";
      newForm['SupervisorPhone' + sfx] = "5559998888";
      newForm['EmpStartDate' + sfx] = formatDateForState(addDays(today, -1500));

        // HYDRATE EMPLOYER DROPDOWN LISTS
      empCitiesObj[i] = ["Austin"];
      empZipsObj[i] = ["73301"];
    }

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

    const tempContext = { ...newForm, Frequency: randFreq, HowPaid: randPaidObj.label };
    const logicalNPD = findFirstValidDate(today, tempContext, randPaidObj.mode);
    const logicalSPD = calculateNextPayday(logicalNPD, tempContext, randPaidObj.mode);

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
    const vFields = ["vin", "vehYear", "vehMake", "vehModel", "licensePlate", "expDate", "vehNumber", "vehOwner", "chaseNumber", "insuranceNumber", "mileage", "certTitle"];
    vFields.forEach(k => newForm[k] = '');
    newForm.paidOff = 'N';
  }

  // 4. Update the actual React component states
  setPaydayMode(newModes);
  setHowPaidOptions(newOptions);
    setEmpCities(empCitiesObj);
  setEmpZips(empZipsObj);
  setForm(newForm);
  setErrors({});
};
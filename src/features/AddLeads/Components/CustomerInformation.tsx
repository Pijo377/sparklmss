
import { FormSection } from './FormSection';
import { alphaRegex, emailRegex, licenseRegex } from './PayrollUtils';
import { addLeadsService } from '../Services/addleadsService';
import { Input, SelectField, DatePicker, CheckboxField } from './FormField';

import { Button } from "@/features/AddLeads/Components/ui/button";
import { Label } from "@/features/AddLeads/Components/ui/label";
interface State {
  StateID: string;
  StateShortCode: string;
  StateName: string;
}
export const validateCustomer = (form: any, eighteenYearsAgo: Date) => {
  let errors: any = {};

  // 1. Name Validation
  if (!form.FirstName) errors.FirstName = "First Name is required";
  else if (!alphaRegex.test(form.FirstName)) errors.FirstName = "Invalid format: Letters only";

  if (!form.LastName) errors.LastName = "Last Name is required";
  else if (!alphaRegex.test(form.LastName)) errors.LastName = "Invalid format: Letters only";

  // 2. Contact Validation
  if (!form.Email) errors.Email = "Email is required";
  else if (!emailRegex.test(form.Email)) errors.Email = "Invalid format: Enter valid email";

  if (!form.MobilePhone) errors.MobilePhone = "Mobile Phone is required";
  else if (form.MobilePhone.replace(/\D/g, '').length < 10) errors.MobilePhone = "10 digits required";

  if (!form.HomePhone) errors.HomePhone = "Home Phone is required";
  else if (form.HomePhone.replace(/\D/g, '').length < 10) errors.HomePhone = "10 digits required";

  // 3. Date of Birth (18+)
  if (!form.DOB) errors.DOB = "DOB is required";
  else if (new Date(form.DOB) > eighteenYearsAgo) errors.DOB = "Must be 18+ years old";

  // 4. Address & Residency
  if (!form.Address) errors.Address = "Address is required";
  if (!form.State) errors.State = "State is required";
  if (!form.City) errors.City = "City is required";
  if (!form.Zip) errors.Zip = "Zip is required";
  else if (form.Zip.length < 5) errors.Zip = "5 digits required";

  // NEW: At Address Since Validation
  if (!form.AtAddressSince) errors.AtAddressSince = "Residency start date is required";

  // 5. License Validation
  if (!form.DLState) errors.DLState = "License State is required";
  if (!form.License) {
    errors.License = "License Number is required";
  } else if (!licenseRegex.test(form.License)) {
    errors.License = "Invalid format: 5-20 alphanumeric characters";
  }

  // 6. Loan & Language Selection
  if (!form.LoanAmount) errors.LoanAmount = "Please select a Loan Amount";
  if (!form.Language) errors.Language = "Preferred Language is required";

  return errors;
};

export const CustomerInformation = ({ form, errors, updateField, states, cities = [],    // FIX: Set default empty array
  zipcodes = [], languages = [], eighteenYearsAgo,   // Add this prop
  handleStateChange,
  handleCityChange, formatPhone }: any) => {
  const languageNames = languages.map((l: any) => l.LanguageName);

  // 2. IMPORTANT: Find the Name that matches the Code in form.Language
  // This ensures the dropdown displays "English" even if the state is "EN"
  const currentLanguageName = languages.find((l: any) => l.LanguageCode === form.Language)?.LanguageName || "";

  const handleLanguageChange = (selectedName: string) => {
    // Find the code associated with the selected name
    const langObj = languages.find((l: any) => l.LanguageName === selectedName);
    if (langObj) {
      updateField('Language', langObj.LanguageCode); // Save "EN" to form
    }
  };
  const stateNames = states.map((s: any) => s.StateName);
  const currentDLStateName = states.find((s: State) => s.StateShortCode === form.DLState)?.StateName || "";

  // FIX FOR LOAN AMOUNT: Use the actual numeric values for the options
  const loanOptions = addLeadsService.getLoanAmountOptions().map(l => l.value);
  // 3. Helper to handle selection
  const onDLStateChange = (stateName: string) => {
    const selected = states.find((s: State) => s.StateName === stateName);
    if (selected) {
      updateField('DLState', selected.StateShortCode);
    }
  };

  // Fetching the correct loan options from your service logic
  //const loanOptions = addLeadsService.getLoanAmountOptions().map(l => l.label);

  const currentStateName = states.find((s: any) => s.StateShortCode === form.State)?.StateName || "";
  // Transform states into a simple array of strings for the dropdown
  // OR transform them into the format your SelectField expects
  const stateOptions = states.map((s: any) => s.StateShortCode);
  const languageOptions = languages.map((l: any) => l.LanguageCode);
  // Transform ["Miami", "Tampa"] -> [{label: "Miami", value: "Miami"}]
  // Transform only if cities/zipcodes exist
  const cityOptions = (cities || []).map((city: string) => city);
  const zipOptions = (zipcodes || []).map((zip: string) => zip);

  return (
    <FormSection title="Customer Information" colorClass="bg-blue-500">
      <Input label="First Name" id="FirstName" error={errors.FirstName} value={form.FirstName} onChange={(e: any) => updateField('FirstName', e.target.value)} />
      <Input label="Last Name" id="LastName" error={errors.LastName} value={form.LastName} onChange={(e: any) => updateField('LastName', e.target.value)} />
      <Input label="Email" id="Email" error={errors.Email} value={form.Email} onChange={(e: any) => updateField('Email', e.target.value)} />

      <DatePicker
        label="DOB"
        id="DOB"
        error={errors.DOB}
        value={form.DOB} // Added value prop
        onDateChange={(d: any) => updateField('DOB', d)}
        disabled={(date: any) => date > eighteenYearsAgo}
        defaultMonth={eighteenYearsAgo}
      />

      <Input label="Home Phone" id="HomePhone" error={errors.HomePhone} value={formatPhone(form.HomePhone || '')} onChange={(e: any) => updateField('HomePhone', e.target.value)} maxLength={14} />
      <Input label="Mobile Phone" id="MobilePhone" error={errors.MobilePhone} value={formatPhone(form.MobilePhone || '')} onChange={(e: any) => updateField('MobilePhone', e.target.value)} maxLength={14} />

      <SelectField
        label="Customer Status"
        value={form.CustomerStatus === "N" ? "New" : "Returning"} // Controlled logic
        options={["New", "Returning"]}
        onValueChange={(v: any) => updateField('CustomerStatus', v === "New" ? "N" : "R")}
      />
      <Input label="Address" id="Address" error={errors.Address} onChange={(e: any) => updateField('Address', e.target.value)} value={form.Address} />

      <SelectField
        label="State"
        id="State"
        error={errors.State}
        value={currentStateName}
        options={states.map((s: any) => s.StateName)}
        onValueChange={(name: string) => handleStateChange(name)}
      />

      {/* CITY: Ensure options uses cities prop */}
      <SelectField
        label="City"
        id="City"
        error={errors.City}
        value={form.City}
        options={cities}
        onValueChange={(city: string) => handleCityChange(city)}
      />

      {/* ZIP: Ensure options uses zipcodes prop */}
      <SelectField
        label="Zip"
        id="Zip"
        error={errors.Zip}
        value={form.Zip}
        options={zipcodes}
        onValueChange={(zip: string) => updateField('Zip', zip)}
      />{/* VALIDATION ADDED HERE */}
      <DatePicker
        label="At address since"
        id="AtAddressSince"
        error={errors.AtAddressSince}
        value={form.AtAddressSince} // Added value prop
        onDateChange={(d: any) => updateField('AtAddressSince', d)}
        disabled={(date: any) => date > new Date()}
      />

      {/* VALIDATION ADDED HERE */}
      <SelectField
        label="Drivers License State"
        id="DLState"
        error={errors.DLState}
        value={currentDLStateName} // This will now show "Nevada" correctly
        options={stateNames}
        onValueChange={(name: string) => onDLStateChange(name)}
      />


      {/* VALIDATION ADDED HERE */}
      <Input
        label="License Number"
        id="License"
        error={errors.License}
        value={form.License}
        onChange={(e: any) => updateField('License', e.target.value.toUpperCase())}
      />

      {/* CORRECT OPTIONS FROM SERVICE */}
      <SelectField
        label="Loan Amount"
        id="LoanAmount"
        error={errors.LoanAmount}
        value={form.LoanAmount} // This will now be "300"
        options={loanOptions}    // This will now be ["100", "200", "300"...]
        onValueChange={(v: any) => updateField('LoanAmount', v)}
      />


      <SelectField
        label="Preferred Language"
        id="Language"
        error={errors.Language}
        value={currentLanguageName} // Displays "English"
        options={languageNames}      // List of strings: ["English", "Spanish"]
        onValueChange={(name: string) => handleLanguageChange(name)}
      />
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Home Status</Label>
        <div className="flex space-x-6 pt-1">
          <CheckboxField
            label="Own"
            id="home-own"
            checked={form.homestatus === '1'}
            onCheckedChange={() => updateField('homestatus', '1')}
          />
          <CheckboxField
            label="Rent"
            id="home-rent"
            checked={form.homestatus === '2'}
            onCheckedChange={() => updateField('homestatus', '2')}
          />
        </div>
        {errors.homestatus && <p className="text-red-500 text-[10px]">{errors.homestatus}</p>}
      </div>
    </FormSection>
  );
};
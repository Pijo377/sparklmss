import { useEffect } from 'react';
import { Input, SelectField, DatePicker, CheckboxField } from './FormField';
import { FormSection } from './FormSection';
import { alphaRegex, emailRegex, licenseRegex } from './PayrollUtils';
import { addLeadsService } from '../Services/addleadsService';
import { Label } from '@/shared/components/ui/label';
import { useCityInfo, useStates, useZipInfo } from '../hooks/useStates';
import { usePreferredLanguages } from '../hooks/useLangiage';

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

export const CustomerInformation = ({
  form,
  errors,
  updateField,

  eighteenYearsAgo,
  formatPhone,
}: any) => {

  // Fetching the correct loan options from your service logic
  const loanOptions = addLeadsService.getLoanAmountOptions().map(l => l.label);
  const { data: states } = useStates();

  const stateOptions = Array.from(
    new Set([
      ...(states?.Table?.map((s: any) => s.StateName) ?? []),
      ...(form.State && !states?.Table?.some((s: any) => s.StateName === form.State || Number(s.StateID) === Number(form.State))
        ? [form.State]
        : [])
    ])
  );

  const { data: cityData, isLoading: cityLoading } = useCityInfo(form.State);
  const cityOptions = Array.from(
    new Set([
      ...(cityData?.Table?.map((c: any) => c.CityName) ?? []),
      ...(form.City ? [form.City] : []),
    ])
  );
  const {
    data: zipData,
    isLoading: zipLoading,
  } = useZipInfo(form.State, form.City);
  const { data: languageData, isLoading: languageLoading } = usePreferredLanguages();
  const languageOptions = languageData?.Table?.map((l: any) => l.LanguageName) ?? [];

  const zipOptions = Array.from(
    new Set([
      ...(zipData?.Table?.map((z: any) => String(z.Zip)) ?? []),
      ...(form.Zip ? [String(form.Zip)] : []),
    ])
  );

  // Normalize form.State: if it's an ID or ShortCode, find the name.
  // This helps when auto-filling with IDs or when hooks expect names.
  const currentStateName = states?.Table?.find((s: any) =>
    s.StateName === String(form.State) ||
    Number(s.StateID) === Number(form.State) ||
    s.StateShortCode === String(form.State)
  )?.StateName || String(form.State || "");

  const currentDLStateName = states?.Table?.find((s: any) =>
    s.StateName === String(form.DLState) ||
    Number(s.StateID) === Number(form.DLState) ||
    s.StateShortCode === String(form.DLState)
  )?.StateName || String(form.DLState || "");

  // Sync back to form if normalized (optional but helpful for hooks)
  useEffect(() => {
    if (currentStateName && currentStateName !== form.State && states?.Table) {
      updateField('State', currentStateName);
    }
  }, [currentStateName, form.State, updateField, states?.Table]);

  useEffect(() => {
    if (currentDLStateName && currentDLStateName !== form.DLState && states?.Table) {
      updateField('DLState', currentDLStateName);
    }
  }, [currentDLStateName, form.DLState, updateField, states?.Table]);

  return (
    <FormSection title="Customer Information" colorClass="bg-blue-500">

      <Input
        label="First Name"
        id="FirstName"
        error={errors.FirstName}
        value={form.FirstName}
        onChange={(e: any) => updateField('FirstName', e.target.value)}
      />

      <Input
        label="Last Name"
        id="LastName"
        error={errors.LastName}
        value={form.LastName}
        onChange={(e: any) => updateField('LastName', e.target.value)}
      />

      <Input
        label="Email"
        id="Email"
        error={errors.Email}
        value={form.Email}
        onChange={(e: any) => updateField('Email', e.target.value)}
      />

      <DatePicker
        label="DOB"
        id="DOB"
        error={errors.DOB}
        value={form.DOB}
        onDateChange={(d: any) => updateField('DOB', d)}
        disabled={(date: any) => date > eighteenYearsAgo}
        defaultMonth={eighteenYearsAgo}
      />

      <Input
        label="Home Phone"
        id="HomePhone"
        error={errors.HomePhone}
        value={formatPhone(form.HomePhone || '')}
        onChange={(e: any) => updateField('HomePhone', e.target.value)}
        maxLength={14}
      />

      <Input
        label="Mobile Phone"
        id="MobilePhone"
        error={errors.MobilePhone}
        value={formatPhone(form.MobilePhone || '')}
        onChange={(e: any) => updateField('MobilePhone', e.target.value)}
        maxLength={14}
      />

      <SelectField
        label="Customer Status"
        value={form.CustomerStatus === "N" ? "New" : "Returning"}
        options={["New", "Returning"]}
        onValueChange={(v: any) =>
          updateField('CustomerStatus', v === "New" ? "N" : "R")
        }
      />

      <Input
        label="Address"
        id="Address"
        error={errors.Address}
        value={form.Address}
        onChange={(e: any) => updateField('Address', e.target.value)}
      />

      <SelectField
        label="State"
        id="State"
        error={errors.State}
        value={currentStateName}
        options={stateOptions}
        onValueChange={(v: any) => updateField('State', v)}
      />


      <SelectField
        label="City"
        id="City"
        error={errors.City}
        value={form.City}
        options={cityOptions}
        loading={cityLoading}
        placeholder="Select City"
        onValueChange={(v: any) => updateField("City", v)}
      />



      <SelectField
        label="Zip"
        id="Zip"
        error={errors.Zip}
        value={form.Zip ? String(form.Zip) : ""}
        options={zipOptions}
        loading={zipLoading}
        placeholder="Select Zip"
        onValueChange={(v: any) => updateField("Zip", v)}
      />

      {/* HOME STATUS CHECKBOXES */}


      <DatePicker
        label="At address since"
        id="AtAddressSince"
        error={errors.AtAddressSince}
        value={form.AtAddressSince}
        onDateChange={(d: any) => updateField('AtAddressSince', d)}
        disabled={(date: any) => date > new Date()}
      />

      <SelectField
        label="License State"
        id="DLState"
        error={errors.DLState}
        value={currentDLStateName}
        options={stateOptions}
        onValueChange={(v: any) => updateField('DLState', v)}
      />

      <Input
        label="License Number"
        id="License"
        error={errors.License}
        value={form.License}
        onChange={(e: any) =>
          updateField('License', e.target.value.toUpperCase())
        }
      />

      <SelectField
        label="Loan Amount"
        id="LoanAmount"
        error={errors.LoanAmount}
        value={form.LoanAmount}
        options={loanOptions}
        onValueChange={(v: any) => updateField('LoanAmount', v)}
      />

      <SelectField
        label="Preferred Language"
        id="Language"
        error={errors.Language}
        value={form.Language}
        options={languageOptions}
        loading={languageLoading}
        placeholder="Select Language"
        onValueChange={(v: any) => updateField("Language", v)}
      />
      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Home Status
        </Label>
        <div className="flex space-x-4 pt-1">
          <CheckboxField
            label="Own"
            id="home-own"
            checked={form.HomeStatus === 'O'}
            onCheckedChange={() => updateField('HomeStatus', 'O')}
          />
          <CheckboxField
            label="Rent"
            id="home-rent"
            checked={form.HomeStatus === 'R'}
            onCheckedChange={() => updateField('HomeStatus', 'R')}
          />
        </div>
      </div>

    </FormSection>
  );
};

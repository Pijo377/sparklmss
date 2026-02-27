import { Input, SelectField, DatePicker, CheckboxField } from './FormField';
import { FormSection } from './FormSection';
import { Button } from "@/features/AddLeads/Components/ui/button";
import { Label } from "@/features/AddLeads/Components/ui/label";
import { MON_FRI, WEEKS_FIRST_THIRD, WEEKS_LATE, WEEKS_FULL, isAllowedDay, calculateNextPayday } from './PayrollUtils';
import { isSameDay, startOfDay, addDays } from 'date-fns'; // Added addDays here

const mapPaydayFields = (form: any, sfx: string | number) => ({ DayOfWeek: form['DayOfWeek' + sfx], DayOfWeek1: form['DayOfWeek1' + sfx], DayOfWeek2: form['DayOfWeek2' + sfx], PayWeek1: form['PayWeek1' + sfx], PayWeek2: form['PayWeek2' + sfx], SemiMonthlyPayDay01: form['SemiMonthlyPayDay01' + sfx], SemiMonthlyPayDay02: form['SemiMonthlyPayDay02' + sfx], MonthlyPayDay: form['MonthlyPayDay' + sfx], });
export const validateEmployer = (
  form: any,
  paydayMode: Record<number, string> | undefined,
  employerCount: number
) => {
  let errors: any = {};
  const today = startOfDay(new Date());
  const modeMap = paydayMode || {};
  for (let i = 0; i < employerCount; i++) {
    const sfx = i === 0 ? "" : i; // Suffix: "", "1", "2"
    const mode = modeMap[i];
    if (!form['EmploymentType' + sfx]) errors['EmploymentType' + sfx] = "Required";
    if (!form['SourceIncome' + sfx]) errors['SourceIncome' + sfx] = "Required";
    if (form['SourceIncome' + sfx] === 'Employed') {
      if (!form['EmployerName' + sfx]) errors['EmployerName' + sfx] = "Employer Name required";
      if (!form['WorkPhone' + sfx]) errors['WorkPhone' + sfx] = "Work Phone required";
      else if (form['WorkPhone' + sfx].replace(/\D/g, '').length < 10) errors['WorkPhone' + sfx] = "10 digits required";

      if (!form['EmployerState' + sfx]) errors['EmployerState' + sfx] = "State required";
      if (!form['EmployerCity' + sfx]) errors['EmployerCity' + sfx] = "City required";
      if (!form['EmployerZip' + sfx]) errors['EmployerZip' + sfx] = "Zip required";
      else if (form['EmployerZip' + sfx].length < 5) errors['EmployerZip' + sfx] = "5 digits required";
    }
    if (form['SourceIncome' + sfx] === 'Other' && !form['OtherIncomeType' + sfx]) {
      errors['OtherIncomeType' + sfx] = "Specify type";
    }
    if (!form['GrossPay' + sfx]) errors['GrossPay' + sfx] = "Pay amount required";
    if (!form['Frequency' + sfx]) errors['Frequency' + sfx] = "Frequency required";
    if (!form['HowPaid' + sfx]) errors['HowPaid' + sfx] = "Method required";
    if (mode === 'day_of_week' && !form['DayOfWeek' + sfx]) {
      errors['DayOfWeek' + sfx] = "Select day";
    }
    if (mode === 'semi_dates') {
      if (!form['SemiMonthlyPayDay01' + sfx])
        errors['SemiMonthlyPayDay01' + sfx] = "1st date required";
      if (!form['SemiMonthlyPayDay02' + sfx])
        errors['SemiMonthlyPayDay02' + sfx] = "2nd date required";
    }
    if (mode === 'semi_weeks') {
      if (!form['PayWeek1' + sfx]) errors['PayWeek1' + sfx] = "Required";
      if (!form['DayOfWeek1' + sfx]) errors['DayOfWeek1' + sfx] = "Required";
      if (!form['PayWeek2' + sfx]) errors['PayWeek2' + sfx] = "Required";
      if (!form['DayOfWeek2' + sfx]) errors['DayOfWeek2' + sfx] = "Required";
    }
    if (mode === 'monthly_date' && !form['MonthlyPayDay' + sfx]) {
      errors['MonthlyPayDay' + sfx] = "Required";
    }
    if (!form['LastPayDate' + sfx]) {
      errors['LastPayDate' + sfx] = "Required";
    } else if (new Date(form['LastPayDate' + sfx]) > today) {
      errors['LastPayDate' + sfx] = "Must be past";
    }
    if (!form['NextPayDate' + sfx]) {
      errors['NextPayDate' + sfx] = "Required";
    } else if (new Date(form['NextPayDate' + sfx]) <= today) {
      errors['NextPayDate' + sfx] = "Must be future";
    }
    if (!form['SecondPayDate' + sfx]) errors['SecondPayDate' + sfx] = "Required";
    if (!form['FirstPaymentDate' + sfx]) errors['FirstPaymentDate' + sfx] = "Required";
    if (!form['FirstPaymentDate' + sfx]) {
      errors['FirstPaymentDate' + sfx] = "Required";
    } else {
      const firstPay = startOfDay(new Date(form['FirstPaymentDate' + sfx]));
      const nextPay = form['NextPayDate' + sfx] ? startOfDay(new Date(form['NextPayDate' + sfx])) : null;
      const secondPay = form['SecondPayDate' + sfx] ? startOfDay(new Date(form['SecondPayDate' + sfx])) : null;
      if (
        (nextPay && !isSameDay(firstPay, nextPay)) && (secondPay && !isSameDay(firstPay, secondPay))
      ) {
        errors['FirstPaymentDate' + sfx] = "Select only Next Pay Date or Second Pay Date";
      }
    }
  }
  return errors;
};
export const EmployerInformation = ({
  form, errors, updateField, paydayMode, howPaidOptions,
  handleFrequencyChange, handleHowPaidSelect, formatPhone,
  employerCount, setEmployerCount, handleEmpStateChange, handleEmpCityChange, // Handlers passed from parent
  states = [],
  empCities = {},
  empZips = {},
}: any) => {
  const today = startOfDay(new Date());
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
  const clearEmployerData = (indexToRemove: number) => {
    const sfx = indexToRemove === 0 ? "" : indexToRemove.toString();
    const fieldsToClear = [
      'EmploymentType', 'SourceIncome', 'EmployerName', 'JobTitle', 'WorkPhone',
      'EmployerState', 'EmployerCity', 'EmployerZip', 'EmpAddress1', 'EmpAddress2',
      'SupervisorName', 'SupervisorPhone', 'EmpStartDate', 'OtherIncomeType',
      'GrossPay', 'ReceivePaycheck', 'Frequency', 'HowPaid', 'DayOfWeek',
      'DayOfWeek1', 'DayOfWeek2', 'PayWeek1', 'PayWeek2',
      'SemiMonthlyPayDay01', 'SemiMonthlyPayDay02', 'MonthlyPayDay',
      'LastPayDate', 'NextPayDate', 'SecondPayDate', 'FirstPaymentDate'];
    fieldsToClear.forEach(field => {
      updateField(field + sfx, '');
    });
  };
  const adjustToMonday = (date: Date | null | undefined) => {
    if (!date) return null;
    const d = new Date(date);
    const day = d.getDay();
    if (day === 6) return addDays(d, 2); // Sat -> Mon
    if (day === 0) return addDays(d, 1); // Sun -> Mon
    return d;
  };
  const isAllowedWorkDay = (date: Date, index: number, sfx: string) => {
    if (isWeekend(date)) return false;
    const context = index === 0 ? form : { ...form, ...mapPaydayFields(form, sfx) };
    const mode = paydayMode[index];
    if (date.getDay() === 1) {
      return isAllowedDay(date, context, mode) ||
        isAllowedDay(addDays(date, -1), context, mode) ||
        isAllowedDay(addDays(date, -2), context, mode);
    }
    return isAllowedDay(date, context, mode);
  };
  const incomeOptions = ["Employed", "Self-employed", "Retirement", "Disability", "Social Security", "Other"];
  return (
    <>
      {[...Array(employerCount)].map((_, index) => {
        const sfx = index === 0 ? "" : index.toString();
        const currentEmpStateName = states.find((s: any) =>
          s.StateShortCode === form['EmployerState' + sfx]
        )?.StateName || "";
        const currentIncomeOptions = form['EmploymentType' + sfx] === 'Other'
          ? incomeOptions.filter(opt => opt !== "Employed")
          : incomeOptions;
        return (
          <FormSection
            key={index}
            title={index === 0 ? "Employer & Payroll Information" : `Secondary Employer #${index}`}
            colorClass="bg-emerald-500"
            extra={index !== 0 ? (
              <Button
                variant="ghost"
                onClick={() => {
                  clearEmployerData(index); // Clear the data first
                  setEmployerCount((prev: number) => prev - 1); // Then remove the form
                }}
                className="w-full md:w-auto text-red-500 hover:bg-red-50 h-10 md:h-9"
              >
                <span className="material-symbols-outlined mr-1">delete</span>
                Remove Employer
              </Button>
            ) : null} >
            <SelectField
              label="Employment Type"
              id={"EmploymentType" + sfx}
              error={errors['EmploymentType' + sfx]}
              value={form['EmploymentType' + sfx]}
              options={["Full-Time", "Part-Time", "Other"]}
              onValueChange={(v: any) => updateField('EmploymentType' + sfx, v)} />
            <SelectField
              label="Income Type"
              id={"SourceIncome" + sfx}
              error={errors['SourceIncome' + sfx]}
              value={form['SourceIncome' + sfx]}
              placeholder="--Select--"
              options={currentIncomeOptions} // Using filtered options
              onValueChange={(v: any) => updateField('SourceIncome' + sfx, v)} />
            {form['SourceIncome' + sfx] === 'Employed' && (
              <>
                <Input label="Employer Name" id={"EmployerName" + sfx} error={errors['EmployerName' + sfx]} value={form['EmployerName' + sfx]} onChange={(e: any) => updateField('EmployerName' + sfx, e.target.value)} />
                <Input label="Job Title" onChange={(e: any) => updateField('JobTitle' + sfx, e.target.value)} value={form.JobTitle} />
                <Input label="Work Phone" id={"WorkPhone" + sfx} error={errors['WorkPhone' + sfx]} value={formatPhone(form['WorkPhone' + sfx] || '')} onChange={(e: any) => updateField('WorkPhone' + sfx, e.target.value)} maxLength={14} />
                <Input label="Address 1" onChange={(e: any) => updateField('EmpAddress1' + sfx, e.target.value)} value={form.EmpAddress1} />
                <Input label="Address 2" onChange={(e: any) => updateField('EmpAddress2' + sfx, e.target.value)} value={form.EmpAddress1} />
                <SelectField
                  label="State"
                  id={"EmployerState" + sfx}
                  value={currentEmpStateName}
                  options={states.map((s: any) => s.StateName)}
                  onValueChange={(name: string) => handleEmpStateChange(name, index)}
                  error={errors['EmployerState' + sfx]} />
                <SelectField
                  label="City"
                  id={"EmployerCity" + sfx}
                  value={form['EmployerCity' + sfx]}
                  options={empCities[index] || []}
                  onValueChange={(city: string) => handleEmpCityChange(city, index)}
                  error={errors['EmployerCity' + sfx]} />
                <SelectField
                  label="Zip"
                  id={"EmployerZip" + sfx}
                  value={form['EmployerZip' + sfx]}
                  options={empZips[index] || []}
                  onValueChange={(zip: string) => updateField('EmployerZip' + sfx, zip)}
                  error={errors['EmployerZip' + sfx]} />
                <Input label="Supervisor Name" onChange={(e: any) => updateField('SupervisorName' + sfx, e.target.value)} value={form.SupervisorName} />
                <Input label="Supervisor Phone" type="tel" onChange={(e: any) => updateField('SupervisorPhone' + sfx, formatPhone(e.target.value))} value={form.SupervisorPhone} />
                <DatePicker label="Emp Start Date" onDateChange={(d: any) => updateField('EmpStartDate' + sfx, d)} value={form['EmpStartDate' + sfx] ? new Date(form['EmpStartDate' + sfx]) : undefined} disabled={(date: any) => date > today} />
              </>
            )}
            {form['SourceIncome' + sfx] === 'Other' && <Input label="Specify Other Income Type" value={form['OtherIncomeType' + sfx] || ""} id={"OtherIncomeType" + sfx} error={errors['OtherIncomeType' + sfx]} onChange={(e: any) => updateField('OtherIncomeType' + sfx, e.target.value)} />}
            <Input label="Last Check Amount" id={"GrossPay" + sfx} error={errors['GrossPay' + sfx]} value={form['GrossPay' + sfx]} prefix="$" placeholder="0.00" onChange={(e: any) => updateField('GrossPay' + sfx, e.target.value)} />
            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Income Method</Label>
              <div className="flex space-x-4 pt-1">
                <CheckboxField label="Direct Deposit" id={`im-d-${index}`} checked={form['ReceivePaycheck' + sfx] === 'D'} onCheckedChange={() => updateField('ReceivePaycheck' + sfx, 'D')} />
                <CheckboxField label="Paper Check" id={`im-p-${index}`} checked={form['ReceivePaycheck' + sfx] === 'P'} onCheckedChange={() => updateField('ReceivePaycheck' + sfx, 'P')} />
              </div>
            </div>
            <SelectField
              label="How often do you receive a paycheck?"
              id={"Frequency" + sfx}
              error={errors['Frequency' + sfx]}
              options={["Weekly", "Every Other Week", "Semi-Monthly", "Monthly"]}
              value={form['Frequency' + sfx]}
              onValueChange={(v: any) => {
                updateField('Frequency' + sfx, v); // This clears the error
                handleFrequencyChange(v, index);   // This updates the logic
              }} />
            <SelectField
              label="How Paid"
              id={"HowPaid" + sfx}
              error={errors['HowPaid' + sfx]}
              placeholder={form['Frequency' + sfx] ? "--Select--" : "Select Frequency First"}
              options={(howPaidOptions[index] || []).map((o: any) => o.label)}
              value={form['HowPaid' + sfx]}
              onValueChange={(v: any) => {
                updateField('HowPaid' + sfx, v); // This clears the error
                handleHowPaidSelect(v, index);   // This updates the logic
              }} /><>
              {paydayMode[index] === 'day_of_week' && (
                <SelectField
                  label="Which day of the week?"
                  id={"DayOfWeek" + sfx}
                  value={form['DayOfWeek' + sfx]}
                  error={errors['DayOfWeek' + sfx]}
                  options={MON_FRI}
                  onValueChange={(v: any) => updateField('DayOfWeek' + sfx, v)} />
              )}
              {paydayMode[index] === 'semi_dates' && (
                <div className="col-span-full grid grid-cols-2 gap-4">
                  <SelectField
                    label="1st Pay Day"
                    id={"SemiMonthlyPayDay01" + sfx}
                    value={form['SemiMonthlyPayDay01' + sfx]}
                    error={errors['SemiMonthlyPayDay01' + sfx]}
                    options={Array.from({ length: 18 }, (_, i) => (i + 1).toString())}
                    onValueChange={(v: any) => updateField('SemiMonthlyPayDay01' + sfx, v)} />
                  <SelectField
                    label="2nd Pay Day"
                    id={"SemiMonthlyPayDay02" + sfx}
                    value={form['SemiMonthlyPayDay02' + sfx]}
                    error={errors['SemiMonthlyPayDay02' + sfx]}
                    options={Array.from({ length: 19 }, (_, i) => (i + 12).toString()).concat("EOM")}
                    onValueChange={(v: any) => updateField('SemiMonthlyPayDay02' + sfx, v)} />
                </div>
              )}
              {paydayMode[index] === 'semi_weeks' && (
                <div className="col-span-full grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SelectField
                    label="1st Pay Week"
                    id={"PayWeek1" + sfx}
                    error={errors['PayWeek1' + sfx]}
                    value={form['PayWeek1' + sfx]}
                    options={WEEKS_FIRST_THIRD}
                    onValueChange={(v: any) => updateField('PayWeek1' + sfx, v)} />
                  <SelectField
                    label="1st Pay Day"
                    id={"DayOfWeek1" + sfx}
                    error={errors['DayOfWeek1' + sfx]}
                    value={form['DayOfWeek1' + sfx]}
                    options={MON_FRI}
                    onValueChange={(v: any) => updateField('DayOfWeek1' + sfx, v)} />
                  <SelectField
                    label="2nd Pay Week"
                    id={"PayWeek2" + sfx}
                    error={errors['PayWeek2' + sfx]}
                    value={form['PayWeek2' + sfx]}
                    options={WEEKS_LATE}
                    onValueChange={(v: any) => updateField('PayWeek2' + sfx, v)} />
                  <SelectField
                    label="2nd Pay Day"
                    id={"DayOfWeek2" + sfx}
                    error={errors['DayOfWeek2' + sfx]}
                    value={form['DayOfWeek2' + sfx]}
                    options={MON_FRI}
                    onValueChange={(v: any) => updateField('DayOfWeek2' + sfx, v)} />
                </div>
              )}
              {paydayMode[index] === 'monthly_date' && (
                <SelectField
                  label="Monthly Pay Day"
                  id={"MonthlyPayDay" + sfx}
                  error={errors['MonthlyPayDay' + sfx]}
                  value={form['MonthlyPayDay' + sfx]}
                  options={Array.from({ length: 30 }, (_, i) => (i + 1).toString())}
                  onValueChange={(v: any) => updateField('MonthlyPayDay' + sfx, v)} />
              )}
              {paydayMode[index] === 'monthly_week' && (
                <div className="col-span-full grid grid-cols-2 gap-4">
                  <SelectField
                    label="Which Week?"
                    id={"PayWeek1" + sfx}
                    value={form['PayWeek1' + sfx]}
                    error={errors['PayWeek1' + sfx]}
                    options={WEEKS_FULL}
                    onValueChange={(v: any) => updateField('PayWeek1' + sfx, v)} />
                  <SelectField
                    label="Which Day?"
                    id={"DayOfWeek" + sfx} error={errors['DayOfWeek' + sfx]}
                    value={form['DayOfWeek' + sfx]}
                    options={MON_FRI}
                    onValueChange={(v: any) => updateField('DayOfWeek' + sfx, v)} />
                </div>
              )}</>
            <DatePicker
              key={"LPD" + sfx + (form['Frequency' + sfx] || '') + (form['HowPaid' + sfx] || '')}
              label="Last Pay Date"
              id={"LastPayDate" + sfx}
              error={errors['LastPayDate' + sfx]}
              value={form['LastPayDate' + sfx] ? new Date(form['LastPayDate' + sfx]) : undefined}
              onDateChange={(d: any) => updateField('LastPayDate' + sfx, d)}
              disabled={(date: any) => date > today || isWeekend(date)} />
            <DatePicker
              key={"NPD" + sfx + (form['Frequency' + sfx] || '') + (form['HowPaid' + sfx] || '')}
              label="Next Pay Date"
              id={"NextPayDate" + sfx}
              error={errors['NextPayDate' + sfx]}
              value={form['NextPayDate' + sfx] ? new Date(form['NextPayDate' + sfx]) : undefined}
              onDateChange={(d: any) => updateField('NextPayDate' + sfx, d)}
              disabled={(date: any) => date <= today || !isAllowedWorkDay(date, index, sfx)} />
            <DatePicker
              key={"SPD" + sfx + (form['Frequency' + sfx] || '') + (form['HowPaid' + sfx] || '')}
              label="Second Pay Date"
              id={"SecondPayDate" + sfx}
              error={errors['SecondPayDate' + sfx]}
              value={form['SecondPayDate' + sfx] ? new Date(form['SecondPayDate' + sfx]) : undefined}
              disabled={(date: any) => {
                if (!form['NextPayDate' + sfx]) return true;
                const employerForm = { ...form, ...mapPaydayFields(form, sfx) };
                const rawExpected = calculateNextPayday(
                  new Date(form['NextPayDate' + sfx]),
                  employerForm,
                  paydayMode[index]
                );
                const expected = adjustToMonday(rawExpected);
                return expected ? !isSameDay(date, expected) : true;
              }} />
            <DatePicker
              key={"FPD" + sfx + (form['Frequency' + sfx] || '') + (form['HowPaid' + sfx] || '')}
              label="First Payment Date"
              id={"FirstPaymentDate" + sfx}
              error={errors['FirstPaymentDate' + sfx]}
              value={form['FirstPaymentDate' + sfx] ? new Date(form['FirstPaymentDate' + sfx]) : undefined}
              onDateChange={(d: any) => updateField('FirstPaymentDate' + sfx, d)}
              disabled={(date: any) =>
                !form['NextPayDate' + sfx] ||
                date < startOfDay(new Date(form['NextPayDate' + sfx])) ||
                !isAllowedWorkDay(date, index, sfx)
              } />
            {index === employerCount - 1 && employerCount < 3 && (
              <div className="col-span-full flex justify-start mt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setEmployerCount((prev: number) => Math.min(prev + 1, 3))
                  }
                  className="text-emerald-600 font-bold px-4 border-emerald-100 bg-emerald-50 h-9">
                  <span className="material-symbols-outlined mr-1 text-lg">add</span>
                  Add More
                </Button>
              </div>
            )}   </FormSection>
        );
      })} </>);
};
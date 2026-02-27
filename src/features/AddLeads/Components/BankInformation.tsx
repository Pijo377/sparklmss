import { Input, DatePicker, CheckboxField } from './FormField';
import { FormSection } from './FormSection';
import { Label } from "@/features/AddLeads/Components/ui/label";
export const validateBank = (form: any) => {
  let errors: any = {};
  const today = new Date();

  if (!form.AbaNumber) errors.AbaNumber = "ABA required";
  else if (form.AbaNumber.length < 9) errors.AbaNumber = "9 digits required";

  if (!form.AccountNumber) errors.AccountNumber = "Account number required";
  else if (form.AccountNumber.length < 10) errors.AccountNumber = "10 digits required";

  if (!form.AccountDate) errors.AccountDate = "Required";
  else if (new Date(form.AccountDate) > today) errors.AccountDate = "Must be in past";

  return errors;
};

export const BankInformation = ({ form, errors, updateField ,handleGetCampaign}: any) => (
  <FormSection title="Bank Information" colorClass="bg-indigo-500">
  <Input 
        label="ABA Number" 
        id="AbaNumber" 
        error={errors.AbaNumber} 
        value={form.AbaNumber} 
        maxLength={9}
        onChange={(e: any) => updateField('AbaNumber', e.target.value.replace(/\D/g, ''))}
        // This triggers when user clicks away
        onBlur={() => {
           console.log("ABA Field Lost Focus");
           handleGetCampaign();
        }} 
      />

      <Input 
        label="Account Number" 
        id="AccountNumber" 
        error={errors.AccountNumber} 
        maxLength={10} 
        value={form.AccountNumber} 
        onChange={(e: any) => updateField('AccountNumber', e.target.value.replace(/\D/g, ''))} 
      />  <DatePicker 
  label="Account Open Date" 
  id="AccountDate" 
  error={errors.AccountDate} 
  placeholder="MM/YYYY" 
  // ADD THIS LINE BELOW
  value={form.AccountDate ? new Date(form.AccountDate) : undefined}
  onDateChange={(d: any) => updateField('AccountDate', d)} 
  disabled={(date: Date) => date > new Date()} 
/> <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
      <Label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">Account Type</Label>
      <div className="flex space-x-6">
        <CheckboxField label="Checking" id="at-checking" checked={form.AccountType === 'C'} onCheckedChange={() => updateField('AccountType', 'C')} />
        <CheckboxField label="Savings" id="at-savings" checked={form.AccountType === 'S'} onCheckedChange={() => updateField('AccountType', 'S')} />
      </div>
    </div>
  </FormSection>
);
import { Label } from '@/shared/components/ui/label';
import { Input, DatePicker, CheckboxField } from './FormField';
import { FormSection } from './FormSection';
import { Landmark, Hash } from 'lucide-react';

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


export const BankInformation = ({ form, errors, updateField, borderColor = 'amber' }: any) => (
  <FormSection title="Bank Information" icon={<Landmark />} borderColor={borderColor}>
    <Input label="ABA Number" id="AbaNumber" error={errors.AbaNumber} icon={<Landmark className="h-4 w-4" />} maxLength={9} value={form.AbaNumber} onChange={(e: any) => updateField('AbaNumber', e.target.value.replace(/\D/g, ''))} />
    <Input label="Account Number" id="AccountNumber" error={errors.AccountNumber} icon={<Hash className="h-4 w-4" />} maxLength={10} value={form.AccountNumber} onChange={(e: any) => updateField('AccountNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} />
    <DatePicker
      label="Account Open Date"
      id="AccountDate"
      error={errors.AccountDate}
      placeholder="MM/YYYY"
      value={form.AccountDate ? new Date(form.AccountDate) : undefined}
      onDateChange={(d: any) => updateField('AccountDate', d)}
      disabled={(date: Date) => date > new Date()}
    />
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 block">Account Type</Label>
      <div className="flex space-x-4 pt-1">
        <CheckboxField label="Checking" id="at-checking" checked={form.AccountType === 'C'} onCheckedChange={() => updateField('AccountType', 'C')} color={borderColor} />
        <CheckboxField label="Savings" id="at-savings" checked={form.AccountType === 'S'} onCheckedChange={() => updateField('AccountType', 'S')} color={borderColor} />
      </div>
    </div>
  </FormSection>
);
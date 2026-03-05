import { Input, SelectField } from './FormField';
import { User } from 'lucide-react';

export const validateReference = (form: any) => {
  let errors: any = {};

  // Reference #1 Mobile
  if (form.RefPhone1 && form.RefPhone1.replace(/\D/g, '').length < 10) {
    errors.RefPhone1 = "Please enter valid Mobile Phone Number";
  }

  // Reference #2 Mobile
  if (form.RefPhone2 && form.RefPhone2.replace(/\D/g, '').length < 10) {
    errors.RefPhone2 = "Please enter valid Mobile Phone Number";
  }

  return errors;
};

export const ReferenceInformation = ({ form, updateField, formatPhone, errors }: any) => (
  <div className="mb-14">
    <div className="flex items-center mb-8 border-b border-slate-100 pb-4">
      <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
      <h2 className="text-xl font-semibold text-slate-900">Reference Information</h2>
    </div>
    {[1, 2].map((n) => (
      <div key={n} className="bg-slate-50/30 p-6 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 border-slate-100">
        <Input
          label={`Ref #${n} Name`}
          icon={<User className="h-4 w-4" />}
          value={form[`RefName${n}`] || ""} // Added value
          onChange={(e: any) => updateField(`RefName${n}`, e.target.value)}
        />
        <SelectField
          label="Relation"
          options={["Parent", "Sibling", "Friend", "Other"]}
          value={form[`RefRelation${n}`] || ""} // Added value
          onValueChange={(v: any) => updateField(`RefRelation${n}`, v)}
        />
        <Input
          label="Mobile Phone"
          id={`RefPhone${n}`}
          error={errors?.[`RefPhone${n}`]}
          placeholder="(000) 000-0000"
          maxLength={14}
          value={formatPhone(form[`RefPhone${n}`] || "")}
          onChange={(e: any) => updateField(`RefPhone${n}`, e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={form[`RefEmail${n}`] || ""} // Added value
          onChange={(e: any) => updateField(`RefEmail${n}`, e.target.value)}
        />
      </div>
    ))}
  </div>
);
import { Input, SelectField } from './FormField';
import { Users } from 'lucide-react';
import { FormSection } from './FormSection';

export const validateReference = (form: any) => {
  const errors: any = {};

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

export const ReferenceInformation = ({ form, updateField, formatPhone, errors, borderColor = 'indigo' }: any) => (
  <FormSection title="Reference Information" icon={<Users />} borderColor={borderColor}>
    {[1, 2].map((n, idx) => (
      <div key={n} className="col-span-full">
        {idx > 0 && (
          <div className="my-4 border-t border-dashed border-slate-300" />
        )}
        <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-indigo-100 text-indigo-600 text-[11px] font-bold">{n}</span>
          Personal Contact
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Input
            label="First Name"
            value={form[`RefFirstName${n}`] || ""}
            onChange={(e: any) => updateField(`RefFirstName${n}`, e.target.value)}
          />
          <Input
            label="Last Name"
            value={form[`RefLastName${n}`] || ""}
            onChange={(e: any) => updateField(`RefLastName${n}`, e.target.value)}
          />
          <SelectField
            label="Relation"
            options={["Parent", "Sibling", "Friend", "Other"]}
            value={form[`RefRelation${n}`] || ""}
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
        </div>
      </div>
    ))}
  </FormSection>
);
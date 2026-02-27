import { Input, SelectField } from './FormField';

export const validateReference = (form: any) => {
  let errors: any = {};

  // Reference #1 Mobile
  if (form.RefMobile && form.RefMobile.replace(/\D/g, '').length < 10) {
    errors.RefMobile = "Please enter valid Mobile Phone Number";
  }

  // Reference #2 Mobile
  if (form.RefMobile2 && form.RefMobile2.replace(/\D/g, '').length < 10) {
    errors.RefMobile2 = "Please enter valid Mobile Phone Number";
  }

  return errors;
};

export const ReferenceInformation = ({ form, errors, updateField, formatPhone }: any) => {
  const relations = ["PARENT", "FRIEND", "SIBLING", "UNCLE", "AUNT", "COUSIN", "OTHERS"];

  return (
    <div className="mb-14">
      <div className="flex items-center mb-8 border-b border-slate-100 pb-4">
        <div className="w-1 h-6 bg-orange-500 rounded-full mr-3"></div>
        <h2 className="text-xl font-semibold text-slate-900">Reference Information</h2>
      </div>

      {/* Reference #1 */}
      <div className="bg-slate-50/30 p-6 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 border-slate-100">
        <div className="col-span-full font-bold text-slate-400 text-xs uppercase mb-2">Personal Contact #1</div>
        <Input
          label="First Name"
          value={form.RefFirstName || ""}
          onChange={(e: any) => updateField('RefFirstName', e.target.value)}
        />
        <Input
          label="Last Name"
          value={form.RefLastName || ""}
          onChange={(e: any) => updateField('RefLastName', e.target.value)}
        />
        <SelectField
          label="Relation"
          options={relations}
          value={form.Relation || ""}
          onValueChange={(v: any) => updateField('Relation', v)}
        />
        <Input
          label="Mobile Phone"
          id="RefMobile"
          error={errors?.RefMobile}
          placeholder="(000) 000-0000"
          maxLength={14}
          value={formatPhone(form.RefMobile || "")}
          onChange={(e: any) => updateField('RefMobile', e.target.value)}
        />
      </div>

      {/* Reference #2 */}
      <div className="bg-slate-50/30 p-6 rounded-xl border grid grid-cols-1 md:grid-cols-4 gap-4 border-slate-100">
        <div className="col-span-full font-bold text-slate-400 text-xs uppercase mb-2">Personal Contact #2</div>
        <Input
          label="First Name"
          value={form.RefFirstName2 || ""}
          onChange={(e: any) => updateField('RefFirstName2', e.target.value)}
        />
        <Input
          label="Last Name"
          value={form.RefLastName2 || ""}
          onChange={(e: any) => updateField('RefLastName2', e.target.value)}
        />
        <SelectField
          label="Relation"
          options={relations}
          value={form.RefRelation2 || ""}
          onValueChange={(v: any) => updateField('RefRelation2', v)}
        />
        <Input
          label="Mobile Phone"
          id="RefMobile2"
          error={errors?.RefMobile2}
          placeholder="(000) 000-0000"
          maxLength={14}
          value={formatPhone(form.RefMobile2 || "")}
          onChange={(e: any) => updateField('RefMobile2', e.target.value)}
        />
      </div>
    </div>
  );
};
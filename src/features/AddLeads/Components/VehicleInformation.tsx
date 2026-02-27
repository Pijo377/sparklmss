import { useState } from 'react';
import { Input, DatePicker, CheckboxField } from './FormField';
import { FormSection } from './FormSection';
import { Button } from "@/features/AddLeads/Components/ui/button";
import { Label } from "@/features/AddLeads/Components/ui/label";

// Define interface for VIN data to avoid TypeScript "any" errors
interface VinData {
  ModelYear?: string;
  Make?: string;
  Model?: string;
  Manufacturer?: string;
  EngineHP?: string;
  TransmissionStyle?: string;
  ErrorCode?: string;
}

export const validateVehicle = (form: any) => {
  let errors: any = {};
  // Match Angular logic: visible for Auto Title product OR if 'Is Autotitle' is checked for CAB
  const isVisible = form.LoanType === 'Auto Title' || form.isAutoTitle === 'Y';

  if (isVisible) {
    if (!form.vehYear) errors.vehYear = "Required";
    if (!form.vehMake) errors.vehMake = "Required";
    if (!form.vehModel) errors.vehModel = "Required";
    if (!form.vin) errors.vin = "VIN required";
    else if (form.vin.length < 17) errors.vin = "Should be a 17 digit alphanumeric value";

    if (!form.licensePlate) errors.licensePlate = "Plate required";
    if (!form.certTitle) errors.certTitle = "Title Certificate required";
    if (!form.file_dl) errors.file_dl = "Driving License Document required";
    if (!form.file_insurance) errors.file_insurance = "Insurance Document required";
  }
  return errors;
};

export const VehicleInformation = ({
  form,
  errors,
  updateField,
  isFetchingVin,
  handleGetVinInfo,
  vinInfo,
  isVinModalOpen,
  setIsVinModalOpen,
  applyVinInfo
}: any) => {

  // Local state for dynamic additional file rows
  const [additionalDocs, setAdditionalDocs] = useState<number[]>([]);

  // Only render if it's an Auto Title scenario
  if (form.LoanType !== 'Auto Title' && form.isAutoTitle !== 'Y') return null;

  const today = new Date();

  const addFileSlot = () => {
    setAdditionalDocs([...additionalDocs, Date.now()]);
  };

  const removeFileSlot = (id: number) => {
    setAdditionalDocs(additionalDocs.filter(item => item !== id));
  };

  return (
    <FormSection title="Vehicle Information" colorClass="bg-amber-500">

      {/* ROW 1: BASIC SPECS */}
      <Input label="Vehicle Year" id="vehYear" error={errors.vehYear} value={form.vehYear} onChange={(e: any) => updateField('vehYear', e.target.value)} />
      <Input label="Vehicle Make" id="vehMake" error={errors.vehMake} value={form.vehMake} onChange={(e: any) => updateField('vehMake', e.target.value)} />
      <Input label="Vehicle Model" id="vehModel" error={errors.vehModel} value={form.vehModel} onChange={(e: any) => updateField('vehModel', e.target.value)} />
      <Input label="Vehicle Number" id="vehNumber" value={form.vehNumber} onChange={(e: any) => updateField('vehNumber', e.target.value)} />
      <Input label="Vehicle Owner Name" id="vehOwner" value={form.vehOwner || ""} onChange={(e: any) => updateField('vehOwner', e.target.value)} />
      {/* VIN INPUT WITH LOOKUP BUTTON */}
      <div className="relative w-full">
        <div className="flex items-center gap-1 mb-1">
          <Label className="text-[11px] font-bold uppercase text-slate-500">VIN</Label>
          <Button
            variant="ghost"
            type="button"
            title="Fetch Vehicle Info"
            onClick={handleGetVinInfo}
            className="h-5 w-5 p-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white transition-colors"
          >
            {isFetchingVin ? (
              <span className="animate-spin text-[10px]">⏳</span>
            ) : (
              "!"
            )}

          </Button>
        </div>
        <Input
          id="vin"
          error={errors.vin}
          value={form.vin}
          onChange={(e: any) => updateField('vin', e.target.value.toUpperCase())}
          maxLength={17}
          placeholder="Enter 17-digit VIN"
        />
      </div>

      {/* ROW 2: IDENTIFICATION & STATUS */}
      <Input label="Chassis Number" id="chaseNumber" value={form.chaseNumber} onChange={(e: any) => updateField('chaseNumber', e.target.value)} />
      <Input label="Insurance Number" id="insuranceNumber" value={form.insuranceNumber} onChange={(e: any) => updateField('insuranceNumber', e.target.value)} />

      <DatePicker
        label="Driving License Expiry Date"
        id="expDate"
        error={errors.expDate}
        value={form.expDate ? new Date(form.expDate) : undefined}
        onDateChange={(d: any) => updateField('expDate', d)}
      />

      <Input label="Mileage" id="mileage" value={form.mileage} onChange={(e: any) => updateField('mileage', e.target.value)} />

      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-slate-500 uppercase">Vehicle is Paid-Off</Label>
        <div className="flex space-x-4 pt-1">
          <CheckboxField label="Yes" id="po-yes" checked={form.paidOff === 'Y'} onCheckedChange={() => updateField('paidOff', 'Y')} />
          <CheckboxField label="No" id="po-no" checked={form.paidOff === 'N'} onCheckedChange={() => updateField('paidOff', 'N')} />
        </div>
      </div>

      {/* ROW 3: CERTIFICATES & PLATES */}
      <Input label="Title Certificate" id="certTitle" error={errors.certTitle} value={form.certTitle} onChange={(e: any) => updateField('certTitle', e.target.value)} />
      <Input label="Licence Plate" id="licensePlate" error={errors.licensePlate} value={form.licensePlate} onChange={(e: any) => updateField('licensePlate', e.target.value)} />

      {/* FILE UPLOADS */}
      <div className="space-y-1">
        <Label className={`text-[11px] font-bold uppercase ${errors.file_dl ? 'text-red-500' : 'text-slate-500'}`}>Driving License (Upload)</Label>
        <input
          type="file"
          className={`flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium ${errors.file_dl ? 'bg-red-50/50 ring-1 ring-red-200' : ''}`}
          onChange={(e: any) => updateField('file_dl', e.target.files[0])}
        />
        {errors.file_dl && <p className="text-[10px] text-red-500 font-medium">*{errors.file_dl}</p>}
      </div>

      <div className="space-y-1">
        <Label className={`text-[11px] font-bold uppercase ${errors.file_insurance ? 'text-red-500' : 'text-slate-500'}`}>Insurance Document (Upload)</Label>
        <input
          type="file"
          className={`flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium ${errors.file_insurance ? 'bg-red-50/50 ring-1 ring-red-200' : ''}`}
          onChange={(e: any) => updateField('file_insurance', e.target.files[0])}
        />
        {errors.file_insurance && <p className="text-[10px] text-red-500 font-medium">*{errors.file_insurance}</p>}
      </div>

      <div className="flex items-end pb-1">
        <Button
          type="button"
          variant="outline"
          onClick={addFileSlot}
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold h-11"
        >
          <span className="material-symbols-outlined mr-1">add_a_photo</span>
          Add More Documents
        </Button>
      </div>

      {/* DYNAMIC ADDITIONAL FILES LIST */}
      {additionalDocs.map((id, index) => (
        <div key={id} className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300 animate-in fade-in slide-in-from-top-1">
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Additional Document #{index + 1}</Label>
            <input
              type="file"
              className="w-full text-sm"
              onChange={(e: any) => updateField(`file_extra_${id}`, e.target.files[0])}
            />
          </div>
          <Button variant="ghost" onClick={() => removeFileSlot(id)} className="text-red-500 w-fit hover:bg-red-50">
            <span className="material-symbols-outlined mr-1">close</span> Remove
          </Button>
        </div>
      ))}

      {/* --- VIN MODAL OVERLAY --- */}
      {isVinModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500 p-1 rounded-full">
                  <span className="material-symbols-outlined text-white text-xl">directions_car</span>
                </div>
                <h3 className="font-bold text-lg">VIN Details: {form.vin}</h3>
              </div>
              <button
                onClick={() => setIsVinModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 grid grid-cols-2 gap-y-8 gap-x-12">
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs uppercase font-bold">Model Year</Label>
                <p className="font-semibold text-slate-800">{vinInfo?.ModelYear || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs uppercase font-bold">Make</Label>
                <p className="font-semibold text-slate-800">{vinInfo?.Make || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs uppercase font-bold">Model</Label>
                <p className="font-semibold text-slate-800">{vinInfo?.Model || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs uppercase font-bold">Manufacturer</Label>
                <p className="font-semibold text-slate-800">{vinInfo?.Manufacturer || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs uppercase font-bold">Transmission</Label>
                <p className="font-semibold text-slate-800">{vinInfo?.TransmissionStyle || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs uppercase font-bold">Engine HP</Label>
                <p className="font-semibold text-slate-800">{vinInfo?.EngineHP || 'N/A'}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-50 border-t flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsVinModalOpen(false)}
                className="rounded-lg px-6"
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 rounded-lg"
                onClick={applyVinInfo}
              >
                <span className="material-symbols-outlined mr-2">done_all</span>
                Apply to Form
              </Button>
            </div>
          </div>
        </div>
      )}
    </FormSection>
  );
};
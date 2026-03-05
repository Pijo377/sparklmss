import { useState } from 'react';
import { Input, DatePicker, CheckboxField } from './FormField';
import { FormSection } from './FormSection';
import { Button } from './ui/button';
import { addLeadsService } from '../Services/addleadsService';
import { Label } from '@/shared/components/ui/label';
import { startOfDay } from 'date-fns';
import { VinDetailsModal } from './VinDetailsModal';
import { Loader2 } from 'lucide-react';

export const validateVehicle = (form: any) => {
  let errors: any = {};
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

export const VehicleInformation = ({ form, errors, updateField }: any) => {
  // Local state to handle dynamic "Add More Files"
  const [additionalDocs, setAdditionalDocs] = useState<number[]>([]);
  const [vinError, setVinError] = useState<string>("");
  const [vinResponse, setVinResponse] = useState<any>(null);
  const [showVinModal, setShowVinModal] = useState(false);
  const [vinLoading, setVinLoading] = useState(false);

  if (form.LoanType !== 'Auto Title' && form.isAutoTitle !== 'Y') return null;
  const today = startOfDay(new Date());

  const addFileSlot = () => {
    setAdditionalDocs([...additionalDocs, Date.now()]);
  };

  const removeFileSlot = (id: number) => {
    setAdditionalDocs(additionalDocs.filter(item => item !== id));
  };
  const handleVinLookup = async () => {
    if (form.vin?.length !== 17) return;

    try {
      setVinLoading(true);

      const res = await addLeadsService.getVinInfo(form.vin);
      console.log("VIN API Response:", res);

      setVinResponse(res);
      setShowVinModal(true);
    } catch (err) {
      console.error("VIN lookup failed", err);
    } finally {
      setVinLoading(false);
    }
  };

  const applyVinToForm = (vinData: any) => {
    const d = vinData.Results?.[0];
    if (!d) return;

    updateField("vehYear", d.ModelYear || "");
    updateField("vehMake", d.Make || "");
    updateField("vehModel", d.Model || "");
    updateField("mileage", ""); // VIN does not provide mileage
    updateField("vehOwner", ""); // VIN does not provide owner

    updateField("engineCylinders", d.EngineCylinders || "");
    updateField("engineHP", d.EngineHP || "");
    updateField("fuelType", d.FuelTypePrimary || "");
    updateField("transmission", d.TransmissionStyle || "");
    updateField("seatBelts", d.SeatBeltsAll || "");

    updateField("airBag", d.AirBagLocFront || "");
  };


  return (
    <FormSection title="Vehicle Information" colorClass="bg-amber-500">
      {/* ROW 1 */}
      <Input label="Vehicle Year" id="vehYear" error={errors.vehYear} value={form.vehYear} onChange={(e: any) => updateField('vehYear', e.target.value)} />
      <Input label="Vehicle Make" id="vehMake" error={errors.vehMake} value={form.vehMake} onChange={(e: any) => updateField('vehMake', e.target.value)} />
      <Input label="Vehicle Model" id="vehModel" error={errors.vehModel} value={form.vehModel} onChange={(e: any) => updateField('vehModel', e.target.value)} />
      <Input label="Vehicle Number" id="vehNumber" value={form.vehNumber} onChange={(e: any) => updateField('vehNumber', e.target.value)} />
      <Input label="Vehicle Owner Name" id="vehOwner" value={form.vehOwner} onChange={(e: any) => updateField('vehOwner', e.target.value)} />

      <div className="relative w-full">
        <div className="flex items-center gap-1 mb-1">
          <Label className="text-[11px] font-bold uppercase text-slate-500">VIN</Label>
       <Button
  variant="ghost"
  type="button"
  disabled={vinLoading || form.vin?.length !== 17}
  onClick={handleVinLookup}
  className="h-5 w-5 p-0 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 disabled:opacity-60"
>
  {vinLoading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    "!"
  )}
</Button>



        </div>
        <Input
          id="vin"
          value={form.vin}
          error={vinError}
          maxLength={17}
          onChange={(e: any) => {
            const value = e.target.value.toUpperCase();
            updateField("vin", value);

            if (value.length > 0 && value.length < 17) {
              setVinError("VIN must be 17 characters");
            } else {
              setVinError("");
            }
          }}
        />

      </div>

      {/* ROW 2 */}
      <Input label="Chassis Number" id="chaseNumber" value={form.chaseNumber} onChange={(e: any) => updateField('chaseNumber', e.target.value)} />
      <Input label="Insurance Number" id="insuranceNumber" value={form.insuranceNumber} onChange={(e: any) => updateField('insuranceNumber', e.target.value)} />
      <DatePicker
        label="Driving License Expiry Date"
        id="expDate"
        error={errors.expDate}
        value={form.expDate ? new Date(form.expDate) : undefined}
        onDateChange={(d: any) => updateField('expDate', d)}
        disabled={(date: Date) => date < today}   // disable past dates
      />

      <Input label="Mileage" id="mileage" value={form.mileage} onChange={(e: any) => updateField('mileage', e.target.value)} />

      <div className="space-y-1.5">
        <Label className="text-[11px] font-bold text-slate-500 uppercase">Vehicle is Paid-Off</Label>
        <div className="flex space-x-4 pt-1">
          <CheckboxField label="Yes" id="po-yes" checked={form.paidOff === 'Y'} onCheckedChange={() => updateField('paidOff', 'Y')} />
          <CheckboxField label="No" id="po-no" checked={form.paidOff === 'N'} onCheckedChange={() => updateField('paidOff', 'N')} />
        </div>
      </div>

      {/* ROW 3 */}
      <Input label="Title Certificate" id="certTitle" error={errors.certTitle} value={form.certTitle} onChange={(e: any) => updateField('certTitle', e.target.value)} />
      <Input label="Licence Plate" id="licensePlate" error={errors.licensePlate} value={form.licensePlate} onChange={(e: any) => updateField('licensePlate', e.target.value)} />

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
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold"
        >
          Add More Files
        </Button>
      </div>

      {/* DYNAMIC ADDITIONAL FILES */}
      {additionalDocs.map((id, index) => (
        <div key={id} className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-slate-50 p-3 rounded-lg border border-dashed border-slate-300 animate-in fade-in">
          <div className="space-y-1">
            <Label className="text-[11px] font-bold text-slate-500 uppercase">Additional Document #{index + 1}</Label>
            <input type="file" className="w-full text-sm" onChange={(e: any) => updateField(`file_extra_${id}`, e.target.files[0])} />
          </div>
          <Button variant="ghost" onClick={() => removeFileSlot(id)} className="text-red-500 w-fit">
            Remove
          </Button>
        </div>
      ))}
      <VinDetailsModal
        open={showVinModal}
        vinData={vinResponse}
        onClose={() => setShowVinModal(false)}
        onApply={() => {
          applyVinToForm(vinResponse);
          setShowVinModal(false);
        }}
      />


    </FormSection>
  );
};
type VinDetailsModalProps = {
  open: boolean;
  vinData: any;
  onClose: () => void;
  onApply: () => void;
};

export const VinDetailsModal = ({
  open,
  vinData,
  onClose,
  onApply,
}: VinDetailsModalProps) => {
  if (!open || !vinData) return null;

  const d = vinData.Results?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 animate-in fade-in zoom-in">
        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-lg font-bold">VIN Details</h2>
          <p className="text-sm text-slate-500">
            Vehicle Information for <b>{d.VIN}</b>
          </p>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Detail label="Vehicle Model Year" value={d.ModelYear} />
          <Detail label="Vehicle Model" value={d.Model} />
          <Detail label="Vehicle Make" value={d.Make} />
          <Detail label="Vehicle Manufacturer" value={d.Manufacturer} />
          <Detail label="Transmission Style" value={d.TransmissionStyle} />
          <Detail label="Engine Cylinders" value={d.EngineCylinders} />
          <Detail label="Engine HP" value={d.EngineHP} />
          <Detail label="Engine KW" value={d.EngineKW || "N/A"} />
          <Detail label="Fuel Type" value={d.FuelTypePrimary} />
          <Detail label="Seat Belts" value={d.SeatBeltsAll} />
          <Detail
            label="Air Bag"
            value={d.AirBagLocFront || "N/A"}
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white font-bold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[11px] uppercase font-bold text-slate-500">
      {label}
    </div>
    <div className="font-medium">{value || "—"}</div>
  </div>
);

import { DataTable } from "@/features/bureau/ui/data-table/DataTable";
import { TableCard } from "@/features/bureau/ui/table-card/TableCard";
import { Check } from "lucide-react";
import { type BureauRow, bureauColumns } from "../config/bureauConfig";

interface BureauTabProps {
    bureauData: BureauRow[];
    toggleBureauStatus: (id: string) => void;
}

export const BureauTab = ({ bureauData, toggleBureauStatus }: BureauTabProps) => {
    return (
        <TableCard>
            <DataTable<BureauRow>
                data={bureauData}
                columns={bureauColumns}
                enableColumnFilters={true}
                enableGlobalSearch={true}
                actions={{
                    header: "IsActive",
                    width: "100px",
                    items: (row) => [
                        {
                            icon: (
                                <div className={`w-4 h-4 rounded-[4px] border transition-all flex items-center justify-center shrink-0 ${row.isActive ? 'bg-[#84cc16] border-[#84cc16] shadow-sm' : 'bg-white border-slate-300'}`}>
                                    {row.isActive && <Check size={12} className="text-white stroke-[3.5]" />}
                                </div>
                            ),
                            label: "Status",
                            onClick: () => toggleBureauStatus(row.id),
                        }
                    ],
                }}
            />
        </TableCard>
    );
};

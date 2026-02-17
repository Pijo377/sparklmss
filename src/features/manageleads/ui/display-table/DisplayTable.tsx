import React from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Configuration for a single column in the DisplayTable.
 * @template T - The type of data row.
 */
export interface DisplayTableColumn<T> {
  /** The text to display in the column header. */
  header: string;
  /** 
   * The key of the data object to display in this column. 
   * Use this for simple text rendering of a property.
   */
  accessorKey?: keyof T;
  /** 
   * A custom render function for the cell content. 
   * Use this for complex rendering (e.g., formatting currency, adding icons).
   * @param row - The data object for the current row.
   * @returns A React node to render in the cell.
   */
  render?: (row: T) => React.ReactNode;
  /** Additional CSS classes to apply to the table cell (td). */
  className?: string;
  /** Additional CSS classes to apply to the table header cell (th). */
  headerClassName?: string;
}

/**
 * Props for the DisplayTable component.
 * @template T - The type of data row.
 */
interface DisplayTableProps<T> {
  /** The array of data objects to display in the table. */
  data: T[];
  /** Configuration array for the table columns. */
  columns: DisplayTableColumn<T>[];
  /** 
   * Callback function fired when a row is clicked.
   * @param row - The data object of the clicked row.
   */
  onRowClick?: (row: T) => void;
  /** 
   * Function to determine if a row should be highlighted as selected.
   * @param row - The data object for the current row.
   * @returns True if the row is selected, false otherwise.
   */
  selectedRowPredicate?: (row: T) => boolean;
  /** Additional CSS classes to apply to the outer container. */
  className?: string;
}

/**
 * A reusable table component designed for displaying data with selection capabilities.
 * It features a styled header, zebra striping, hover effects, and row selection highlighting.
 * 
 * @example
 * ```tsx
 * const columns: DisplayTableColumn<MyData>[] = [
 *   { header: 'Name', accessorKey: 'name' },
 *   { header: 'Amount', render: (row) => `$${row.amount}`, className: 'font-bold' },
 * ];
 * 
 * <DisplayTable 
 *   data={myData} 
 *   columns={columns} 
 *   onRowClick={(row) => setSelected(row.id)}
 *   selectedRowPredicate={(row) => row.id === selectedId}
 * />
 * ```
 */
export function DisplayTable<T>({
  data,
  columns,
  onRowClick,
  selectedRowPredicate,
  className
}: DisplayTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-800 text-slate-100 font-semibold uppercase tracking-wider text-[11px]">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={cn(
                  "px-4 py-3 border-r border-slate-700 last:border-r-0", 
                  col.headerClassName
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row, rowIdx) => {
            const isSelected = selectedRowPredicate ? selectedRowPredicate(row) : false;
            return (
              <tr
                key={rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  "hover:bg-blue-50 transition even:bg-slate-50 cursor-pointer",
                  isSelected ? 'bg-blue-100' : ''
                )}
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={cn(
                      "px-4 py-3 border-r border-slate-100 last:border-r-0", 
                      col.className
                    )}
                  >
                    {col.render 
                      ? col.render(row) 
                      : (col.accessorKey ? String(row[col.accessorKey]) : '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

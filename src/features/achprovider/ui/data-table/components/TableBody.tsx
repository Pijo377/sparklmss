import { flexRender } from "@tanstack/react-table";
import type { Table, Row } from "@tanstack/react-table";
import { cn } from "@/shared/lib/utils";
import type { ColumnDef } from "../types";
import { calculatePinnedRightPositions, STICKY_ACTIONS_WIDTH } from "../utils/pinnedColumns";

interface TableBodyProps<T> {
  table: Table<T>;
  columns: ColumnDef<T>[];
  enableColumnResizing?: boolean;
  stickyActions?: boolean;
  isScrolled?: boolean;
}

/**
 * Table body with data rows
 */
export function TableBody<T>({ 
  table, 
  columns, 
  enableColumnResizing = false,
  stickyActions = false,
  isScrolled = false,
}: TableBodyProps<T>) {
  // Calculate cumulative right positions for pinned columns
  const pinnedRightPositions = calculatePinnedRightPositions(columns);

  return (
    <tbody>
      {table.getRowModel().rows.length > 0 ? (
        table.getRowModel().rows.map((row: Row<T>) => (
          <tr
            key={row.id}
            className="border-b transition-colors hover:bg-muted/50"
          >
            {row.getVisibleCells().map((cell: any) => {
              const columnDef = columns.find(
                (c) => String(c.key) === cell.column.id,
              );
              const isActionsColumn = cell.column.id === "actions";
              const isSelectColumn = cell.column.id === "select";
              const align = (isActionsColumn || isSelectColumn) ? "center" : (columnDef?.align || "left");
              
              // Check if column is pinned
              const pinnedDirection = cell.column.columnDef.meta?.pinned;
              const isPinned = !!pinnedDirection;
              const rightPosition = pinnedRightPositions.get(cell.column.id) || 0;
              
              // Sticky styles for actions column
              const stickyStyles = stickyActions && isActionsColumn ? {
                position: "sticky" as const,
                right: 0,
                width: STICKY_ACTIONS_WIDTH,
                minWidth: STICKY_ACTIONS_WIDTH,
                maxWidth: STICKY_ACTIONS_WIDTH,
                zIndex: 10,
              } : isPinned && pinnedDirection === "right" ? {
                position: "sticky" as const,
                right: rightPosition,
                zIndex: 9,
              } : isPinned && pinnedDirection === "left" ? {
                position: "sticky" as const,
                left: 0,
                zIndex: 9,
              } : {};

              return (
                <td
                  key={cell.id}
                  style={{
                    ...(enableColumnResizing ? {
                      width: cell.column.getSize(),
                      maxWidth: cell.column.getSize(),
                    } : {}),
                    ...stickyStyles,
                  }}
                  className={cn(
                    "px-2.5 py-2.5 transition-shadow duration-200",
                    align === "right" && "text-right",
                    align === "center" && "text-center",
                    align === "left" && "text-left",
                    stickyActions && isActionsColumn && cn("bg-white", isScrolled && "shadow-[inset_4px_0_8px_-4px_rgba(0,0,0,0.1)]"),
                    isPinned && cn("bg-white", isScrolled && pinnedDirection === "right" && "shadow-[inset_4px_0_8px_-4px_rgba(0,0,0,0.1)]"),
                    isPinned && cn("bg-white", isScrolled && pinnedDirection === "left" && "shadow-[inset_-4px_0_8px_-4px_rgba(0,0,0,0.1)]"),
                    // Allow overflow for select dropdowns in pinned columns
                    isPinned && "overflow-visible",
                  )}
                >
                  <div className={cn("text-sm", enableColumnResizing ? "break-words whitespace-normal" : "truncate")}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              );
            })}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="h-24 text-center text-muted-foreground"
          >
            No results found.
          </td>
        </tr>
      )}
    </tbody>
  );
}
